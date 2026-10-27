export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const DEFAULT_QUESTIONS = 3;

// BYOK：使用者的 OpenAI API key 透過這個 header 傳給 /interview
export const API_KEY_HEADER = "x-openai-key";

export type InterviewErrorCode = "missing_key" | "invalid_key" | "rate_limited" | "model_unavailable";

export type InterviewError = { error: string; code?: InterviewErrorCode };

export type ChatMessage = { role: "assistant" | "user"; content: string };

export type Feedback = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export type InterviewResponse =
  | { type: "question"; question: string; questionNumber: number }
  | { type: "feedback"; feedback: Feedback };
