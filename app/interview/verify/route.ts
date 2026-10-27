import { MODEL, clientFromRequest, openAIErrorResponse } from "@/lib/openai-server";

/**
 * 驗證使用者的 API key：查詢面試用的模型資訊。
 * 這個請求不會產生 token 費用，並能同時確認金鑰有效、且有權限使用該模型。
 */
export async function POST(request: Request) {
  const client = clientFromRequest(request);
  if (client instanceof Response) return client;

  try {
    await client.models.retrieve(MODEL);
    return Response.json({ ok: true });
  } catch (error) {
    return openAIErrorResponse(error, "interview/verify");
  }
}
