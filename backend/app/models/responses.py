from pydantic import BaseModel, ConfigDict, Field


class StrictResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")


class BodyScanResponse(StrictResponse):
    body_fat: str = Field(description="Estimated body fat range, not a medical diagnosis.")
    muscle_development: str
    strengths: list[str]
    weaknesses: list[str]
    workout_split: list[str]
    nutrition_advice: list[str]


class MealScanResponse(StrictResponse):
    foods: list[str]
    calories: int = Field(ge=0)
    protein: float = Field(ge=0)
    carbs: float = Field(ge=0)
    fat: float = Field(ge=0)
    health_score: int = Field(ge=0, le=100)
    advice: list[str]


class GroceryScanResponse(StrictResponse):
    healthy_items: list[str]
    unhealthy_items: list[str]
    score: int = Field(ge=0, le=100)
    suggestions: list[str]


class BudgetMealResponse(StrictResponse):
    breakfast: str
    lunch: str
    dinner: str
    shopping_list: list[str]
    calories: int = Field(ge=0)
    protein: float = Field(ge=0)
    total_cost: float = Field(ge=0)


class RecoveryResponse(StrictResponse):
    score: int = Field(ge=0, le=100)
    hydration: str
    nutrition: str
    workout: str
    sleep_advice: str


class ChatResponse(StrictResponse):
    reply: str


class ErrorResponse(StrictResponse):
    detail: str
