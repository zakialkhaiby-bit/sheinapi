"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Clipboard,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShoppingBag,
  Sliders,
  X,
  ExternalLink,
} from "lucide-react";
import { SheinCart, SheinProduct, AppSettings } from "@/types";
import { formatLyd, formatUsd } from "@/lib/pricing";
import OrderModal from "./OrderModal";

export default function SheinCalculator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<SheinCart | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "help">("cart");

  // Loading Progress State (0 - 100%)
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Settings & Exchange Rate Modal
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [newRate, setNewRate] = useState<number>(10.09);
  const [savingRate, setSavingRate] = useState(false);
  const [rateSaveSuccess, setRateSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
    loadDemoCart();

    const onRateUpdate = async () => {
      await loadSettings();
      // Recalculate if cart is loaded
      setCart((prevCart) => {
        if (!prevCart) return null;
        fetch("/api/cart/price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: prevCart.products }),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.ok) {
              setCart((c) => (c ? { ...c, pricing: d.pricing } : null));
            }
          })
          .catch(console.error);
        return prevCart;
      });
    };

    const handleOpenRateModal = () => setIsRateModalOpen(true);

    window.addEventListener("exchangeRateUpdated", onRateUpdate);
    window.addEventListener("openRateModal", handleOpenRateModal);

    return () => {
      window.removeEventListener("exchangeRateUpdated", onRateUpdate);
      window.removeEventListener("openRateModal", handleOpenRateModal);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      if (data.exchangeRate) {
        setNewRate(data.exchangeRate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRate || newRate <= 0) return;
    setSavingRate(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeRate: newRate }),
      });
      const data = await res.json();
      if (data.ok) {
        setSettings(data.settings);
        setRateSaveSuccess(true);
        window.dispatchEvent(new CustomEvent("exchangeRateUpdated", { detail: newRate }));

        if (cart) {
          const priceRes = await fetch("/api/cart/price", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: cart.products }),
          });
          const priceData = await priceRes.json();
          if (priceData.ok) {
            setCart({
              ...cart,
              pricing: priceData.pricing,
            });
          }
        }

        setTimeout(() => {
          setRateSaveSuccess(false);
          setIsRateModalOpen(false);
        }, 900);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRate(false);
    }
  };

  const startProgress = () => {
    setProgress(6);
    setProgressStatus("الاتصال بسيرفر شي إن...");
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setProgressStatus("التحقق من رابط السلة...");
          return prev + 5;
        } else if (prev < 65) {
          setProgressStatus("جلب تفاصيل السلع والأسعار والخصومات...");
          return prev + 3;
        } else if (prev < 90) {
          setProgressStatus("احتساب تكلفة الشحن وسعر الصرف بالدينار...");
          return prev + 1.5;
        } else if (prev < 96) {
          return prev + 0.5;
        }
        return prev;
      });
    }, 70);
  };

  const finishProgress = async () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setProgress(100);
    setProgressStatus("اكتمل تجهيز واحتساب السلة بنجاح!");
    await new Promise((resolve) => setTimeout(resolve, 350));
  };

  const stopProgress = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setProgress(0);
    setProgressStatus("");
  };

  const loadDemoCart = async () => {
    setLoading(true);
    setError(null);
    startProgress();
    try {
      const res = await fetch("/api/cart/demo");
      const data = await res.json();
      if (data.ok) {
        await finishProgress();
        setCart(data.cart);
        setUrl(data.cart.shareUrl || "");
      }
    } catch (err) {
      console.error(err);
      stopProgress();
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (targetUrl?: string) => {
    const link = (targetUrl || url).trim();
    if (!link) {
      setError("الرجاء لصق رابط سلة أو منتج من تطبيق شي إن أولاً.");
      return;
    }

    setLoading(true);
    setError(null);
    startProgress();

    try {
      const res = await fetch("/api/cart/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "فشل استيراد السلة. يرجى التحقق من الرابط.");
      }

      await finishProgress();
      setCart(data.cart);
    } catch (err: any) {
      stopProgress();
      setError(err.message || "حدث خطأ أثناء جلب بيانات السلة.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        handleImport(text);
      }
    } catch {
      const input = document.getElementById("cart-input") as HTMLInputElement;
      if (input) input.focus();
    }
  };

  const updateQuantity = async (productId: string, delta: number) => {
    if (!cart) return;

    const updatedProducts = cart.products
      .map((p) => {
        if (p.id === productId) {
          const newQ = p.quantity + delta;
          return newQ > 0 ? { ...p, quantity: newQ } : null;
        }
        return p;
      })
      .filter(Boolean) as SheinProduct[];

    if (updatedProducts.length === 0) {
      setCart(null);
      return;
    }

    try {
      const res = await fetch("/api/cart/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts }),
      });

      const data = await res.json();
      if (data.ok) {
        setCart({
          ...cart,
          products: updatedProducts,
          pricing: data.pricing,
        });
      }
    } catch (err) {
      console.error("Recalculation error:", err);
    }
  };

  const removeItem = async (productId: string) => {
    if (!cart) return;
    const updatedProducts = cart.products.filter((p) => p.id !== productId);
    if (updatedProducts.length === 0) {
      setCart(null);
      return;
    }

    try {
      const res = await fetch("/api/cart/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts }),
      });
      const data = await res.json();
      if (data.ok) {
        setCart({
          ...cart,
          products: updatedProducts,
          pricing: data.pricing,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentRate = settings?.exchangeRate || cart?.pricing.exchangeRate || 10.09;

  return (
    <div id="shein-calculator" className="space-y-4">
      {/* 1. Horizontal Category / Action Pills (Exact iOS Reference Style) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
        <button
          type="button"
          onClick={() => setActiveTab("cart")}
          className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition shadow-xs ${
            activeTab === "cart"
              ? "bg-black text-white"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          سلة SHEIN
        </button>

        <button
          type="button"
          onClick={() => {
            setNewRate(currentRate);
            setIsRateModalOpen(true);
          }}
          className="shrink-0 flex items-center gap-1.5 bg-white text-slate-800 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50 transition shadow-xs active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>سعر الصرف:</span>
          <span className="font-mono text-slate-900">{currentRate} د.ل</span>
        </button>

        <button
          type="button"
          onClick={loadDemoCart}
          className="shrink-0 flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200/80 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-50 transition shadow-xs active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>سلة تجريبية</span>
        </button>

        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
            showHelp
              ? "bg-black text-white"
              : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          طريقة الرابط؟
        </button>
      </div>

      {/* Help Card (if opened) */}
      {showHelp && (
        <div className="bg-white rounded-[26px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>خطوات نسخ الرابط من تطبيق SHEIN:</span>
            </span>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 pr-1 leading-relaxed">
            <li>افتح تطبيق <strong>SHEIN</strong> وادخل إلى سلة التسوق.</li>
            <li>اضغط على أيقونة <strong>المشاركة (Share)</strong> في الزاوية العلوية.</li>
            <li>اختر <strong>نسخ الرابط (Copy Link)</strong> ثم الصقه هنا بالحاسبة.</li>
          </ol>
        </div>
      )}

      {/* 2. Promotional Feature Banner (like "Get special offer" in Reference Photo) */}
      <div className="relative overflow-hidden rounded-[28px] bg-slate-950 text-white p-5 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black bg-white/10 text-emerald-400 backdrop-blur-xs tracking-wider">
              ضمان وصلة للشحن 🇱🇾
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              عمولة شراء 0% وشحن مجاني
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              توصيل دبي مجاني فوق $50 · والشحن إلى ليبيا 0.00 د.ل
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById("cart-input") as HTMLInputElement;
                if (input) input.focus();
              }}
              className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-black hover:bg-slate-100 transition active:scale-95 shadow-md"
            >
              احسب سلتك الآن
            </button>
          </div>
        </div>

        {/* Decorative ambient gradient */}
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. Input & Search Capsule (like "AI Style Search" in Reference Photo) */}
      <div className="rounded-[28px] bg-white border border-slate-150 p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <label htmlFor="cart-input" className="text-xs font-extrabold text-slate-900">
              رابط سلة التسوق:
            </label>
            {cart && (
              <button
                type="button"
                onClick={() => {
                  setCart(null);
                  setUrl("");
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700"
              >
                مسح السلة
              </button>
            )}
          </div>

          {/* Capsule Input Field */}
          <div className="relative">
            <input
              id="cart-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://onelink.shein.com/..."
              dir="ltr"
              className="w-full min-h-[52px] pl-20 pr-4 py-3 rounded-full border border-slate-200 bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-xs font-mono text-slate-900 placeholder:text-slate-400 transition"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 text-[11px] font-bold shadow-2xs hover:bg-slate-50 transition active:scale-95"
            >
              لصق
            </button>
          </div>

          {/* Primary Action Button (Matte Black Pill) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[50px] px-6 rounded-full bg-black hover:bg-slate-900 text-white font-extrabold text-sm shadow-md transition active:scale-95 disabled:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2 font-mono">
                <span className="font-black text-emerald-400 text-base">{Math.round(progress)}%</span>
                <span className="font-sans text-xs text-slate-200">جاري المعالجة...</span>
              </div>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>احسب السعر بالدينار الليبي</span>
              </>
            )}
          </button>
        </form>

        {/* 4. The 0 - 100% Progress Line */}
        {loading && (
          <div className="p-4 bg-[#F8F9FA] border border-slate-200/80 rounded-[22px] space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>{progressStatus || "جاري جلب واحتساب السلة..."}</span>
              </span>
              <span className="font-mono font-black text-slate-900 text-sm">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Smooth 0-100 Progress Line */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-black rounded-full transition-all duration-150 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-semibold px-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 5. Cart Results & Pricing Summary (like Reference Photo 3 bottom card) */}
      {cart && (
        <div className="space-y-4 animate-fadeIn">
          {/* Savings Badge */}
          {cart.pricing.savingsCents > 0 && (
            <div className="bg-[#FFF0F2] border border-[#FFE4E8] rounded-[24px] p-4 flex items-center justify-between text-xs text-[#E11D48] font-bold">
              <span>🎉 وفرت {formatUsd(cart.pricing.savingsCents)} من عروض وتخفيضات شي إن!</span>
              <span className="bg-white px-2.5 py-1 rounded-full shadow-2xs text-[11px]">
                خصم مباشر
              </span>
            </div>
          )}

          {/* Main Calculation Card */}
          <div className="rounded-[28px] bg-white border border-slate-100 shadow-[0_6px_30px_rgba(0,0,0,0.04)] p-5 space-y-4">
            <div className="flex items-end justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  الإجمالي النهائي بالدينار الليبي
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                  {cart.pricing.lyd.roundedLyd} <span className="text-lg font-bold text-slate-500">د.ل</span>
                </div>
              </div>

              <div className="text-left">
                <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {cart.pricing.units} سلع بالسلة
                </span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#F8F9FA] rounded-[20px] p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold mb-1">سعر السلع</span>
                <span className="font-mono font-black text-slate-800 text-sm">
                  {formatUsd(cart.pricing.productTotalCents)}
                </span>
              </div>

              <div className="bg-[#F8F9FA] rounded-[20px] p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold mb-1">توصيل دبي</span>
                <span className={`font-bold text-sm ${cart.pricing.dubaiDeliveryCents === 0 ? "text-emerald-600" : "text-slate-800 font-mono"}`}>
                  {cart.pricing.dubaiDeliveryCents === 0 ? "مجاني" : formatUsd(cart.pricing.dubaiDeliveryCents)}
                </span>
              </div>

              <div className="bg-[#F8F9FA] rounded-[20px] p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold mb-1">شحن ليبيا</span>
                <span className="font-bold text-emerald-600 text-sm">مجاني (0 د.ل)</span>
              </div>

              <div className="bg-[#F8F9FA] rounded-[20px] p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-bold mb-1">سعر الصرف</span>
                <span className="font-mono font-black text-slate-800 text-sm">
                  {cart.pricing.exchangeRate} د.ل
                </span>
              </div>
            </div>

            {/* Big Action Button (Order Modal) */}
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full min-h-[52px] rounded-full bg-black hover:bg-slate-900 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span>أكد طلبي الآن واحجز السلة</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 6. Products Listing (AI Picks For You Reference Style) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-extrabold text-slate-900 text-sm">محتويات السلة ({cart.products.length})</h3>
              <span className="text-xs text-slate-400 font-medium">قابلة للتعديل</span>
            </div>

            <div className="space-y-2.5">
              {cart.products.map((item) => {
                const itemLyd = Math.round((item.productUnitCents / 100) * currentRate);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-[24px] p-3.5 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex items-center gap-3.5"
                  >
                    {/* Image */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-[18px] bg-slate-50 overflow-hidden border border-slate-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate leading-snug">
                        {item.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.color && (
                          <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {item.size}
                          </span>
                        )}
                        <span className="text-slate-400 text-[10px]">كود: {item.id}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {itemLyd} د.ل
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({formatUsd(item.productUnitCents)})
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls (Minimalist Circular Buttons) */}
                    <div className="shrink-0 flex items-center gap-1.5 bg-[#F8F9FA] rounded-full p-1 border border-slate-100">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full bg-white text-slate-700 border border-slate-200/60 flex items-center justify-center hover:bg-slate-100 active:scale-90 transition"
                        title="إنقاص"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-5 text-center font-mono font-bold text-xs text-slate-800">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full bg-white text-slate-700 border border-slate-200/60 flex items-center justify-center hover:bg-slate-100 active:scale-90 transition"
                        title="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 rounded-full bg-white text-rose-600 border border-slate-200/60 flex items-center justify-center hover:bg-rose-50 active:scale-90 transition ml-0.5"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Exchange Rate Bottom Sheet Modal */}
      {isRateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-fadeIn p-0 sm:p-4"
          onClick={() => setIsRateModalOpen(false)}
        >
          <div
            className="bg-white rounded-t-[32px] sm:rounded-[32px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 transition-all animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  $
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">تعديل سعر الصرف</h3>
                  <span className="text-[11px] text-slate-400">تحديث فوري لجميع أسعار السلة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  سعر صرف 1 دولار بالدينار الليبي:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="100"
                    value={newRate}
                    onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                    className="w-full h-14 px-4 rounded-2xl border-2 border-slate-900 font-mono text-2xl font-black text-slate-900 focus:outline-none bg-slate-50/50 text-center"
                    autoFocus
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    د.ل
                  </span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {[9.8, 10.0, 10.09, 10.5, 11.0].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewRate(preset)}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition ${
                      newRate === preset
                        ? "bg-black text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {rateSaveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ سعر الصرف وإعادة احتساب السلة فوراً!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingRate}
                  className="flex-1 min-h-[48px] bg-black hover:bg-slate-900 text-white text-sm font-bold rounded-full transition active:scale-95 shadow-md disabled:opacity-60"
                >
                  {savingRate ? "جاري الحفظ..." : "حفظ وتحديث السعر"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRateModalOpen(false)}
                  className="min-h-[48px] px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-full transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Booking Modal */}
      {cart && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          cart={cart}
          pricing={cart.pricing}
        />
      )}
    </div>
  );
}
