from app.models.responses import GroceryScanResponse
from app.prompts import grocery
from app.services.openai_client import get_openai_client


async def analyze_grocery(image_b64: str) -> GroceryScanResponse:
    result = await get_openai_client().analyze_image(
        image_b64=image_b64,
        system_prompt=grocery.SYSTEM_PROMPT,
        user_prompt=grocery.build_user_prompt(),
        response_model=GroceryScanResponse,
    )
    return GroceryScanResponse.model_validate(result)
