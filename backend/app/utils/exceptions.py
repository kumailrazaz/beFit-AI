from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError


class ImageValidationError(ValueError):
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST) -> None:
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


class AIServiceError(RuntimeError):
    def __init__(self, detail: str = "AI service unavailable") -> None:
        super().__init__(detail)
        self.detail = detail


class AIServiceTimeoutError(AIServiceError):
    def __init__(self) -> None:
        super().__init__("AI service timeout")


class RateLimitError(AIServiceError):
    def __init__(self) -> None:
        super().__init__("AI service rate limit exceeded")


async def _json_error(_: Request, status_code: int, detail: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"detail": detail})


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(ImageValidationError)
    async def image_validation_handler(request: Request, exc: ImageValidationError) -> JSONResponse:
        return await _json_error(request, exc.status_code, exc.detail)

    @app.exception_handler(AIServiceTimeoutError)
    async def ai_timeout_handler(request: Request, exc: AIServiceTimeoutError) -> JSONResponse:
        return await _json_error(request, status.HTTP_503_SERVICE_UNAVAILABLE, exc.detail)

    @app.exception_handler(RateLimitError)
    async def rate_limit_handler(request: Request, exc: RateLimitError) -> JSONResponse:
        return await _json_error(request, status.HTTP_429_TOO_MANY_REQUESTS, exc.detail)

    @app.exception_handler(AIServiceError)
    async def ai_service_handler(request: Request, exc: AIServiceError) -> JSONResponse:
        return await _json_error(request, status.HTTP_503_SERVICE_UNAVAILABLE, exc.detail)

    @app.exception_handler(ValidationError)
    async def validation_handler(request: Request, _: ValidationError) -> JSONResponse:
        return await _json_error(request, status.HTTP_422_UNPROCESSABLE_ENTITY, "Invalid AI response shape")

    @app.exception_handler(Exception)
    async def unexpected_handler(request: Request, _: Exception) -> JSONResponse:
        return await _json_error(request, status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal server error")
