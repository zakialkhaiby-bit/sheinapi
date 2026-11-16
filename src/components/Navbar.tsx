"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sliders, Check } from "lucide-react";
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
        window.dispatchEvent(new CustomEvent("exchangeRateUpdated", { detail: parsed }));
        setTimeout(() => {
          setSavedSuccess(false);
          setIsEditingRate(false);
        }, 900);
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
      {/* Top iOS-Style App Bar */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-md pt-3 pb-2 px-4 transition-all">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Left Circular Action (Back/Reset) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-800 hover:bg-[#f6f2fc] active:scale-90 transition"
            title="الرئيسية"
          >
            <ArrowRight className="w-4 h-4 text-slate-700" />
          </button>

          {/* Center Brand Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl overflow-hidden bg-[#4615a4] flex items-center justify-center p-0.5 shadow-sm shadow-[#4615a4]/20 border border-[#4615a4]/10">
              <img src="/logo.jpg" alt="هوية huwiyya" className="w-full h-full object-cover" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black text-slate-900">هـويــة</span>
                <span className="text-[11px] font-black text-[#4615a4] font-mono tracking-wider">huwiyya</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                حاسبة شحنات شي إن 🇱🇾
              </p>
            </div>
          </div>

          {/* Right Circular Action (Exchange Rate) */}
          <button
            type="button"
            onClick={() => {
              setRateInput(String(currentRate));
              setIsEditingRate(true);
            }}
            className="relative w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-800 hover:bg-[#f6f2fc] active:scale-90 transition group"
            title="تعديل سعر الصرف"
          >
            <Sliders className="w-4 h-4 text-[#4615a4] group-hover:rotate-45 transition-transform" />
            <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-[#4615a4] ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* iOS Bottom-Sheet Modal for Exchange Rate */}
      {isEditingRate && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-fadeIn p-0 sm:p-4"
          onClick={() => setIsEditingRate(false)}
        >
          <div
            className="bg-white rounded-t-[32px] sm:rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 transition-all animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#4615a4] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#4615a4]/20">
                  $
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">سعر الصرف في هوية</h3>
                  <span className="text-[11px] text-slate-400">تحديث فوري لكافة أسعار السلة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRate(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
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
                    className="w-full h-14 px-4 rounded-2xl border-2 border-[#4615a4] font-mono text-2xl font-black text-[#4615a4] focus:outline-none bg-[#f6f2fc]/50 text-center"
                    autoFocus
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    د.ل
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {[9.8, 10.0, 10.09, 10.5, 11.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRateInput(String(preset))}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition ${
                      parseFloat(rateInput) === preset
                        ? "bg-[#4615a4] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-[#ede4f9] hover:text-[#4615a4]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {savedSuccess && (
                <div className="bg-[#ede4f9] border border-[#dccbf3] text-[#4615a4] text-xs font-bold p-3 rounded-2xl flex items-center gap-2 justify-center">
                  <Check className="w-4 h-4 text-[#4615a4]" />
                  <span>تم حفظ سعر الصرف وتحديث السلة بنجاح!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 min-h-[48px] bg-[#4615a4] hover:bg-[#361081] text-white text-sm font-bold rounded-full transition active:scale-95 shadow-md shadow-[#4615a4]/20 disabled:opacity-60"
                >
                  {saving ? "جاري الحفظ..." : "حفظ وتحديث السعر"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRate(false)}
                  className="min-h-[48px] px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-full transition"
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
