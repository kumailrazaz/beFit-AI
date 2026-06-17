import type {
  BodyScanResult,
  MealScanResult,
  GroceryScanResult,
  MealPlanRequest,
  MealPlanResult,
  RecoveryRequest,
  RecoveryResult,
  ChatResponse,
} from '../types';

/* ============================================
   OpenAI Direct Integration
   ============================================ */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  }
  return key;
}

/* ============================================
   Helper: Convert File to base64
   ============================================ */

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/xxx;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================================
   Helper: Call OpenAI API
   ============================================ */

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenAIContentPart[];
}

interface OpenAIContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

async function callOpenAI(messages: OpenAIMessage[], jsonMode = true): Promise<string> {
  const apiKey = getApiKey();

  const body: Record<string, unknown> = {
    model: 'gpt-4o',
    messages,
    max_tokens: 2000,
    temperature: 0.7,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = (errorData as { error?: { message?: string } })?.error?.message || `OpenAI API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return (data as { choices: { message: { content: string } }[] }).choices[0].message.content;
}

/* ============================================
   Body Scan
   ============================================ */

export async function bodyScan(file: File): Promise<BodyScanResult> {
  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert fitness and body composition analyst. Analyze the body photo provided and return a JSON response with the following structure:
{
  "body_fat": "estimated body fat percentage as a string (e.g. '15-18%')",
  "muscle_development": "overall assessment as a string (e.g. 'Well-developed upper body, moderate lower body')",
  "strengths": ["array of 3-4 physical strengths"],
  "weaknesses": ["array of 3-4 areas that need improvement"],
  "workout_split": "detailed recommended workout split",
  "nutrition_advice": "personalized nutrition recommendations"
}
Be encouraging but honest. Provide actionable advice.`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Please analyze my body composition from this photo and provide detailed fitness recommendations.' },
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
            detail: 'high',
          },
        },
      ],
    },
  ];

  const result = await callOpenAI(messages);
  return JSON.parse(result) as BodyScanResult;
}

/* ============================================
   Meal Scan
   ============================================ */

export async function mealScan(file: File): Promise<MealScanResult> {
  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert nutritionist. Analyze the meal photo and return a JSON response with:
{
  "foods": ["array of detected food items"],
  "calories": number (total estimated calories),
  "protein": number (grams of protein),
  "carbs": number (grams of carbohydrates),
  "fat": number (grams of fat),
  "health_score": number (1-10 health rating),
  "advice": "nutritional advice and suggestions for improvement"
}
Be precise with nutritional estimates. Provide practical advice.`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze this meal photo and provide a complete nutritional breakdown.' },
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
            detail: 'high',
          },
        },
      ],
    },
  ];

  const result = await callOpenAI(messages);
  return JSON.parse(result) as MealScanResult;
}

/* ============================================
   Grocery Scan
   ============================================ */

export async function groceryScan(file: File): Promise<GroceryScanResult> {
  const base64 = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert nutritionist and grocery shopping advisor. Analyze the grocery cart/items photo and return a JSON response with:
{
  "healthy_items": ["array of healthy items identified"],
  "unhealthy_items": ["array of unhealthy or less nutritious items"],
  "score": number (1-10 overall healthiness score),
  "suggestions": ["array of 4-6 specific suggestions for healthier alternatives or improvements"]
}
Be specific about why items are healthy or unhealthy. Provide practical swap suggestions.`,
    },
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Analyze my grocery cart/items and help me make healthier choices.' },
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
            detail: 'high',
          },
        },
      ],
    },
  ];

  const result = await callOpenAI(messages);
  return JSON.parse(result) as GroceryScanResult;
}

/* ============================================
   Meal Planner
   ============================================ */

export async function generateMealPlan(data: MealPlanRequest): Promise<MealPlanResult> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert meal planner and nutritionist. Create a daily meal plan based on the user's requirements. Return a JSON response with:
{
  "breakfast": "detailed breakfast meal description with portion sizes",
  "lunch": "detailed lunch meal description with portion sizes",
  "dinner": "detailed dinner meal description with portion sizes",
  "shopping_list": ["array of all ingredients needed"],
  "calories": number (total daily calories),
  "protein": number (total daily protein in grams),
  "total_cost": number (estimated total cost in USD)
}
Make meals practical, delicious, and aligned with the user's goals. Keep costs realistic for the specified country.`,
    },
    {
      role: 'user',
      content: `Create a daily meal plan with these requirements:
- Daily budget: $${data.budget}
- Fitness goal: ${data.goal}
- Country/Region: ${data.country}

Please provide practical, locally available meals within budget.`,
    },
  ];

  const result = await callOpenAI(messages);
  return JSON.parse(result) as MealPlanResult;
}

/* ============================================
   Recovery Coach
   ============================================ */

export async function getRecoveryPlan(data: RecoveryRequest): Promise<RecoveryResult> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert sports recovery coach and physiologist. Based on the user's current state, provide a personalized recovery plan. Return a JSON response with:
{
  "score": number (0-100 recovery score),
  "hydration": "detailed hydration advice",
  "workout": "workout recommendation for today based on recovery state",
  "nutrition": "nutrition recommendations for recovery",
  "sleep_advice": "sleep optimization tips"
}
Be specific and actionable with all recommendations.`,
    },
    {
      role: 'user',
      content: `Here's how I'm feeling today:
- Sleep: ${data.sleep} hours last night
- Energy Level: ${data.energy}/10
- Stress Level: ${data.stress}/10
- Muscle Soreness: ${data.soreness}/10
- Water Intake: ${data.water} liters today

Please create a personalized recovery plan based on my current state.`,
    },
  ];

  const result = await callOpenAI(messages);
  return JSON.parse(result) as RecoveryResult;
}

/* ============================================
   AI Chat
   ============================================ */

const chatHistory: OpenAIMessage[] = [];

export async function sendChatMessage(data: { message: string }): Promise<ChatResponse> {
  // Initialize system message if first message
  if (chatHistory.length === 0) {
    chatHistory.push({
      role: 'system',
      content: `You are beFit AI, an expert AI fitness coach. You help users with:
- Workout planning and exercise form
- Nutrition advice and meal suggestions
- Recovery and injury prevention
- Weight management
- General health and wellness

Be friendly, encouraging, knowledgeable, and concise. Use emojis sparingly. 
Provide evidence-based advice. If something is beyond your expertise (medical issues), recommend consulting a professional.
Keep responses focused and actionable.`,
    });
  }

  // Add user message
  chatHistory.push({
    role: 'user',
    content: data.message,
  });

  const result = await callOpenAI(chatHistory, false);

  // Add assistant response to history
  chatHistory.push({
    role: 'assistant',
    content: result,
  });

  return { reply: result };
}
