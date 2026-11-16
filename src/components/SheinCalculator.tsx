"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Clipboard,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { SheinCart, SheinProduct } from "@/types";
import { formatLyd, formatUsd } from "@/lib/pricing";
import OrderModal from "./OrderModal";

export default function SheinCalculator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<SheinCart | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Load demo cart on mount so the user immediately sees the calculator in action!
  useEffect(() => {
    loadDemoCart();
  }, []);

  const loadDemoCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/demo");
      const data = await res.json();
      if (data.ok) {
        setCart(data.cart);
        setUrl(data.cart.shareUrl || "");
      }
    } catch (err) {
      console.error(err);
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

      setCart(data.cart);
    } catch (err: any) {
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
      // Clipboard access blocked by browser permission
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

    // Call recalculation API
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

  return (
    <section id="shein-calculator" className="py-16 px-4 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>نظام الشراء المباشر</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3">
            حاسبة سلات SHEIN الرسمية
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            انسخ رابط مشاركة سلتك من تطبيق شي إن، وسيقوم نظامنا بقراءة القطع وحساب السعر بالدينار الليبي فوراً.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200/80 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleImport();
            }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">رابط مشاركة السلة:</span>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>كيف تجيب رابط سلتك؟</span>
              </button>
            </div>

            {/* Help Drawer */}
            {showHelp && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 space-y-2 animate-fadeIn">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>طريقة نسخ رابط سلة شي إن في 3 ثوانٍ:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pr-2">
                  <li>افتح تطبيق <strong>SHEIN</strong> وادخل إلى سلة التسوق الخاصة بك.</li>
                  <li>اضغط على أيقونة <strong>المشاركة (Share)</strong> في أعلى يسار الشاشة.</li>
                  <li>اختر <strong>نسخ الرابط (Copy Link)</strong> ثم الصقه هنا مباشرة.</li>
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
                  className="w-full pl-24 pr-4 py-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition"
                >
                  <Clipboard className="w-3 h-3" />
                  <span>لصق</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 active:scale-95 transition disabled:opacity-60 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري القراءة...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>احسب السعر</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Button */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={loadDemoCart}
                className="text-slate-500 hover:text-emerald-600 transition flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>جرّب سلة توضيحية لمعاينة الحاسبة</span>
              </button>

              {cart && (
                <button
                  type="button"
                  onClick={() => {
                    setCart(null);
                    setUrl("");
                  }}
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  مسح السلة
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Area */}
        {cart && (
          <div className="space-y-6 animate-fadeIn">
            {/* Source info bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl px-5 py-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>المتجر المصدر: <strong>متجر الإمارات (AE)</strong></span>
                <span className="text-slate-300">|</span>
                <span>سعر الصرف المعتمد: <strong>{cart.pricing.exchangeRate} د.ل / $</strong></span>
              </div>
              <div className="text-slate-500">
                {cart.kind === "demo" ? "وضع تجريبي" : "بيانات حقيقية مستوردة"}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products List (2 cols) */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-slate-800 px-1">
                  <span>محتويات السلة ({cart.pricing.units} قطعة)</span>
                  <span className="text-xs text-slate-500 font-normal">يمكنك تعديل الكميات أو حذف قطع</span>
                </div>

                <div className="space-y-3">
                  {cart.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3 sm:gap-4 card-hover"
                    >
                      {/* Image */}
                      <div className="w-16 h-20 sm:w-20 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-1">
                          {product.name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                          {product.color && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                              اللون: {product.color}
                            </span>
                          )}
                          {product.size && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                              المقاس: {product.size}
                            </span>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm sm:text-base font-black text-emerald-700">
                            {formatUsd(product.productUnitCents)}
                          </span>
                          {product.originalUnitCents > product.productUnitCents && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatUsd(product.originalUnitCents)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          title="حذف القطعة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-slate-700 shadow-xs hover:bg-slate-50 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {product.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-slate-700 shadow-xs hover:bg-slate-50 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary Card (1 col) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl shadow-slate-200/50 sticky top-24 space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-black text-slate-900">ملخص الحساب والتكلفة</h3>
                    <p className="text-xs text-slate-500">حساب فوري بالدينار الليبي</p>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>إجمالي المنتجات ({cart.pricing.units} قطعة):</span>
                      <span className="font-bold">{formatUsd(cart.pricing.originalTotalCents)}</span>
                    </div>

                    {cart.pricing.savingsCents > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
                        <span>توفير وخصم شي إن:</span>
                        <span>- {formatUsd(cart.pricing.savingsCents)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span>صافي السلع بعد الخصم:</span>
                      <span className="font-bold">{formatUsd(cart.pricing.productTotalCents)}</span>
                    </div>

                    {/* Dubai delivery fee */}
                    <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <span>توصيل شي إن لمستودع دبي:</span>
                      </div>
                      {cart.pricing.dubaiDeliveryCents === 0 ? (
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                          مجاني (تجاوزت 50$)
                        </span>
                      ) : (
                        <span className="font-bold text-amber-700">
                          {formatUsd(cart.pricing.dubaiDeliveryCents)}
                        </span>
                      )}
                    </div>

                    {cart.pricing.dubaiDeliveryCents > 0 && (
                      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-800">
                        💡 أضف منتجات بقيمة{" "}
                        <strong>
                          {formatUsd(5000 - cart.pricing.productTotalCents)}
                        </strong>{" "}
                        لتحصل على شحن دبي مجاناً!
                      </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600">
                      <span>الشحن إلى ليبيا:</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                        مجاني 0.00 د.ل
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>عمولة الشراء من الموقع:</span>
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                        0% بدون عمولة
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-xs">
                      <span>سعر الصرف:</span>
                      <span>{cart.pricing.exchangeRate} د.ل / $</span>
                    </div>
                  </div>

                  {/* Final Total */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-inner space-y-1">
                    <span className="text-xs text-slate-400 block">المبلغ الإجمالي النهائي بالدينار:</span>
                    <div className="text-3xl font-black text-emerald-400 tracking-tight">
                      {formatLyd(cart.pricing.lyd.roundedLyd)}
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      ما يعادل {formatUsd(cart.pricing.payableCents)} (مقرب لأقرب 5 د.ل)
                    </span>
                  </div>

                  {/* Confirm Button */}
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/30 text-base hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <span>أكّد طلبي الآن</span>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    لا حاجة لبطاقة دولية، ادفع نقداً في فروعنا بطرابلس أو مصراتة أو عبر تحويل مصرفي.
                  </p>
                </div>
              </div>
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
    </section>
  );
}
