"use client";

import { useEffect, useRef, useState } from "react";
import { openSettings, useApiKey } from "@/lib/api-key";
import {
  API_KEY_HEADER,
  DEFAULT_QUESTIONS,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
  type ChatMessage,
  type Feedback,
  type InterviewError,
  type InterviewResponse,
} from "@/lib/interview";

type Phase = "setup" | "interview" | "result";

export default function PracticePage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [jobDescription, setJobDescription] = useState("");
  // 用字串保存，讓使用者可以先清空再輸入新的數字
  const [questionInput, setQuestionInput] = useState(String(DEFAULT_QUESTIONS));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const apiKey = useApiKey();

  const totalQuestions = Number(questionInput);
  const questionCountValid =
    Number.isInteger(totalQuestions) &&
    totalQuestions >= MIN_QUESTIONS &&
    totalQuestions <= MAX_QUESTIONS;

  useEffect(() => {
    if (phase === "interview") bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, phase]);

  useEffect(() => {
    if (phase === "result") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  async function callInterview(history: ChatMessage[]) {
    if (!apiKey) {
      openSettings("開始面試前，請先設定你的 OpenAI API key。");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json", [API_KEY_HEADER]: apiKey },
        body: JSON.stringify({ jobDescription, totalQuestions, messages: history }),
      });
      const data = await res.json();
      if (!res.ok) {
        const { error, code } = data as InterviewError;
        if (code === "missing_key" || code === "invalid_key") openSettings(error);
        throw new Error(error ?? "發生錯誤，請稍後再試");
      }

      const result = data as InterviewResponse;
      if (result.type === "question") {
        setMessages([...history, { role: "assistant", content: result.question }]);
        setQuestionNumber(result.questionNumber);
        setPhase("interview");
      } else {
        setMessages(history);
        setFeedback(result.feedback);
        setPhase("result");
      }
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤，請稍後再試");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function startInterview(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!jobDescription.trim() || !questionCountValid || loading) return;
    setMessages([]);
    setFeedback(null);
    callInterview([]);
  }

  async function submitAnswer(e: React.FormEvent) {
    e.preventDefault();
    const content = answer.trim();
    if (!content || loading) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(history);
    setAnswer("");
    if (!(await callInterview(history))) {
      // 失敗時還原，讓使用者可以重新送出
      setMessages(messages);
      setAnswer(content);
    }
  }

  function backToSetup() {
    setPhase("setup");
    setMessages([]);
    setQuestionNumber(0);
    setAnswer("");
    setFeedback(null);
    setError(null);
  }

  function stepCount(delta: number) {
    const base = questionCountValid ? totalQuestions : DEFAULT_QUESTIONS;
    setQuestionInput(String(Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, base + delta))));
  }

  return (
    <main className="bg-dots relative flex-1">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/60 to-paper" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
        <StageIndicator phase={phase} />

        {phase === "setup" && (
          <form onSubmit={startInterview} className="animate-rise flex flex-col gap-6">
            <div>
              <h1 className="font-serif text-4xl font-black leading-tight">設定你的模擬面試</h1>
              <p className="mt-3 text-muted">貼上職缺描述並選擇題數，面試官會依此出題，最後給你評分與建議。</p>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_20px_50px_-35px_rgb(0_0_0/0.4)]">
              <label htmlFor="jd" className="flex items-baseline justify-between text-sm font-medium">
                職缺描述
                <span className="font-mono text-xs font-normal text-muted">{jobDescription.length} / 5000</span>
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
                rows={9}
                placeholder="例如：前端工程師，熟悉 React、TypeScript，有大型專案效能優化經驗……"
                className="mt-3 w-full resize-y rounded-2xl border border-line bg-paper p-4 leading-7 outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
              />

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <div>
                  <label htmlFor="question-count" className="text-sm font-medium">
                    題目數量
                  </label>
                  <p
                    id="question-count-hint"
                    className={`mt-1 text-xs ${questionCountValid ? "text-muted" : "text-accent"}`}
                  >
                    請輸入 {MIN_QUESTIONS}–{MAX_QUESTIONS} 之間的整數
                  </p>
                </div>
                <div className="flex items-center rounded-full border border-line bg-paper p-1">
                  <StepButton label="減少一題" onClick={() => stepCount(-1)} disabled={questionCountValid && totalQuestions <= MIN_QUESTIONS}>
                    −
                  </StepButton>
                  <input
                    id="question-count"
                    type="number"
                    inputMode="numeric"
                    min={MIN_QUESTIONS}
                    max={MAX_QUESTIONS}
                    step={1}
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    aria-invalid={!questionCountValid}
                    aria-describedby="question-count-hint"
                    className="w-14 bg-transparent text-center font-serif text-xl font-black outline-none [appearance:textfield] aria-invalid:text-accent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <StepButton label="增加一題" onClick={() => stepCount(1)} disabled={questionCountValid && totalQuestions >= MAX_QUESTIONS}>
                    +
                  </StepButton>
                </div>
              </div>
            </div>

            <ApiKeyStatus apiKey={apiKey} />

            <button
              type="submit"
              disabled={loading || !apiKey || !jobDescription.trim() || !questionCountValid}
              className="h-14 rounded-full bg-accent font-medium text-accent-ink shadow-[0_10px_30px_-12px_var(--accent)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? "面試官準備中…" : "開始面試"}
            </button>
          </form>
        )}

        {phase === "interview" && (
          <section className="flex flex-col gap-6">
            <ProgressBar current={questionNumber} total={totalQuestions} />
            <Transcript messages={messages} loading={loading} />
            <form
              onSubmit={submitAnswer}
              className="sticky bottom-4 rounded-3xl border border-line bg-surface p-3 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.45)]"
            >
              <label htmlFor="answer" className="sr-only">
                你的回答
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitAnswer(e);
                }}
                maxLength={4000}
                rows={4}
                disabled={loading}
                placeholder="輸入你的回答……"
                className="w-full resize-none bg-transparent p-3 leading-7 outline-none placeholder:text-muted/70 disabled:opacity-50"
              />
              <div className="flex items-center justify-between gap-3 px-2 pb-1">
                <span className="text-xs text-muted">
                  <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Ctrl</kbd> +{" "}
                  <kbd className="rounded border border-line px-1.5 py-0.5 font-mono">Enter</kbd> 送出
                </span>
                <button
                  type="submit"
                  disabled={loading || !answer.trim()}
                  className="h-10 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-30 disabled:hover:bg-ink disabled:hover:text-paper"
                >
                  {questionNumber === totalQuestions ? "送出並查看評分" : "送出回答"}
                </button>
              </div>
            </form>
          </section>
        )}

        {phase === "result" && feedback && (
          <section className="animate-rise flex flex-col gap-6">
            <div className="flex flex-col items-center gap-8 rounded-3xl border border-line bg-surface p-8 sm:flex-row sm:items-center">
              <ScoreRing score={feedback.score} />
              <div className="text-center sm:text-left">
                <p className="font-mono text-sm text-accent">RESULT</p>
                <h1 className="mt-2 font-serif text-3xl font-black">{scoreLabel(feedback.score)}</h1>
                <p className="mt-3 leading-7 text-muted">{feedback.summary}</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FeedbackCard title="表現亮點" tone="sage" items={feedback.strengths} />
              <FeedbackCard title="改進建議" tone="accent" items={feedback.improvements} />
            </div>

            <details className="group rounded-3xl border border-line bg-surface p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                回顧面試對話
                <span className="text-muted transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-6">
                <Transcript messages={messages} loading={false} />
              </div>
            </details>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startInterview}
                disabled={loading}
                className="h-12 flex-1 rounded-full bg-accent font-medium text-accent-ink transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                {loading ? "面試官準備中…" : "同一個職缺再練一次"}
              </button>
              <button
                onClick={backToSetup}
                className="h-12 flex-1 rounded-full border border-line bg-surface font-medium transition-colors hover:border-ink"
              >
                更換職缺或題數
              </button>
            </div>
          </section>
        )}

        {error && (
          <p role="alert" className="rounded-2xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  );
}

function ApiKeyStatus({ apiKey }: { apiKey: string | null }) {
  if (apiKey) {
    return (
      <p className="flex items-center justify-center gap-2 text-sm text-muted">
        <span className="size-2 rounded-full bg-sage" />
        將使用你設定的 OpenAI API key
        <button type="button" onClick={() => openSettings()} className="text-ink underline underline-offset-4 hover:text-accent">
          管理
        </button>
      </p>
    );
  }
  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4 sm:flex-row sm:items-center">
      <p className="text-sm leading-6">
        <span className="font-semibold">還沒有設定 API key。</span>
        本服務使用你自己的 OpenAI 帳戶，金鑰只會存在這個瀏覽器。
      </p>
      <button
        type="button"
        onClick={() => openSettings()}
        className="h-10 shrink-0 rounded-full bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
      >
        設定 API key
      </button>
    </div>
  );
}

function StageIndicator({ phase }: { phase: Phase }) {
  const stages: { key: Phase; label: string }[] = [
    { key: "setup", label: "設定" },
    { key: "interview", label: "面試" },
    { key: "result", label: "評分" },
  ];
  const activeIndex = stages.findIndex((s) => s.key === phase);
  return (
    <ol className="flex items-center gap-2 text-xs">
      {stages.map((s, i) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            aria-current={i === activeIndex ? "step" : undefined}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
              i === activeIndex
                ? "bg-ink text-paper"
                : i < activeIndex
                  ? "bg-sage-soft text-sage"
                  : "border border-line text-muted"
            }`}
          >
            <span className="font-mono">{i + 1}</span>
            {s.label}
          </span>
          {i < stages.length - 1 && <span className="h-px w-6 bg-line" />}
        </li>
      ))}
    </ol>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-serif text-2xl font-black">
          第 {current} 題<span className="text-base font-semibold text-muted"> / 共 {total} 題</span>
        </span>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < current - 1 ? "bg-ink" : i === current - 1 ? "bg-accent" : "bg-line"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Transcript({ messages, loading }: { messages: ChatMessage[]; loading: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((m, i) =>
        m.role === "assistant" ? (
          <div key={i} className="animate-rise flex max-w-[90%] gap-3 self-start">
            <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-ink font-serif text-sm font-black text-paper">
              面
            </span>
            <p className="whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3 leading-7">
              {m.content}
            </p>
          </div>
        ) : (
          <p
            key={i}
            className="animate-rise max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-ink px-4 py-3 leading-7 text-paper"
          >
            {m.content}
          </p>
        ),
      )}
      {loading && (
        <div className="flex gap-3 self-start" aria-live="polite">
          <span className="grid size-8 place-items-center rounded-lg bg-ink font-serif text-sm font-black text-paper">面</span>
          <span className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3">
            <span className="sr-only">面試官思考中</span>
            <span className="size-1.5 animate-pulse rounded-full bg-muted" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
          </span>
        </div>
      )}
    </div>
  );
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-9 place-items-center rounded-full text-lg transition-colors hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function scoreLabel(score: number) {
  if (score >= 85) return "表現出色，準備好上場了";
  if (score >= 70) return "基礎扎實，再補強細節";
  if (score >= 50) return "方向正確，還有成長空間";
  return "先從具體案例開始練習";
}

function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--line)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <span className="font-serif text-4xl font-black">{clamped}</span>
          <span className="block text-xs text-muted">/ 100 分</span>
        </div>
      </div>
    </div>
  );
}

function FeedbackCard({ title, tone, items }: { title: string; tone: "sage" | "accent"; items: string[] }) {
  const dot = tone === "sage" ? "bg-sage" : "bg-accent";
  const chip = tone === "sage" ? "bg-sage-soft text-sage" : "bg-accent-soft text-accent";
  return (
    <div className="rounded-3xl border border-line bg-surface p-6">
      <h2 className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${chip}`}>{title}</h2>
      <ul className="mt-5 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-7">
            <span className={`mt-2.5 size-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
