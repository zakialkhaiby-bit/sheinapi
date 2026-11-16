"use client";

import React from "react";
import { Link2, Calculator, CheckCircle2, PackageCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "انسخ رابط سلة SHEIN",
    description: "اختر منتجاتك في تطبيق شي إن واضغط على مشاركة السلة ثم نسخ الرابط.",
    icon: Link2,
  },
  {
    step: "02",
    title: "احسب السعر بالدينار",
    description: "الصق الرابط في حاسبة وصلة، وسيقوم النظام فوراً بحساب القيمة الحقيقية بسعر الصرف الحالي وبدون أي عمولة شراء.",
    icon: Calculator,
  },
  {
    step: "03",
    title: "أكّد طلبك وادفع بسهولة",
    description: "أكّد الطلب بضغطة زر وتواصل معنا عبر واتساب للدفع نقداً في فروعنا أو بالتحويل المصرفي.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "استلم شحنتك حتى باب بيتك",
    description: "تصل شحنتك إلى مستودعنا بدبي ثم تُشحن جواً إلى ليبيا لتستلمها من الفرع أو عبر مندوب التوصيل.",
    icon: PackageCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider block mb-2">
            بساطة وسرعة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            كيف تشتري من شي إن مع وصلة؟
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
            أربع خطوات فقط تفصلك عن استلام مشترياتك في ليبيا بدون بطاقة دولية أو تعقيدات.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 relative hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="text-4xl font-black text-slate-200 group-hover:text-emerald-200 transition mb-4">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
