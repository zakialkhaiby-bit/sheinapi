"use client";

import React, { useState } from "react";
import { Home, Search, MessageCircle, Sliders, ShoppingBag } from "lucide-react";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState("calc");

  const handleAction = () => {
    const input = document.getElementById("cart-input") as HTMLInputElement;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 pointer-events-none px-4">
      <nav className="max-w-xs mx-auto pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-full shadow-[0_12px_40px_rgba(70,21,164,0.12)] px-4 py-2 flex items-center justify-between">
        {/* Home */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition ${
            activeTab === "home" ? "text-[#4615a4]" : "text-slate-400 hover:text-slate-600"
          }`}
          title="الرئيسية"
        >
          <Home className={`w-5 h-5 ${activeTab === "home" ? "stroke-[2.5]" : ""}`} />
        </button>

        {/* Search / Calc */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("calc");
            handleAction();
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition ${
            activeTab === "calc" ? "text-[#4615a4]" : "text-slate-400 hover:text-slate-600"
          }`}
          title="حساب السلة"
        >
          <Search className={`w-5 h-5 ${activeTab === "calc" ? "stroke-[2.5]" : ""}`} />
        </button>

        {/* Center Elevated Floating Huwiyya Brand Action Button */}
        <button
          type="button"
          onClick={handleAction}
          className="relative -top-4 w-12 h-12 rounded-full bg-[#4615a4] hover:bg-[#361081] text-white flex items-center justify-center shadow-xl shadow-[#4615a4]/40 hover:scale-105 active:scale-95 transition-transform"
          title="لصق وحساب الرابط"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Exchange Rate / Settings */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("rate");
            window.dispatchEvent(new CustomEvent("openRateModal"));
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-full transition ${
            activeTab === "rate" ? "text-[#4615a4]" : "text-slate-400 hover:text-slate-600"
          }`}
          title="سعر الصرف"
        >
          <Sliders className="w-5 h-5" />
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/218920064400"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2 text-slate-400 hover:text-[#4615a4] transition"
          title="واتساب مباشر"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </nav>
    </div>
  );
}
