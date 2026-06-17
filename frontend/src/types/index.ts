/* ============================================
   beFit AI — Type Definitions
   ============================================ */

// --- API Response Types ---

export interface BodyScanResult {
  body_fat: string;
  muscle_development: string;
  strengths: string[];
  weaknesses: string[];
  workout_split: string;
  nutrition_advice: string;
}

export interface MealScanResult {
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  health_score: number;
  advice: string;
}

export interface GroceryScanResult {
  healthy_items: string[];
  unhealthy_items: string[];
  score: number;
  suggestions: string[];
}

export interface MealPlanRequest {
  budget: number;
  goal: string;
  country: string;
}

export interface MealPlanResult {
  breakfast: string;
  lunch: string;
  dinner: string;
  shopping_list: string[];
  calories: number;
  protein: number;
  total_cost: number;
}

export interface RecoveryRequest {
  sleep: number;
  energy: number;
  stress: number;
  soreness: number;
  water: number;
}

export interface RecoveryResult {
  score: number;
  hydration: string;
  workout: string;
  nutrition: string;
  sleep_advice: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

// --- UI Types ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  gradient: 'green' | 'blue' | 'purple';
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// --- Component Props ---

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'blue' | 'purple' | 'danger';
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isDragging: boolean;
}
