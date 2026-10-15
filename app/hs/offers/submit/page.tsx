import Link from "next/link";
import OfferForm from "@/components/OfferForm";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import { redirect } from "next/navigation";
import { SHOW_HS_MODE } from "@/lib/features";

export default async function SubmitOfferPage() {
  // 高中生申请模块暂时下线（见 lib/features.ts），保证任何入口都回首页
  if (!SHOW_HS_MODE) redirect("/");
  const locale = await getLocale();
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/hs/offers" className="text-sm font-medium text-uoft hover:underline">
        {t(locale, "offers.submitBack")}
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-uoft">
        {t(locale, "offers.submitTitle")}
      </h1>
      <p className="mt-2 text-sm text-slate-600">{t(locale, "offers.submitNote")}</p>
      <div className="mt-6">
        <OfferForm />
      </div>
    </main>
  );
}
