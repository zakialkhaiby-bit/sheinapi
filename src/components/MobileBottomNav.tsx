"use client";

import React, { useState, useEffect } from "react";
import { Home, ShoppingBag, Plane, MapPin, MessageCircle } from "lucide-react";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState("home");

  const scrollTo = (id: string, tab: string) => {
    setActiveTab(tab);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl py-1.5 px-2 md:hidden">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-between text-[10px] font-bold">
        {/* Home */}
        <button
          type="button"
          onClick={() => scrollTo("top", "home")}
          className={`flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition ${
            activeTab === "home"
              ? "text-emerald-700"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : ""}`} />
          <span>الرئيسية</span>
        </button>

        {/* Shein Calculator */}
        <button
          type="button"
          onClick={() => scrollTo("shein-calculator", "shein")}
          className={`flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition ${
            activeTab === "shein"
              ? "text-emerald-700"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === "shein" ? "stroke-[2.5]" : ""}`} />
          <span>حاسبة شي إن</span>
        </button>

        {/* Shipping Rates */}
        <button
          type="button"
          onClick={() => scrollTo("shipping-rates", "rates")}
          className={`flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition ${
            activeTab === "rates"
              ? "text-emerald-700"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Plane className={`w-5 h-5 ${activeTab === "rates" ? "stroke-[2.5]" : ""}`} />
          <span>الأسعار</span>
        </button>

        {/* Branches */}
        <button
          type="button"
          onClick={() => scrollTo("branches", "branches")}
          className={`flex flex-col items-center gap-1 py-1 px-1 rounded-xl transition ${
            activeTab === "branches"
              ? "text-emerald-700"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <MapPin className={`w-5 h-5 ${activeTab === "branches" ? "stroke-[2.5]" : ""}`} />
          <span>الفروع</span>
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/218943964444"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 px-1 text-emerald-600 hover:text-emerald-700 transition"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span>واتساب</span>
        </a>
      </div>
    </nav>
  );
}
