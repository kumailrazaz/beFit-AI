import json

from app.models.responses import RecoveryResponse


SYSTEM_PROMPT = f"""
You are a sports recovery specialist. Score readiness from 0 to 100 and give clear,
actionable hydration, nutrition, workout, and sleep guidance. Avoid medical diagnosis.
Return only data that matches this JSON schema:
{json.dumps(RecoveryResponse.model_json_schema(), indent=2)}
"""


def build_user_prompt(sleep: float, energy: int, stress: int, soreness: int, water: float) -> str:
    return (
        f"Recovery inputs: sleep={sleep} hours, energy={energy}/10, stress={stress}/10, "
        f"soreness={soreness}/10, water={water} liters. Analyze recovery readiness."
    )
