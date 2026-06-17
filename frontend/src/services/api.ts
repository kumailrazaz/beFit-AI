import axios, { AxiosError, type AxiosResponse } from 'axios';
import type {
  BodyScanResult,
  MealScanResult,
  GroceryScanResult,
  MealPlanRequest,
  MealPlanResult,
  RecoveryRequest,
  RecoveryResult,
  ChatRequest,
  ChatResponse,
} from '../types';

type BackendBodyScanResult = Omit<BodyScanResult, 'workout_split' | 'nutrition_advice'> & {
  workout_split: string[];
  nutrition_advice: string[];
};

type BackendMealScanResult = Omit<MealScanResult, 'advice'> & {
  advice: string[];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject({ message, status: error.response?.status });
  }
);

function appendImage(file: File): FormData {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
}

function toDisplayText(value: string | string[]): string {
  return Array.isArray(value) ? value.join('\n') : value;
}

function normalizeScore(score: number): number {
  return score > 10 ? Math.round(score / 10) : score;
}

export const bodyScan = async (file: File): Promise<BodyScanResult> => {
  const response = await api.post<BackendBodyScanResult>('/body-scan', appendImage(file));
  return {
    ...response.data,
    workout_split: toDisplayText(response.data.workout_split),
    nutrition_advice: toDisplayText(response.data.nutrition_advice),
  };
};

export const mealScan = async (file: File): Promise<MealScanResult> => {
  const response = await api.post<BackendMealScanResult>('/meal-scan', appendImage(file));
  return {
    ...response.data,
    health_score: normalizeScore(response.data.health_score),
    advice: toDisplayText(response.data.advice),
  };
};

export const groceryScan = async (file: File): Promise<GroceryScanResult> => {
  const response = await api.post<GroceryScanResult>('/grocery-scan', appendImage(file));
  return {
    ...response.data,
    score: normalizeScore(response.data.score),
  };
};

export const generateMealPlan = async (data: MealPlanRequest): Promise<MealPlanResult> => {
  const response = await api.post<MealPlanResult>('/budget-meal', data);
  return response.data;
};

export const getRecoveryPlan = async (data: RecoveryRequest): Promise<RecoveryResult> => {
  const response = await api.post<RecoveryResult>('/recovery', data);
  return response.data;
};

export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat', data);
  return response.data;
};

export default api;
