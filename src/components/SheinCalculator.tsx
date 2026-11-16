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
  Gift,
  ShieldCheck,
  Sliders,
  DollarSign,
  Save,
  X,
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

  // Loading Progress State (0 - 100%)
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    setProgress(5);
    setProgressStatus("الاتصال بسيرفر شي إن...");
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setProgressStatus("الاتصال بسيرفر شي إن والتحقق من الرابط...");
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
    }, 80);
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

    window.addEventListener("exchangeRateUpdated", onRateUpdate);
    return () => window.removeEventListener("exchangeRateUpdated", onRateUpdate);
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

        // If a cart is currently loaded, recalculate with the new rate!
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
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRate(false);
    }
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
    <div id="shein-calculator" className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
      {/* Top Quick Bar: Exchange Rate Control */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-sm mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            $
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">سعر الصرف المعتمد</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm sm:text-base font-mono">
              <span>1$ = {currentRate} دينار ليبي</span>
            </div>
          </div>
        </div>

        {/* Change Rate Button */}
        <button
          type="button"
          onClick={() => {
            setNewRate(currentRate);
            setIsRateModalOpen(true);
          }}
          className="min-h-[40px] px-3.5 sm:px-4 flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>تعديل سعر الصرف</span>
        </button>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200/80 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImport();
          }}
          className="space-y-3.5"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span className="font-bold text-slate-800">رابط مشاركة سلة SHEIN:</span>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 p-1 rounded-lg hover:bg-emerald-50 transition"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>كيف تجيب الرابط؟</span>
            </button>
          </div>

          {showHelp && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 space-y-2 animate-fadeIn">
              <div className="font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>طريقة نسخ الرابط من تطبيق شي إن:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-2">
                <li>افتح تطبيق <strong>SHEIN</strong> وادخل إلى سلة التسوق.</li>
                <li>اضغط على زر <strong>المشاركة (Share)</strong> في أعلى الشاشة.</li>
                <li>اختر <strong>نسخ الرابط (Copy Link)</strong> ثم الصقه هنا.</li>
              </ol>
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                id="cart-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://onelink.shein.com/..."
                dir="ltr"
                className="w-full min-h-[50px] pl-20 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 min-h-[36px] px-3 flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>لصق</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto shrink-0 min-h-[50px] px-7 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 active:scale-95 transition disabled:opacity-90 text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-black text-emerald-100 text-base">{Math.round(progress)}%</span>
                  <span className="font-sans text-xs">جاري الحساب...</span>
                </div>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>احسب السعر</span>
                </>
              )}
            </button>
          </div>

          {/* خط تحميل تفاعلي من 0 إلى 100 */}
          {loading && (
            <div className="p-3.5 sm:p-4 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl shadow-xs animate-fadeIn space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-slate-800">{progressStatus || "جاري جلب واحتساب السلة..."}</span>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-emerald-700 text-sm">
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* خط التحميل الرئيسي 0-100 */}
              <div className="relative w-full h-3 bg-emerald-200/60 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-xs"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-medium px-0.5">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={loadDemoCart}
              className="text-slate-500 hover:text-emerald-700 transition flex items-center gap-1.5 py-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>عرض سلة توضيحية</span>
            </button>

            {cart && (
              <button
                type="button"
                onClick={() => {
                  setCart(null);
                  setUrl("");
                }}
                className="text-rose-600 hover:text-rose-700 font-bold py-1 px-2 rounded-lg hover:bg-rose-50 transition"
              >
                مسح السلة
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Cart Results */}
      {cart && (
        <div className="space-y-5 animate-fadeIn pb-24 sm:pb-0">
          {/* Peak Moment Savings Pill */}
          {cart.pricing.savingsCents > 0 && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-emerald-200 shrink-0" />
                <div className="text-xs sm:text-sm font-bold">
                  وفرت {formatUsd(cart.pricing.savingsCents)} من عروض شي إن! عمولة الشراء 0% والشحن لليبيا مجاني.
                </div>
              </div>
              <span className="font-mono font-black text-base hidden sm:inline shrink-0">
                {formatLyd(cart.pricing.lyd.roundedLyd)}
              </span>
            </div>
          )}

          {/* Pricing Summary Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-lg space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">تفاصيل الحساب</h3>
                <span className="text-xs text-slate-500">{cart.pricing.units} قطعة في السلة</span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-medium">الإجمالي النهائي بالدينار</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tabular-nums">
                  {formatLyd(cart.pricing.lyd.roundedLyd)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">سعر السلع (USD)</span>
                <strong className="text-slate-800 font-mono text-sm">{formatUsd(cart.pricing.productTotalCents)}</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">توصيل دبي</span>
                <strong className={`font-mono text-sm ${cart.pricing.dubaiDeliveryCents === 0 ? "text-emerald-700" : "text-amber-700"}`}>
                  {cart.pricing.dubaiDeliveryCents === 0 ? "مجاني" : formatUsd(cart.pricing.dubaiDeliveryCents)}
                </strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">الشحن لليبيا</span>
                <strong className="text-emerald-700 text-sm">مجاني (0.00 د.ل)</strong>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">سعر الصرف</span>
                <strong className="text-slate-800 font-mono text-sm">{cart.pricing.exchangeRate} د.ل</strong>
              </div>
            </div>

            {cart.pricing.dubaiDeliveryCents > 0 && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-900 leading-snug">
                💡 أضف منتجات بقيمة{" "}
                <strong className="font-mono font-bold">
                  {formatUsd(5000 - cart.pricing.productTotalCents)}
                </strong>{" "}
                لتحصل على توصيل دبي مجاناً!
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full min-h-[50px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-emerald-600/25 text-base active:scale-95 transition"
            >
              <span>أكّد طلبي الآن واحجز السلة</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </div>

          {/* Products List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 px-1">
              <span>محتويات السلة ({cart.products.length} منتج)</span>
              <span className="text-xs text-slate-400 font-normal">يمكنك تعديل الكمية أو الحذف</span>
            </div>

            <div className="space-y-2.5">
              {cart.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-16 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug mb-1">
                      {product.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                      {product.color && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{product.color}</span>}
                      {product.size && <span className="bg-slate-100 px-1.5 py-0.5 rounded">{product.size}</span>}
                    </div>

                    <div className="flex items-baseline gap-2 font-mono tabular-nums text-xs sm:text-sm">
                      <span className="font-black text-emerald-700">
                        {formatUsd(product.productUnitCents)}
                      </span>
                      {product.originalUnitCents > product.productUnitCents && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatUsd(product.originalUnitCents)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-700 shadow-xs hover:bg-slate-50 active:scale-90 transition font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono tabular-nums">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-700 shadow-xs hover:bg-slate-50 active:scale-90 transition font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Bar on Mobile */}
      {cart && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between sm:hidden animate-slideUp">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              {cart.pricing.units} قطع · شحن مجاني
            </div>
            <div className="text-xl font-black text-emerald-700 font-mono tabular-nums leading-tight">
              {formatLyd(cart.pricing.lyd.roundedLyd)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderModalOpen(true)}
            className="min-h-[44px] px-6 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 active:scale-95 transition text-xs"
          >
            <span>أكّد طلبي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

      {/* Quick Exchange Rate Edit Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">تعديل سعر الصرف</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سعر صرف الدولار الواحد (بالدينار الليبي)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-base font-bold text-slate-900"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    د.ل
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  سيتم تحديث سعر السلة الحالية وجميع الحسابات فوراً.
                </span>
              </div>

              {rateSaveSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ سعر الصرف وتحديث السلة بنجاح!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingRate}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>{savingRate ? "جاري الحفظ..." : "حفظ وتحديث السعر فوراً"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {cart && (
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          cart={cart}
        />
      )}
    </div>
  );
}
