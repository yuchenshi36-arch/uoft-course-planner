"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/components/LocaleProvider";

const stars = [1, 2, 3, 4, 5];

export default function FeedbackWidget() {
  const pathname = usePathname();
  const tr = useT();
  if (pathname.startsWith("/share")) return null;
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!rating || sending) return;
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message, path: pathname }),
      });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
          {done ? (
            <div className="py-6 text-center">
              <p className="text-lg">🎉</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">{tr("feedback.thanks")}</p>
              <button
                onClick={() => {
                  setOpen(false);
                  setDone(false);
                  setRating(0);
                  setMessage("");
                }}
                className="mt-4 text-xs font-medium text-uoft hover:underline"
              >
                {tr("feedback.close")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{tr("feedback.title")}</p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex gap-1">
                {stars.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}
                    className="text-2xl"
                  >
                    <span className={s <= (hover || rating) ? "text-amber-400" : "text-slate-300"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={tr("feedback.placeholder")}
                rows={3}
                className="mt-3 w-full resize-none rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-uoft"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!rating || sending}
                className="mt-3 w-full rounded-xl bg-uoft py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                {sending ? tr("feedback.sending") : tr("feedback.submit")}
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-uoft px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-uoft-light"
        >
          {tr("feedback.button")}
        </button>
      )}
    </div>
  );
}