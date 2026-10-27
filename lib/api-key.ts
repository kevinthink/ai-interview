"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ai-interview:openai-api-key";
const CHANGE_EVENT = "ai-interview:api-key-change";
const OPEN_SETTINGS_EVENT = "ai-interview:open-settings";

// 私密視窗或封鎖網站資料時，localStorage 可能無法使用，因此讀寫都要包 try/catch
export function getApiKey(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } finally {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function clearApiKey() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } finally {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

function subscribe(onChange: () => void) {
  // storage 事件讓其他分頁的修改也能同步
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** 目前儲存的 API key；伺服器端渲染時一律為 null */
export function useApiKey() {
  return useSyncExternalStore(subscribe, getApiKey, () => null);
}

/** 只顯示前後幾碼，避免金鑰完整出現在畫面上 */
export function maskApiKey(key: string) {
  if (key.length <= 12) return "••••••••";
  return `${key.slice(0, 7)}••••${key.slice(-4)}`;
}

export function openSettings(reason?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT, { detail: reason }));
}

export function onOpenSettings(handler: (reason?: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string | undefined>).detail);
  window.addEventListener(OPEN_SETTINGS_EVENT, listener);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, listener);
}
