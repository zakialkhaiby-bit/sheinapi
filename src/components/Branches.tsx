"use client";

import React from "react";
import { MapPin, Clock, Phone, ExternalLink, Navigation } from "lucide-react";

export default function Branches() {
  return (
    <section id="branches" className="py-16 px-4 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>فروعنا المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            تفضل بزيارة فروع شركة وصلة
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            فروعنا في طرابلس ومصراتة لخدمتك في الدفع النقدي واستلام الشحنات والاستفسارات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tripoli Branch */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                  العاصمة
                </span>
                <span className="text-xs text-slate-400 font-mono">Tripoli Branch</span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                فرع طرابلس
              </h3>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>زناتة القديمة، بالقرب من جامع المرأة</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>السبت - الخميس (3:00 عصراً - 10:00 ليلاً)</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span dir="ltr">092 006 44 00</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <a
                href="https://maps.app.goo.gl/f5KLW7SZzwV2LE9z7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition text-sm"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>عرض الموقع على Google Maps</span>
              </a>
            </div>
          </div>

          {/* Misrata Branch */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all card-hover flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-teal-100 text-teal-800 text-xs font-black px-3 py-1 rounded-full">
                  الفرع الرئيسي
                </span>
                <span className="text-xs text-slate-400 font-mono">Misrata Branch</span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                فرع مصراتة
              </h3>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>شارع طرابلس، الإشارة الضوئية عند برو جيم، جانب الكلية الدولية للغات</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>السبت - الخميس (3:00 عصراً - 10:00 ليلاً)</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-5 h-5 text-teal-600 shrink-0" />
                  <span dir="ltr">092 006 44 00</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <a
                href="https://maps.app.goo.gl/qmrbcNBtBLw3UJ1F8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition text-sm"
              >
                <Navigation className="w-4 h-4 text-teal-400" />
                <span>عرض الموقع على Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Home Delivery Notice */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 text-center text-xs sm:text-sm text-slate-700">
          🚚 <strong>نوصّل لكل مدن ليبيا:</strong> التوصيل للمنزل متاح في جميع المدن حسب الرغبة عبر شركاء التوصيل المحليين.
        </div>
      </div>
    </section>
  );
}
