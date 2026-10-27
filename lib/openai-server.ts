import OpenAI from "openai";
import { API_KEY_HEADER, type InterviewError } from "@/lib/interview";

export const MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";
const MAX_API_KEY_LENGTH = 300;

export function errorResponse(status: number, body: InterviewError) {
  return Response.json(body, { status });
}

/**
 * 依請求 header 中使用者提供的金鑰建立 OpenAI client。
 * 金鑰只用於這次請求，不會被儲存或寫進 log。沒有金鑰時回傳錯誤 Response。
 */
export function clientFromRequest(request: Request): OpenAI | Response {
  const apiKey = request.headers.get(API_KEY_HEADER)?.trim();
  if (!apiKey || apiKey.length > MAX_API_KEY_LENGTH) {
    return errorResponse(401, { error: "請先在設定中輸入你的 OpenAI API key", code: "missing_key" });
  }
  return new OpenAI({ apiKey });
}

/** 把 OpenAI 的錯誤轉成給使用者看的訊息 */
export function openAIErrorResponse(error: unknown, logLabel: string) {
  if (error instanceof OpenAI.AuthenticationError) {
    return errorResponse(401, { error: "OpenAI API key 無效，請確認金鑰是否輸入正確", code: "invalid_key" });
  }
  if (error instanceof OpenAI.RateLimitError) {
    return errorResponse(429, {
      error: "這組 API key 的額度不足或請求太頻繁，請確認 OpenAI 帳戶餘額後再試",
      code: "rate_limited",
    });
  }
  if (error instanceof OpenAI.PermissionDeniedError || error instanceof OpenAI.NotFoundError) {
    return errorResponse(403, {
      error: `這組 API key 無法使用模型 ${MODEL}，請確認帳戶權限`,
      code: "model_unavailable",
    });
  }
  // 只記錄狀態與訊息，避免把請求內容（含金鑰）寫進 log
  const status = error instanceof OpenAI.APIError ? error.status : undefined;
  console.error(`[${logLabel}] OpenAI request failed:`, status, error instanceof Error ? error.message : error);
  return errorResponse(502, { error: "暫時無法連線到 OpenAI，請稍後再試" });
}
