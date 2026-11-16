"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Sliders, RefreshCw, Check, ArrowUpDown } from "lucide-react";
import { AppSettings } from "@/types";

export default function Navbar() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState<string>("10.09");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
    const onRateUpdate = () => fetchSettings();
    window.addEventListener("exchangeRateUpdated", onRateUpdate);
    return () => window.removeEventListener("exchangeRateUpdated", onRateUpdate);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      if (data.exchangeRate) {
        setRateInput(String(data.exchangeRate));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(rateInput);
    if (isNaN(parsed) || parsed <= 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeRate: parsed }),
      });
      const data = await res.json();
      if (data.ok) {
        setSettings(data.settings);
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          setIsEditingRate(false);
          // Trigger custom event so calculator recalculates if cart is active
          window.dispatchEvent(new CustomEvent("exchangeRateUpdated", { detail: parsed }));
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const currentRate = settings?.exchangeRate || 10.09;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Top Mini Bar */}
        <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>🇱🇾</span> وصلة للشحن - ليبيا
              </span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <a
                href="tel:0943964444"
                className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-emerald-300 transition"
                dir="ltr"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>094 396 44 44</span>
              </a>
            </div>

            <a
              href="https://wa.me/218943964444"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full font-medium transition active:scale-95 text-[11px]"
            >
              <MessageCircle className="w-3 h-3" />
              <span>واتساب</span>
            </a>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md shadow-emerald-900/20">
              و
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                حاسبة شحنات شي إن
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-emerald-600 -mt-0.5">
                وصلة للشحن الدولي · Wasla Ship
              </p>
            </div>
          </div>

          {/* Rate Button */}
          <button
            type="button"
            onClick={() => {
              setRateInput(String(currentRate));
              setIsEditingRate(true);
            }}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 px-3 py-1.5 rounded-xl transition active:scale-95 group text-right"
            title="انقر لتعديل سعر الصرف"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              $
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 font-medium">سعر الصرف</span>
              <span className="block text-xs sm:text-sm font-black font-mono text-emerald-900 leading-none">
                {currentRate} د.ل
              </span>
            </div>
            <Sliders className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-45 transition-transform shrink-0 mr-1" />
          </button>
        </div>
      </header>

      {/* Exchange Rate Edit Modal */}
      {isEditingRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  $
                </div>
                <h3 className="font-bold text-slate-900 text-base">تعديل سعر الصرف</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRate(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              أدخل سعر صرف الدولار مقابل الدينار الليبي (مثلاً: 10.09). سيتم استخدامه فوراً في جميع حسابات السلة.
            </p>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سعر صرف 1 دولار بالدينار الليبي:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="100"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border-2 border-emerald-500 font-mono text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/30 text-center"
                    autoFocus
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    د.ل
                  </span>
                </div>
              </div>

              {savedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-2.5 rounded-xl flex items-center gap-2 justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ سعر الصرف وتحديث الحسابات بنجاح!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>تأكيد وحفظ</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRate(false)}
                  className="min-h-[44px] px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
