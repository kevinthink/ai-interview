import Link from "next/link";
import { MAX_QUESTIONS, MIN_QUESTIONS } from "@/lib/interview";

const features = [
  {
    tag: "01",
    title: "依職缺量身出題",
    body: "貼上任何職缺描述，面試官會從職責與技能要求中抓重點，出技術、經驗與情境題，不是通用題庫。",
  },
  {
    tag: "02",
    title: "像真人一樣追問",
    body: "回答講得太籠統？面試官會針對你剛剛說的內容追問細節，逼你把經驗講清楚。",
  },
  {
    tag: "03",
    title: "分數與具體建議",
    body: "面試結束給你 0–100 的總分、表現亮點，以及下一次可以直接套用的改進方向。",
  },
  {
    tag: "04",
    title: "題數由你決定",
    body: `想快速熱身就練 ${MIN_QUESTIONS} 題，想完整模擬就拉到 ${MAX_QUESTIONS} 題，依照你手上的時間調整。`,
  },
];

const steps = [
  { title: "貼上職缺描述", body: "從求職網站複製職缺內容，並選擇想練習的題數。" },
  { title: "逐題回答", body: "面試官一次問一題，根據你的回答追問或進入下一題。" },
  { title: "拿到評分報告", body: "查看總分、亮點與建議，調整後再練一次。" },
];

const faqs = [
  {
    q: "適合哪些職缺？",
    a: "工程、產品、設計、行銷、業務都可以。只要貼上職缺描述，題目就會跟著職缺調整。",
  },
  {
    q: "我的回答會被保存嗎？",
    a: "不會。對話只存在你的瀏覽器分頁中，伺服器不會留存紀錄；重新整理頁面後就會清空。回答內容會傳送給 OpenAI 用來產生題目與評分。",
  },
  {
    q: "評分代表真的能錄取嗎？",
    a: "不代表。分數是 AI 根據你的回答與職缺內容給出的練習參考，重點是幫你找出可以講得更好的地方。",
  },
  {
    q: "一場面試要多久？",
    a: "每題大約幾秒就會出題，整體時間取決於你回答的速度。3 題通常 10 分鐘內可以完成。",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrimaryCta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/practice"
      className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-accent-ink shadow-[0_8px_24px_-10px_var(--accent)] transition-transform hover:-translate-y-0.5"
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-accent-soft" />
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-sage" />
            前端工程師・模擬面試
          </div>
          <span className="font-mono text-xs text-muted">Q2 / 3</span>
        </div>
        <div className="flex flex-col gap-3 text-sm leading-6">
          <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-paper px-4 py-3">
            你提到用 memo 改善了列表效能，可以說說你是怎麼找出瓶頸的嗎？
          </p>
          <p className="max-w-[80%] self-end rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-paper">
            我先用 React Profiler 錄製操作，發現每次輸入都會重新渲染整個列表……
          </p>
          <p className="flex items-center gap-1.5 self-start rounded-2xl bg-paper px-4 py-3 text-muted">
            <span className="size-1.5 animate-pulse rounded-full bg-muted" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
          </p>
        </div>
      </div>
      <div className="absolute -bottom-8 -left-1 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg sm:-left-10">
        <span className="font-serif text-3xl font-black text-accent">84</span>
        <span className="text-xs leading-5 text-muted">
          總分
          <br />
          附 4 項改進建議
        </span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-dots relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-paper/40 to-paper" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
          <div className="animate-rise">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              由 OpenAI 驅動的模擬面試官
            </p>
            <h1 className="font-serif text-5xl font-black leading-[1.15] tracking-tight sm:text-6xl">
              下一場面試，
              <br />
              先在這裡<span className="relative whitespace-nowrap text-accent">練過一次<svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none" aria-hidden><path d="M2 9c40-6 110-8 196-3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" /></svg></span>。
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-muted">
              貼上你想應徵的職缺，AI 面試官會針對職缺出題、根據你的回答追問，最後給你分數與具體可行的改進建議。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PrimaryCta>免費開始練習</PrimaryCta>
              <Link href="#how" className="inline-flex h-12 items-center rounded-full px-5 font-medium text-ink underline-offset-4 hover:underline">
                看看怎麼運作
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Facts strip */}
      <section className="border-y border-line bg-surface">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line md:grid-cols-4">
          {[
            ["任何職缺", "貼上就能練"],
            [`${MIN_QUESTIONS}–${MAX_QUESTIONS} 題`, "自訂練習長度"],
            ["即時追問", "依你的回答調整"],
            ["0–100 分", "附具體建議"],
          ].map(([value, label]) => (
            <div key={value} className="bg-surface px-6 py-6">
              <dt className="font-serif text-2xl font-black">{value}</dt>
              <dd className="mt-1 text-sm text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-sm text-accent">FEATURES</p>
          <h2 className="mt-3 font-serif text-4xl font-black leading-tight">不是題庫，是一位會聽你說話的面試官</h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.tag}
              className="group rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent/50"
            >
              <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">{f.tag}</span>
              <h3 className="mt-6 font-serif text-2xl font-black">{f.title}</h3>
              <p className="mt-3 leading-7 text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="font-mono text-sm text-accent">HOW IT WORKS</p>
          <h2 className="mt-3 font-serif text-4xl font-black">三步驟，完成一場模擬面試</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-paper/20 pt-6">
                <span className="font-serif text-5xl font-black text-accent">{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-7 text-paper/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-20 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="font-mono text-sm text-accent">FAQ</p>
          <h2 className="mt-3 font-serif text-4xl font-black">常見問題</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl leading-7 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-accent px-8 py-16 text-center text-accent-ink sm:px-16">
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-30" />
          <h2 className="relative font-serif text-4xl font-black leading-tight sm:text-5xl">準備好了嗎？</h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg opacity-85">花十分鐘練一次，比在正式面試中卡住好得多。</p>
          <Link
            href="/practice"
            className="group relative mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-paper transition-transform hover:-translate-y-0.5"
          >
            開始模擬面試
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}
