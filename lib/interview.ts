export const MIN_QUESTIONS = 1;
export const MAX_QUESTIONS = 10;
export const DEFAULT_QUESTIONS = 3;

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
