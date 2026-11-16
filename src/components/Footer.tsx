"use client";

import React from "react";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-12 px-4 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg">
                و
              </div>
              <span className="font-black text-white text-base">وصلة للشحن</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              شركة ليبية رائدة في خدمات الشحن الجوي والبحري والتسوق الدولي من كبرى المتاجر العالمية بأسعار منافسة وبأعلى درجات الأمان.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <a href="#shein-calculator" className="hover:text-emerald-400 transition">
                  حاسبة سلات SHEIN
                </a>
              </li>
              <li>
                <a href="#shipping-rates" className="hover:text-emerald-400 transition">
                  أسعار الشحن الدولي
                </a>
              </li>
              <li>
                <a href="#general-calc" className="hover:text-emerald-400 transition">
                  حاسبة الوزن التقديرية
                </a>
              </li>
              <li>
                <a href="#branches" className="hover:text-emerald-400 transition">
                  فروع الشركة
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-emerald-400 transition text-slate-500">
                  لوحة الإدارة والتحكم
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">خدمة العملاء</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span dir="ltr">094 396 44 44</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/218943964444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition"
                >
                  واتساب مباشر: +218 94 396 4444
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>فروعنا: طرابلس · مصراتة</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">تابعنا</h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://www.facebook.com/share/19pfpiteFy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                title="Facebook"
              >
                f
              </a>
              <a
                href="https://www.instagram.com/wasla.ship/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                title="Instagram"
              >
                ig
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              أوقات العمل: من السبت إلى الخميس، من 3:00 عصراً حتى 10:00 ليلاً.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 وصلة للشحن الجوي والبحري WASLA for Shipping · جميع الحقوق محفوظة.
          </div>
          <div className="text-slate-600">
            شعارات SHEIN و Alibaba و AliExpress ملك لأصحابها وتُعرض لتوضيح خدمات الوساطة والشحن فقط.
          </div>
        </div>
      </div>
    </footer>
  );
}
