import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "產品",
    links: [
      { href: "/#features", label: "功能" },
      { href: "/#how", label: "使用流程" },
      { href: "/practice", label: "開始練習" },
    ],
  },
  {
    title: "資源",
    links: [
      { href: "/#faq", label: "常見問題" },
      { href: "/#faq", label: "隱私說明" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-muted">
            依照你想應徵的職缺，提供一場會追問、會打分數的模擬面試。
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 面試官 AI</p>
          <p>AI 回饋僅供練習參考，不代表任何企業的實際錄取標準。</p>
        </div>
      </div>
    </footer>
  );
}
