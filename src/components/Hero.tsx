"use client";

import React from "react";
import { Sparkles, ShieldCheck, Plane, Truck, Clock, ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-20 px-4">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>خدمة الشراء من شي إن بعمولة 0% وشحن مجاني إلى ليبيا</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
          من كل مكان إلى ليبيا <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            وصلة للشحن الجوي والبحري
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
          نشحن لك من <strong className="text-white">الصين، تركيا، الإمارات، أمريكا، والسعودية</strong>.
          ونشتري لك من متاجرك المفضلة بدون أي عمولة شراء. احسب تكلفة سلتك بالدينار الليبي فوراً.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a
            href="#shein-calculator"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all text-base"
          >
            <span>احسب سلة شي إن الآن</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="#shipping-rates"
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold px-6 py-3.5 rounded-2xl border border-slate-700 hover:border-slate-600 transition"
          >
            <span>جدول أسعار الشحن الدولي</span>
          </a>
        </div>

        {/* Key Features Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-right">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">0% عمولة شراء</div>
              <div className="text-xs text-slate-400">بدون أي تكاليف إضافية</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">رحلات شحن أسبوعية</div>
              <div className="text-xs text-slate-400">شحن جوي سريع ومنتظم</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">توصيل لكل المدن</div>
              <div className="text-xs text-slate-400">توصيل للبيت أو الفرع</div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">سعر الصرف الحي</div>
              <div className="text-xs text-slate-400">تحديث فوري وشفافية</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
