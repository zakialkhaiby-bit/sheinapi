"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Building2, Home, Truck, Shield, Sparkles } from "lucide-react";
import { SheinCart } from "@/types";
import { formatLyd, formatUsd } from "@/lib/pricing";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SheinCart;
  pricing?: any;
}

const TOP_CITIES = ["طرابلس", "مصراتة", "بنغازي", "الزاوية", "زليتن", "الخمس"];

const ALL_CITIES = [
  "طرابلس",
  "مصراتة",
  "بنغازي",
  "الزاوية",
  "زليتن",
  "الخمس",
  "صبراتة",
  "غريان",
  "طبرق",
  "درنة",
  "البيضاء",
  "سبها",
  "سرت",
  "ترهونة",
  "تاجوراء",
  "جنزور",
  "صرمان",
  "مسلاتة",
  "بني وليد",
];

export default function OrderModal({ isOpen, onClose, cart }: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("طرابلس");
  const [deliveryType, setDeliveryType] = useState<"branch" | "home">("branch");
  const [branch, setBranch] = useState("فرع طرابلس - زناتة القديمة");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    setSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        phone,
        city,
        deliveryType,
        branch: deliveryType === "branch" ? branch : undefined,
        address: deliveryType === "home" ? address : undefined,
        notes,
        shareUrl: cart.shareUrl,
        items: cart.products.map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          quantity: p.quantity,
          color: p.color,
          size: p.size,
          unitPriceUsd: p.productUnitCents / 100,
          totalPriceUsd: (p.productUnitCents * p.quantity) / 100,
          imageUrl: p.imageUrl,
        })),
        pricing: {
          productTotalUsd: cart.pricing.productTotalCents / 100,
          dubaiDeliveryUsd: cart.pricing.dubaiDeliveryCents / 100,
          totalUsd: cart.pricing.payableCents / 100,
          exchangeRate: cart.pricing.exchangeRate,
          totalLyd: cart.pricing.lyd.roundedLyd,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const resData = await res.json();
      const refId = resData.order?.id || `ORD-${Date.now().toString().slice(-4)}`;
      setOrderRef(refId);

      // Prepare WhatsApp message
      const waText = encodeURIComponent(
        `السلام عليكم شركة وصلة للشحن 🇱🇾\n` +
        `أرغب في تأكيد طلب سلة شي إن (رقم الحجز: ${refId}):\n\n` +
        `👤 الاسم: ${customerName}\n` +
        `📱 الهاتف: ${phone}\n` +
        `📍 المدينة: ${city}\n` +
        `🚚 طريقة الاستلام: ${deliveryType === "branch" ? `من الفرع (${branch})` : `توصيل للمنزل (${address})`}\n` +
        `🔗 رابط السلة: ${cart.shareUrl || "سلة مباشرة"}\n\n` +
        `📦 عدد القطع: ${cart.pricing.units} قطعة\n` +
        `💵 إجمالي المنتجات: ${formatUsd(cart.pricing.productTotalCents)}\n` +
        `🇱🇾 الإجمالي المطلوب: ${formatLyd(cart.pricing.lyd.roundedLyd)}\n` +
        (notes ? `📝 ملاحظات: ${notes}\n\n` : `\n`) +
        `أرجو تزويدي ببيانات الدفع للتأكيد وشكراً لكم.`
      );

      // Open WhatsApp direct URL
      window.open(`https://wa.me/218943964444?text=${waText}`, "_blank");
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold tracking-tight">تأكيد حجز سلة SHEIN</h3>
            <p className="text-[11px] text-slate-300">تسجيل الطلب والتأكيد الفوري عبر واتساب</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* The Ending (Peak-End Rule celebration screen) */}
        {success ? (
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full mb-2">
                رقم الحجز: {orderRef}
              </span>
              <h4 className="text-2xl font-black text-slate-900">تم تسجيل طلبك بنجاح!</h4>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              تم فتح محادثة واتساب الرسمية مع فريق العمليات، وسيتواصل معك الموظف المختص لتأكيد استلام الطلب وإيداع القيمة.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-right space-y-1.5">
              <div>• <strong>المبلغ الإجمالي:</strong> {formatLyd(cart.pricing.lyd.roundedLyd)}</div>
              <div>• <strong>طريقة الدفع:</strong> نقداً في الفرع أو عبر تحويل مصرفي محلي.</div>
              <div>• <strong>عمولة الشراء:</strong> 0% مجاناً.</div>
            </div>

            <button
              onClick={onClose}
              className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold transition text-sm shadow-md"
            >
              تم، إغلاق النافذة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Price Preview Card */}
            <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-[22px] p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold">الإجمالي بالدينار:</span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {cart.pricing.lyd.roundedLyd} د.ل
                </span>
              </div>
              <div className="text-left text-xs text-slate-600 space-y-0.5 font-medium">
                <div>القطع: <strong>{cart.pricing.units}</strong></div>
                <div>الشحن لليبيا: <strong className="text-emerald-600">مجاني</strong></div>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الثلاثي *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: محمد فرج الفيتوري"
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف (ليبيانا / المدار) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="091XXXXXXX أو 092XXXXXXX"
                dir="ltr"
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-right bg-slate-50/50 font-mono"
              />
            </div>

            {/* City - Selection Over Manual Input (Pill buttons + dropdown) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                المدينة *
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {TOP_CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`min-h-[34px] px-3 rounded-xl text-xs font-bold transition ${
                      city === c
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                {ALL_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Option - Tactile Radio Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                طريقة الاستلام المفضلة
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryType("branch")}
                  className={`min-h-[50px] flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                    deliveryType === "branch"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>استلام من الفرع</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType("home")}
                  className={`min-h-[50px] flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition ${
                    deliveryType === "home"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>توصيل للمنزل</span>
                </button>
              </div>
            </div>

            {deliveryType === "branch" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر الفرع المناسب لك
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="فرع طرابلس - زناتة القديمة">فرع طرابلس - زناتة القديمة (قرب جامع المرأة)</option>
                  <option value="فرع مصراتة - شارع طرابلس">فرع مصراتة - شارع طرابلس (إشارة برو جيم)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان بالتفصيل
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة"
                  className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50/50"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات أو مقاسات خاصة..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none bg-slate-50/50"
              />
            </div>

            {/* Thumb-Zone Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[52px] flex items-center justify-center gap-2 bg-black hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-full shadow-lg transition disabled:opacity-50 text-sm active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>{submitting ? "جاري تجهيز الحجز..." : "إرسال وتأكيد الطلب عبر واتساب"}</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2 text-center">
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>دفع آمن بعد التأكيد، ولا توجد أي عمولة شراء مخفية.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
