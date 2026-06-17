from app.models.responses import RecoveryResponse
from app.prompts import recovery
from app.services.openai_client import get_openai_client


async def analyze_recovery(
    sleep: float,
    energy: int,
    stress: int,
    soreness: int,
    water: float,
) -> RecoveryResponse:
    result = await get_openai_client().generate_text(
        system_prompt=recovery.SYSTEM_PROMPT,
        user_prompt=recovery.build_user_prompt(sleep, energy, stress, soreness, water),
        response_model=RecoveryResponse,
    )
    return RecoveryResponse.model_validate(result)
