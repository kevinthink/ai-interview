import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SettingsDialog } from "@/components/settings-dialog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 中文字型檔很大，不預先載入，改由瀏覽器依需要分段下載
const serifTC = Noto_Serif_TC({
  variable: "--font-serif-tc",
  weight: ["600", "900"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "面試官 AI｜依職缺量身打造的模擬面試",
  description: "貼上職缺描述，AI 面試官會出題、追問，最後給你分數與具體改進建議。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${serifTC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
        <SettingsDialog />
      </body>
    </html>
  );
}
