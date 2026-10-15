import { t } from "@/lib/i18n/ui";
import type { Locale } from "@/lib/i18n/config";

export default function AdminLogin({
  locale,
  configured,
  error,
}: {
  locale: Locale;
  configured: boolean;
  error: boolean;
}) {
  return (
    <main className="mx-auto flex max-w-md px-4 py-20">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-uoft">
          {t(locale, "admin.login.title")}
        </h1>
        {configured ? (
          <>
            <p className="mt-2 text-sm text-slate-500">
              {t(locale, "admin.login.hint")}
            </p>
            <form method="POST" action="/api/admin/login" className="mt-4 space-y-3">
              <input
                type="password"
                name="password"
                autoFocus
                autoComplete="current-password"
                placeholder={t(locale, "admin.login.placeholder")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-uoft"
              />
              <button className="w-full rounded-xl bg-uoft px-3 py-2 text-sm font-semibold text-white transition hover:bg-uoft-light">
                {t(locale, "admin.login.button")}
              </button>
            </form>
            {error && (
              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
                {t(locale, "admin.login.error")}
              </p>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {t(locale, "admin.login.notSet")}
          </p>
        )}
      </div>
    </main>
  );
}
