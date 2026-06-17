from app.models.responses import BudgetMealResponse
from app.prompts import planner
from app.services.openai_client import get_openai_client


async def plan_meals(budget: float, goal: str, country: str) -> BudgetMealResponse:
    result = await get_openai_client().generate_text(
        system_prompt=planner.SYSTEM_PROMPT,
        user_prompt=planner.build_user_prompt(budget, goal, country),
        response_model=BudgetMealResponse,
    )
    return BudgetMealResponse.model_validate(result)
