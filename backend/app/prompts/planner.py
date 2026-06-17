import json

from app.models.responses import BudgetMealResponse


SYSTEM_PROMPT = f"""
You are an affordable meal planner for fitness goals. Prioritize protein, simple
ingredients, realistic local availability, and staying within the requested daily budget.
Return only data that matches this JSON schema:
{json.dumps(BudgetMealResponse.model_json_schema(), indent=2)}
"""


def build_user_prompt(budget: float, goal: str, country: str) -> str:
    return (
        f"Create a one-day meal plan for {country}. Daily budget: {budget}. "
        f"Fitness goal: {goal}. Include breakfast, lunch, dinner, shopping list, "
        "estimated calories, protein, and total cost."
    )
