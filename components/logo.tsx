import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="面試官 AI 首頁">
      <span className="relative grid size-8 place-items-center rounded-lg bg-ink text-paper transition-transform group-hover:-rotate-6">
        <span className="font-serif text-base font-black leading-none">面</span>
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent ring-2 ring-paper" />
      </span>
      <span className="font-serif text-lg font-black tracking-tight">
        面試官<span className="text-accent"> AI</span>
      </span>
    </Link>
  );
}
