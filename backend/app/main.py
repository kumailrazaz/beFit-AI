from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import get_settings
from app.services.rag_service import rag_service
from app.utils.exceptions import register_exception_handlers
from app.utils.logger import add_request_logging, configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings)

    app = FastAPI(
        title="beFit AI Backend",
        description="AI fitness assistant backend powered by OpenAI.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)
    add_request_logging(app)
    register_exception_handlers(app)

    @app.on_event("startup")
    async def startup() -> None:
        get_settings()
        rag_service.load()

    return app


app = create_app()
