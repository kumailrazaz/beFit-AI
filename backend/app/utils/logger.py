import logging
import time
from collections.abc import Callable, Awaitable

from fastapi import FastAPI, Request, Response

from app.config import Settings


def configure_logging(settings: Settings) -> None:
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def get_openai_logger() -> logging.Logger:
    return logging.getLogger("befit.openai")


def add_request_logging(app: FastAPI) -> None:
    logger = logging.getLogger("befit.requests")

    @app.middleware("http")
    async def request_logging_middleware(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        started = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - started) * 1000
        logger.info(
            "method=%s path=%s status=%s latency_ms=%.2f",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
