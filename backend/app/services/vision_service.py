import base64
import io
from pathlib import Path

from fastapi import UploadFile, status
from PIL import Image, ImageOps, UnidentifiedImageError

from app.config import get_settings
from app.utils.exceptions import ImageValidationError


ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_DIMENSION = 2048


async def process_upload(file: UploadFile) -> str:
    _validate_file_metadata(file)

    contents = await file.read()
    settings = get_settings()
    if len(contents) > settings.max_upload_size_bytes:
        raise ImageValidationError(
            f"Image exceeds {settings.max_upload_size_mb} MB upload limit",
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
        )

    try:
        with Image.open(io.BytesIO(contents)) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")

            output = io.BytesIO()
            image.save(output, format="JPEG", quality=88, optimize=True)
    except UnidentifiedImageError as exc:
        raise ImageValidationError("Uploaded file is not a valid image") from exc

    return base64.b64encode(output.getvalue()).decode("utf-8")


def _validate_file_metadata(file: UploadFile) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise ImageValidationError("Unsupported image extension")

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise ImageValidationError("Unsupported image MIME type")
