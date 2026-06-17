from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class BudgetMealRequest(StrictModel):
    budget: float = Field(gt=0, description="Daily food budget in the user's local currency.")
    goal: str = Field(min_length=2, max_length=120)
    country: str = Field(min_length=2, max_length=80)


class RecoveryRequest(StrictModel):
    sleep: float = Field(ge=0, le=24, description="Hours slept last night.")
    energy: int = Field(ge=1, le=10)
    stress: int = Field(ge=1, le=10)
    soreness: int = Field(ge=1, le=10)
    water: float = Field(ge=0, le=20, description="Water intake in liters.")


class ChatRequest(StrictModel):
    message: str = Field(min_length=1, max_length=2000)
