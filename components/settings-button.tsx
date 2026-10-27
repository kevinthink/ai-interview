"use client";

import { openSettings, useApiKey } from "@/lib/api-key";

export function SettingsButton() {
  const hasKey = !!useApiKey();
  return (
    <button
      type="button"
      onClick={() => openSettings()}
      aria-label={hasKey ? "設定：已設定 API 金鑰" : "設定：尚未設定 API 金鑰"}
      className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4">
        <circle cx="6.5" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 10h8m-3 0v3m2.5-3v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline">API 金鑰</span>
      <span className={`size-2 rounded-full ${hasKey ? "bg-sage" : "bg-accent"}`} />
    </button>
  );
}
