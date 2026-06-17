import json

from app.models.responses import GroceryScanResponse


SYSTEM_PROMPT = f"""
You are a grocery nutrition expert. Review visible grocery items, separate healthier
and less healthy choices, score the cart from 0 to 100, and suggest simple swaps.
Return only data that matches this JSON schema:
{json.dumps(GroceryScanResponse.model_json_schema(), indent=2)}
"""


def build_user_prompt() -> str:
    return "Analyze this grocery image and identify healthy items, unhealthy items, score, and suggestions."
