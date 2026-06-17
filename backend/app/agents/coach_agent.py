from app.models.responses import ChatResponse
from app.prompts.coach import SYSTEM_PROMPT
from app.services.openai_client import get_openai_client


async def chat(message: str, context: str | None = None) -> ChatResponse:
    result = await get_openai_client().chat(
        system_prompt=SYSTEM_PROMPT,
        user_message=message,
        context=context,
        response_model=ChatResponse,
    )
    return ChatResponse.model_validate(result)
