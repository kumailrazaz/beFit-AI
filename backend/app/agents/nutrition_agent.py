from app.models.responses import MealScanResponse
from app.prompts import nutrition
from app.services.openai_client import get_openai_client


async def analyze_meal(image_b64: str) -> MealScanResponse:
    result = await get_openai_client().analyze_image(
        image_b64=image_b64,
        system_prompt=nutrition.SYSTEM_PROMPT,
        user_prompt=nutrition.build_user_prompt(),
        response_model=MealScanResponse,
    )
    return MealScanResponse.model_validate(result)
