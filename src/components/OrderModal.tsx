"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Building2, Home, Truck, Shield } from "lucide-react";
import { SheinCart } from "@/types";
import { formatLyd, formatUsd } from "@/lib/pricing";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SheinCart;
}

const LIBYAN_CITIES = [
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

      // Save to backend
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      // Prepare WhatsApp message
      const itemsSummary = cart.products
        .map((p, idx) => `${idx + 1}. ${p.name} (كمية: ${p.quantity} - ${formatUsd(p.productUnitCents * p.quantity)})`)
        .slice(0, 10)
        .join("\n");

      const waText = encodeURIComponent(
        `السلام عليكم وصلة للشحن، أرغب في تأكيد طلب سلة شي إن:\n\n` +
        `👤 الاسم: ${customerName}\n` +
        `📱 الهاتف: ${phone}\n` +
        `📍 المدينة: ${city}\n` +
        `🚚 طريقة الاستلام: ${deliveryType === "branch" ? `من الفرع (${branch})` : `توصيل للمنزل (${address})`}\n` +
        `🔗 رابط السلة: ${cart.shareUrl || "سلة مباشرة"}\n\n` +
        `📦 عدد المنتجات: ${cart.pricing.units} قطعة\n` +
        `💵 إجمالي المنتجات: ${formatUsd(cart.pricing.productTotalCents)}\n` +
        `✈️ رسوم التوصيل لدبي: ${formatUsd(cart.pricing.dubaiDeliveryCents)}\n` +
        `🇱🇾 الإجمالي بالدينار الليبي: ${formatLyd(cart.pricing.lyd.roundedLyd)}\n` +
        (notes ? `📝 ملاحظات: ${notes}\n\n` : `\n`) +
        `أرجو إرسال بيانات الدفع والتأكيد.`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">تأكيد طلب سلة SHEIN</h3>
            <p className="text-xs text-emerald-100">سيتم إرسال الطلب وحجزه في حسابات وصلة فوراً</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">تم تسجيل طلبك بنجاح!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              تم تحويلك إلى محادثة واتساب الرسمية مع فريق العمليات لتأكيد الطلب ودفع القيمة في أحد فروعنا أو عبر التحويل المصرفي.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Price Preview Card */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">الإجمالي المطلوب بالدينار</span>
                <span className="text-2xl font-black text-emerald-700">
                  {formatLyd(cart.pricing.lyd.roundedLyd)}
                </span>
              </div>
              <div className="text-left text-xs text-slate-600 space-y-0.5">
                <div>القطع: <strong>{cart.pricing.units}</strong></div>
                <div>بالدولار: <strong>{formatUsd(cart.pricing.payableCents)}</strong></div>
                <div>الشحن لليبيا: <strong className="text-emerald-600">مجاناً</strong></div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الثلاثي *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: أحمد محمد علي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المدينة *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                {LIBYAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Option */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                طريقة الاستلام
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType("branch")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                    deliveryType === "branch"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>استلام من الفرع</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType("home")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                    deliveryType === "home"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>توصيل للمنزل</span>
                </button>
              </div>
            </div>

            {deliveryType === "branch" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر الفرع
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{submitting ? "جاري الإرسال..." : "إرسال وتأكيد عبر واتساب"}</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mt-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>دفع آمن بعد التأكيد، ولا توجد أي عمولة شراء مخفية.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
