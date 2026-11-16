"use client";

import React, { useState } from "react";
import { Calculator, Plane, Ship, ArrowLeft } from "lucide-react";
import { formatLyd, formatUsd } from "@/lib/pricing";

const COUNTRY_RATES: Record<string, { name: string; air: number; sea?: number; flag: string }> = {
  tr: { name: "تركيا", air: 4.20, sea: 1.20, flag: "🇹🇷" },
  ae: { name: "الإمارات", air: 9.50, sea: 2.80, flag: "🇦🇪" },
  sa: { name: "السعودية", air: 10.00, flag: "🇸🇦" },
  cn: { name: "الصين", air: 11.50, sea: 3.50, flag: "🇨🇳" },
  us: { name: "أمريكا", air: 14.50, flag: "🇺🇸" },
};

export default function GeneralShippingCalculator() {
  const [country, setCountry] = useState("tr");
  const [shippingType, setShippingType] = useState<"air" | "sea">("air");
  const [weightKg, setWeightKg] = useState<number>(3);
  const exchangeRate = 10.09;

  const currentCountry = COUNTRY_RATES[country];
  const ratePerKg = shippingType === "air" ? currentCountry.air : (currentCountry.sea || currentCountry.air);
  const totalUsd = weightKg * ratePerKg;
  const totalLyd = Math.round(totalUsd * exchangeRate);

  return (
    <section id="general-calc" className="py-16 px-4 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>حاسبة الشحن التقديرية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            احسب تكلفة شحن طردك بالكيلوجرام
          </h2>
          <p className="text-slate-600 text-sm">
            حدد دولة الشحن والوزن لمعرفة التكلفة الإجمالية بالدولار والدينار
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Inputs */}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الدولة المصدرة للشحنة
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(COUNTRY_RATES).map(([key, c]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setCountry(key);
                        if (shippingType === "sea" && !c.sea) setShippingType("air");
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                        country === key
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع الشحن
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingType("air")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      shippingType === "air"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Plane className="w-4 h-4 text-emerald-600" />
                    <span>جوي (${currentCountry.air}/كجم)</span>
                  </button>

                  <button
                    type="button"
                    disabled={!currentCountry.sea}
                    onClick={() => setShippingType("sea")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      !currentCountry.sea
                        ? "opacity-40 cursor-not-allowed border-slate-200 bg-slate-50"
                        : shippingType === "sea"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Ship className="w-4 h-4 text-teal-600" />
                    <span>بحري ({currentCountry.sea ? `$${currentCountry.sea}/كجم` : "غير متاح"})</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>الوزن التقديري (كجم):</span>
                  <span className="text-emerald-700 font-mono text-sm">{weightKg} كجم</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>0.5 كجم</span>
                  <span>25 كجم</span>
                  <span>50 كجم</span>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
              <div>
                <span className="text-xs text-slate-400 block mb-1">الشحن التقديري من {currentCountry.name}</span>
                <div className="text-4xl font-black text-emerald-400 tracking-tight">
                  {formatLyd(totalLyd)}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  ≈ ${totalUsd.toFixed(2)} USD (سعر الصرف: {exchangeRate} د.ل)
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>سعر الكيلو المعتمد:</span>
                  <strong className="text-white">${ratePerKg.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>الوزن المحسوب:</span>
                  <strong className="text-white">{weightKg} كجم</strong>
                </div>
                <div className="flex justify-between">
                  <span>الرسوم الجمركية:</span>
                  <strong className="text-emerald-400">شاملة ومجانية</strong>
                </div>
              </div>

              <a
                href="https://wa.me/218943964444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3.5 rounded-xl transition text-sm shadow-md"
              >
                <span>احجز شحنتك الآن عبر واتساب</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
