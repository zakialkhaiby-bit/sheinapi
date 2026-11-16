"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Menu, X, Package, Calculator, MapPin, HelpCircle } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a
              href="tel:0943964444"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>094 396 44 44</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300">
              أوقات العمل: السبت - الخميس (3:00 م - 10:00 م)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-medium">نوصّل لكافة مدن ليبيا 🇱🇾</span>
            <a
              href="https://wa.me/218943964444"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold transition"
            >
              <MessageCircle className="w-3 h-3" />
              <span>واتساب مباشر</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            و
          </div>
          <div>
            <span className="block text-xl font-black text-slate-900 tracking-tight leading-tight">
              وصلة للشحن
            </span>
            <span className="block text-[11px] font-medium text-emerald-600 -mt-0.5 tracking-wider">
              WASLA FOR SHIPPING
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <a
            href="#shein-calculator"
            className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-800 transition"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            حاسبة سلات SHEIN
          </a>
          <a
            href="#shipping-rates"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition"
          >
            <Package className="w-4 h-4 text-slate-400" />
            أسعار الشحن
          </a>
          <a
            href="#general-calc"
            className="hover:text-emerald-600 transition"
          >
            حاسبة الشحن العام
          </a>
          <a
            href="#branches"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition"
          >
            <MapPin className="w-4 h-4 text-slate-400" />
            الفروع
          </a>
          <a
            href="#faq"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            الأسئلة الشائعة
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#shein-calculator"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition"
          >
            احسب سلتك الآن
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
          aria-label="القائمة"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <a
            href="#shein-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-emerald-700 font-semibold py-2 border-b border-slate-100"
          >
            <Calculator className="w-4 h-4" />
            حاسبة سلات SHEIN
          </a>
          <a
            href="#shipping-rates"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-slate-700 py-2 border-b border-slate-100"
          >
            <Package className="w-4 h-4" />
            أسعار الشحن لجميع الدول
          </a>
          <a
            href="#general-calc"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 py-2 border-b border-slate-100"
          >
            حاسبة الشحن العام (وزن وحجم)
          </a>
          <a
            href="#branches"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-slate-700 py-2 border-b border-slate-100"
          >
            <MapPin className="w-4 h-4" />
            فروعنا (طرابلس ومصراتة)
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-slate-700 py-2 border-b border-slate-100"
          >
            <HelpCircle className="w-4 h-4" />
            الأسئلة الشائعة
          </a>
          <a
            href="https://wa.me/218943964444"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            تواصل عبر واتساب
          </a>
        </div>
      )}
    </header>
  );
}
