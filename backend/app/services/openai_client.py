import json
from collections.abc import Callable, Awaitable
from functools import lru_cache
from typing import TypeVar

import httpx
from openai import APIConnectionError, APIError, APITimeoutError, AsyncOpenAI
from openai import RateLimitError as OpenAIRateLimitError
from pydantic import BaseModel, ValidationError

from app.config import get_settings
from app.utils.exceptions import AIServiceError, AIServiceTimeoutError, RateLimitError
from app.utils.logger import get_openai_logger


ResponseT = TypeVar("ResponseT", bound=BaseModel)


class OpenAIClient:
    def __init__(self) -> None:
        settings = get_settings()
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=httpx.Timeout(settings.openai_timeout_seconds),
        )
        self._logger = get_openai_logger()

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ResponseT],
    ) -> ResponseT:
        async def request() -> ResponseT:
            response = await self._client.responses.parse(
                model=self._settings.text_model,
                input=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                text_format=response_model,
            )
            return self._extract_parsed_response(response, response_model)

        return await self._call_with_retries("text", request)

    async def analyze_image(
        self,
        image_b64: str,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ResponseT],
    ) -> ResponseT:
        async def request() -> ResponseT:
            response = await self._client.responses.parse(
                model=self._settings.vision_model,
                input=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "input_text", "text": user_prompt},
                            {
                                "type": "input_image",
                                "image_url": f"data:image/jpeg;base64,{image_b64}",
                            },
                        ],
                    },
                ],
                text_format=response_model,
            )
            return self._extract_parsed_response(response, response_model)

        return await self._call_with_retries("vision", request)

    async def chat(
        self,
        system_prompt: str,
        user_message: str,
        context: str | None,
        response_model: type[ResponseT],
    ) -> ResponseT:
        context_block = f"\n\nRelevant knowledge:\n{context}" if context else ""
        user_prompt = f"{user_message}{context_block}"
        return await self.generate_text(system_prompt, user_prompt, response_model)

    async def _call_with_retries(
        self,
        operation: str,
        request: Callable[[], Awaitable[ResponseT]],
    ) -> ResponseT:
        last_error: Exception | None = None
        for attempt in range(3):
            try:
                return await request()
            except (APITimeoutError, httpx.TimeoutException, TimeoutError) as exc:
                self._logger.warning("%s OpenAI request timed out", operation)
                raise AIServiceTimeoutError() from exc
            except OpenAIRateLimitError as exc:
                raise RateLimitError() from exc
            except (ValidationError, json.JSONDecodeError, ValueError) as exc:
                last_error = exc
                self._logger.warning(
                    "%s OpenAI structured output parse failed on attempt %s",
                    operation,
                    attempt + 1,
                )
            except (APIConnectionError, APIError) as exc:
                self._logger.exception("%s OpenAI service error", operation)
                raise AIServiceError() from exc

        raise AIServiceError("AI service returned invalid structured output") from last_error

    @staticmethod
    def _extract_parsed_response(response: object, response_model: type[ResponseT]) -> ResponseT:
        parsed = getattr(response, "output_parsed", None)
        if parsed is None:
            raise ValueError("OpenAI response did not include parsed output")
        return response_model.model_validate(parsed)


@lru_cache
def get_openai_client() -> OpenAIClient:
    return OpenAIClient()
