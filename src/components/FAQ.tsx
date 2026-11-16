"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "هل توجد عمولة شراء على طلبات شي إن؟",
    a: "لا، عمولة الشراء من شي إن عبر وصلة هي 0%. التكلفة المحسوبة في الحاسبة تشمل سعر السلع بالدينار الليبي فقط وتوصيل شي إن إلى مستودعنا في دبي إن وجد، والشحن إلى ليبيا مجاني تماماً!",
  },
  {
    q: "كيف يتم احتساب سعر سلة SHEIN بالدينار الليبي؟",
    a: "يتم جمع أسعار المنتجات بالدولار (حسب متجر شي إن الإمارات AE)، وإذا كانت السلة أقل من $50.00 تضاف رسوم توصيل دبي ($5.44)، أما إذا تجاوزت $50.00 فيكون الشحن لدبي مجاناً 0$. ثم يضرب الإجمالي في سعر الصرف المعتمد ويُقرب الناتج لأقرب 5 دينار ليبي.",
  },
  {
    q: "كم تستغرق الشحنة حتى تصل إلى ليبيا؟",
    a: "عادةً ما تستغرق شحنات شي إن ما بين 7 إلى 12 يوم عمل من تاريخ الشراء والوصول لمستودع دبي ثم الشحن الجوي المباشر إلى ليبيا.",
  },
  {
    q: "كيف أدفع قيمة الطلب؟ هل أحتاج لبطاقة دولية كـ فيزا أو ماستركارد؟",
    a: "لا تحتاج إلى أي بطاقة دولية. يمكنك الدفع بالدينار الليبي نقداً في فرعنا بطرابلس أو مصراتة، أو عن طريق خدمة التحويل المصرفي (موبي كاش، يسر باي، سداد، تداول) أو إيداع حساب.",
  },
  {
    q: "هل يمكنني إلغاء أو تعديل أي قطعة بعد حساب السلة؟",
    a: "نعم! حاسبة وصلة تتيح لك زيادة أو إنقاص كمية أي قطعة أو حذفها مباشرة من القائمة، وسيقوم النظام فوراً بإعادة حساب السعر النهائي.",
  },
  {
    q: "هل تشحن وصلة بضائع ومشتريات أخرى غير شي إن؟",
    a: "نعم بكل تأكيد، نوفر شحناً جوياً وبحرياً لجميع البضائع والطرود والمعدات من الصين، تركيا، الإمارات، أمريكا، والسعودية بأسعار تبدأ من $4.20 للكيلوجرام.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 px-4 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>إجابات واضحة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            الأسئلة الشائعة
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            كل ما تحتاج لمعرفته حول الشحن والطلب وحساب الأسعار.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
