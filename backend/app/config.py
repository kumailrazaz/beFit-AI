import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


class ConfigurationError(RuntimeError):
    """Raised when required application configuration is missing."""


@dataclass(frozen=True)
class Settings:
    openai_api_key: str
    vision_model: str = "gpt-4o"
    text_model: str = "gpt-5-mini"
    max_upload_size_mb: int = 10
    log_level: str = "INFO"
    openai_timeout_seconds: float = 30.0

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


def _load_env_files() -> None:
    backend_dir = Path(__file__).resolve().parents[1]
    repo_root = backend_dir.parent

    load_dotenv(repo_root / ".env", override=False)
    load_dotenv(backend_dir / ".env", override=True)


@lru_cache
def get_settings() -> Settings:
    _load_env_files()

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ConfigurationError(
            "OPENAI_API_KEY is required. Set it in backend/.env or the repository-root .env."
        )

    return Settings(
        openai_api_key=openai_api_key,
        vision_model=os.getenv("VISION_MODEL", "gpt-4o"),
        text_model=os.getenv("TEXT_MODEL", "gpt-5-mini"),
        max_upload_size_mb=int(os.getenv("MAX_UPLOAD_SIZE_MB", "10")),
        log_level=os.getenv("LOG_LEVEL", "INFO"),
    )
