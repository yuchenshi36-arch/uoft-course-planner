import type { Metadata } from "next";
import OfferForm from "@/components/OfferForm";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import { redirect } from "next/navigation";
import { SHOW_HS_MODE } from "@/lib/features";

export async function generateMetadata(): Promise<Metadata> {
  // 高中生申请模块暂时下线（见 lib/features.ts），保证任何入口都回首页
  if (!SHOW_HS_MODE) redirect("/");
  const locale = await getLocale();
  return {
    title: t(locale, "offers.shareTitle"),
    description: t(locale, "offers.shareMetaDescription"),
  };
}

export default async function ShareOfferPage() {
  const locale = await getLocale();
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="text-center">
        <p className="text-4xl">🎓</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
          {t(locale, "offers.shareHeading")}
        </h1>
        <p className="mt-1 text-xs text-slate-400">{t(locale, "offers.shareNote")}</p>
      </div>
      <div className="mt-6">
        <OfferForm showBoardLink={false} />
      </div>
    </main>
  );
}
