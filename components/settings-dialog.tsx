"use client";

import { useEffect, useRef, useState } from "react";
import { clearApiKey, maskApiKey, onOpenSettings, saveApiKey, useApiKey } from "@/lib/api-key";
import { API_KEY_HEADER, type InterviewError } from "@/lib/interview";

export function SettingsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const storedKey = useApiKey();
  const [draft, setDraft] = useState("");
  const [reveal, setReveal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(
    () =>
      onOpenSettings((reason) => {
        setDraft("");
        setReveal(false);
        setError(null);
        setVerifying(false);
        setNotice(reason ?? null);
        dialogRef.current?.showModal();
      }),
    [],
  );

  function close() {
    dialogRef.current?.close();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const key = draft.trim();
    if (verifying) return;
    if (!key.startsWith("sk-") || key.length < 20) {
      setError("格式看起來不正確，OpenAI API key 通常以「sk-」開頭");
      return;
    }

    // 先向 OpenAI 驗證金鑰，有效才儲存
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/interview/verify", {
        method: "POST",
        headers: { [API_KEY_HEADER]: key },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as Partial<InterviewError>;
        setError(data.error ?? "無法驗證金鑰，請稍後再試");
        return;
      }
      saveApiKey(key);
      setNotice(null);
      close();
    } catch {
      setError("無法連線到伺服器，請確認網路後再試");
    } finally {
      setVerifying(false);
    }
  }

  function remove() {
    clearApiKey();
    setDraft("");
    setNotice(null);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="settings-title"
      onCancel={(e) => {
        // 驗證中不允許按 Esc 關閉
        if (verifying) e.preventDefault();
      }}
      onClick={(e) => {
        // 點擊對話框外的背景就關閉
        if (e.target === e.currentTarget && !verifying) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={save} className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-accent">SETTINGS</p>
            <h2 id="settings-title" className="mt-1 font-serif text-2xl font-black">
              OpenAI API 金鑰
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="關閉"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        {notice && (
          <p role="alert" className="rounded-2xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm">
            {notice}
          </p>
        )}

        <p className="text-sm leading-6 text-muted">
          面試官 AI 使用你自己的 OpenAI 帳戶出題與評分（BYOK），費用由你的 OpenAI 帳戶支付。可以到{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline underline-offset-4 hover:text-accent"
          >
            OpenAI 後台
          </a>{" "}
          建立金鑰。
        </p>

        {storedKey && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-sage-soft px-4 py-3 text-sm">
            <span className="flex items-center gap-2 text-sage">
              <span className="size-2 rounded-full bg-sage" />
              已設定
              <code className="font-mono text-ink">{maskApiKey(storedKey)}</code>
            </span>
            <button type="button" onClick={remove} className="text-muted underline-offset-4 hover:text-accent hover:underline">
              移除
            </button>
          </div>
        )}

        <div>
          <label htmlFor="api-key" className="text-sm font-medium">
            {storedKey ? "更換金鑰" : "輸入金鑰"}
          </label>
          <div
            className={`mt-2 flex items-center rounded-2xl border bg-paper pr-2 transition-colors focus-within:border-accent ${
              error ? "border-accent" : "border-line"
            }`}
          >
            <input
              id="api-key"
              type={reveal ? "text" : "password"}
              value={draft}
              disabled={verifying}
              onChange={(e) => {
                setDraft(e.target.value);
                setError(null);
              }}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!!error}
              aria-describedby={error ? "api-key-error" : undefined}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-muted/70 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {reveal ? "隱藏" : "顯示"}
            </button>
          </div>
          {error && (
            <p
              id="api-key-error"
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm leading-6"
            >
              <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-accent-ink">
                !
              </span>
              {error}
            </p>
          )}
        </div>

        <ul className="space-y-1.5 text-xs leading-5 text-muted">
          <li>・金鑰只存在這個瀏覽器的 localStorage，不會上傳到我們的資料庫。</li>
          <li>・每次面試請求時會傳給本站伺服器，用來代你呼叫 OpenAI，伺服器不會保存或記錄。</li>
          <li>・建議在 OpenAI 後台為這把金鑰設定用量上限；在共用電腦上使用後記得移除。</li>
        </ul>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            disabled={verifying}
            className="h-11 rounded-full border border-line px-5 text-sm font-medium transition-colors hover:border-ink disabled:opacity-40"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={!draft.trim() || verifying}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-ink transition-opacity disabled:opacity-40"
          >
            {verifying && (
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-accent-ink/30 border-t-accent-ink" />
            )}
            {verifying ? "驗證中…" : "驗證並儲存"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
