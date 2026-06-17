import json

from app.models.responses import MealScanResponse


SYSTEM_PROMPT = f"""
You are a registered sports nutritionist. Identify visible foods, estimate calories
and macros, score the meal from 0 to 100, and give practical advice. Make conservative
estimates when portions are unclear.
Return only data that matches this JSON schema:
{json.dumps(MealScanResponse.model_json_schema(), indent=2)}
"""


def build_user_prompt() -> str:
    return "Analyze this meal image and estimate foods, calories, macros, health score, and advice."
