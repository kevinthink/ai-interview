import Link from "next/link";
import { Logo } from "./logo";
import { SettingsButton } from "./settings-button";

const navLinks = [
  { href: "/#features", label: "功能" },
  { href: "/#how", label: "使用流程" },
  { href: "/#faq", label: "常見問題" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink md:block"
            >
              {link.label}
            </Link>
          ))}
          <SettingsButton />
          <Link
            href="/practice"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
          >
            開始練習
          </Link>
        </nav>
      </div>
    </header>
  );
}
