from app.models.responses import BodyScanResponse
from app.prompts import fitness
from app.services.openai_client import get_openai_client


async def analyze_body(image_b64: str) -> BodyScanResponse:
    result = await get_openai_client().analyze_image(
        image_b64=image_b64,
        system_prompt=fitness.SYSTEM_PROMPT,
        user_prompt=fitness.build_user_prompt(),
        response_model=BodyScanResponse,
    )
    return BodyScanResponse.model_validate(result)
