"use client";

import React from "react";
import { Plane, Ship, Clock, CheckCircle2 } from "lucide-react";
import { ShippingRate } from "@/types";

const RATES: ShippingRate[] = [
  {
    id: "tr",
    country: "Turkey",
    countryAr: "تركيا",
    flag: "🇹🇷",
    airRateUsd: 4.20,
    seaRateUsd: 1.20,
    airDays: "3 - 5 أيام",
    seaDays: "12 - 18 يوم",
  },
  {
    id: "ae",
    country: "UAE",
    countryAr: "الإمارات (دبي)",
    flag: "🇦🇪",
    airRateUsd: 9.50,
    seaRateUsd: 2.80,
    airDays: "4 - 7 أيام",
    seaDays: "15 - 20 يوم",
  },
  {
    id: "sa",
    country: "Saudi Arabia",
    countryAr: "السعودية",
    flag: "🇸🇦",
    airRateUsd: 10.00,
    airDays: "5 - 8 أيام",
  },
  {
    id: "cn",
    country: "China",
    countryAr: "الصين",
    flag: "🇨🇳",
    airRateUsd: 11.50,
    seaRateUsd: 3.50,
    airDays: "7 - 12 يوم",
    seaDays: "30 - 45 يوم",
  },
  {
    id: "us",
    country: "USA",
    countryAr: "أمريكا",
    flag: "🇺🇸",
    airRateUsd: 14.50,
    airDays: "7 - 14 يوم",
  },
];

export default function ShippingRates() {
  return (
    <section id="shipping-rates" className="py-16 px-4 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Plane className="w-3.5 h-3.5 text-emerald-600" />
            <span>الشحن الدولي العام</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            أسعار الشحن الجوي والبحري إلى ليبيا
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            أسعار تنافسية ومحددة بالكيلوجرام، بدون أي رسوم جمركية مفاجئة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RATES.map((rate) => (
            <div
              key={rate.id}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 hover:shadow-lg transition-all card-hover relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{rate.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">
                      الشحن من {rate.countryAr}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{rate.country}</span>
                  </div>
                </div>
              </div>

              {/* Air Shipping Price */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Plane className="w-3.5 h-3.5" />
                    شحن جوي سريع
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {rate.airDays}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">${rate.airRateUsd.toFixed(2)}</span>
                  <span className="text-xs text-slate-500">/ كجم</span>
                </div>
              </div>

              {/* Sea Shipping Price if available */}
              {rate.seaRateUsd && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-teal-700">
                      <Ship className="w-3.5 h-3.5" />
                      شحن بحري اقتصادي
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {rate.seaDays}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${rate.seaRateUsd.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">/ كجم (أو بالمتر المكعب CBM)</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تأمين شامل على الطرود</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تتبع ومتابعة مباشرة عبر واتساب</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
