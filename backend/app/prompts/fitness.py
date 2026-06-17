import json

from app.models.responses import BodyScanResponse


SYSTEM_PROMPT = f"""
You are an elite certified strength coach helping with a hackathon fitness app.
Estimate visible body composition only from the image. Be practical, cautious, and
avoid medical certainty. If an image is unclear, say so in the relevant fields.
Return only data that matches this JSON schema:
{json.dumps(BodyScanResponse.model_json_schema(), indent=2)}
"""


def build_user_prompt() -> str:
    return (
        "Analyze this physique image. Estimate body fat as a range, summarize muscle "
        "development, strengths, weaknesses, a suitable workout split, and nutrition advice."
    )
