/* ============================================
   beFit AI — API Service
   ============================================
   
   This service re-exports from the OpenAI integration.
   When the backend is ready, swap these imports to use 
   the Axios-based backend calls instead.
   ============================================ */

// Direct OpenAI integration (current)
export {
  bodyScan,
  mealScan,
  groceryScan,
  generateMealPlan,
  getRecoveryPlan,
  sendChatMessage,
} from './openai';

/* ============================================
   Backend API (for future use)
   ============================================
   
   When the FastAPI backend is ready, uncomment the 
   Axios-based implementation below and remove the 
   OpenAI re-exports above.

import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

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

export const bodyScan = async (file: File): Promise<BodyScanResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<BodyScanResult>('/body-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const mealScan = async (file: File): Promise<MealScanResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<MealScanResult>('/meal-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const groceryScan = async (file: File): Promise<GroceryScanResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<GroceryScanResult>('/grocery-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
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
*/
