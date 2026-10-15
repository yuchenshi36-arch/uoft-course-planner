import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import VisitTracker from "@/components/VisitTracker";
import FeedbackWidget from "@/components/FeedbackWidget";
import Footer from "@/components/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "brand.metaTitle"),
    description: t(locale, "brand.metaDescription"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <LocaleProvider locale={locale}>
          <Header />
          <div className="flex-1">{children}</div>
          <VisitTracker />
          <FeedbackWidget />
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
