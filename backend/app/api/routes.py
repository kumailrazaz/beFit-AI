from fastapi import APIRouter, File, UploadFile

from app.agents.coach_agent import chat
from app.agents.fitness_agent import analyze_body
from app.agents.grocery_agent import analyze_grocery
from app.agents.nutrition_agent import analyze_meal
from app.agents.planner_agent import plan_meals
from app.agents.recovery_agent import analyze_recovery
from app.models.requests import BudgetMealRequest, ChatRequest, RecoveryRequest
from app.models.responses import (
    BodyScanResponse,
    BudgetMealResponse,
    ChatResponse,
    GroceryScanResponse,
    MealScanResponse,
    RecoveryResponse,
)
from app.services.rag_service import rag_service
from app.services.vision_service import process_upload


router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    context = rag_service.retrieve(request.message)
    return await chat(request.message, context)


@router.post("/recovery", response_model=RecoveryResponse)
async def recovery_endpoint(request: RecoveryRequest) -> RecoveryResponse:
    return await analyze_recovery(
        sleep=request.sleep,
        energy=request.energy,
        stress=request.stress,
        soreness=request.soreness,
        water=request.water,
    )


@router.post("/budget-meal", response_model=BudgetMealResponse)
async def budget_meal_endpoint(request: BudgetMealRequest) -> BudgetMealResponse:
    return await plan_meals(
        budget=request.budget,
        goal=request.goal,
        country=request.country,
    )


@router.post("/meal-scan", response_model=MealScanResponse)
async def meal_scan_endpoint(image: UploadFile = File(...)) -> MealScanResponse:
    image_b64 = await process_upload(image)
    return await analyze_meal(image_b64)


@router.post("/grocery-scan", response_model=GroceryScanResponse)
async def grocery_scan_endpoint(image: UploadFile = File(...)) -> GroceryScanResponse:
    image_b64 = await process_upload(image)
    return await analyze_grocery(image_b64)


@router.post("/body-scan", response_model=BodyScanResponse)
async def body_scan_endpoint(image: UploadFile = File(...)) -> BodyScanResponse:
    image_b64 = await process_upload(image)
    return await analyze_body(image_b64)
