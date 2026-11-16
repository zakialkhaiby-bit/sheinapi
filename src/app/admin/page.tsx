"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, ShoppingBag, DollarSign, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { AppSettings, OrderSubmission } from "@/types";
import { formatLyd, formatUsd } from "@/lib/pricing";

export default function AdminPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [orders, setOrders] = useState<OrderSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/orders"),
      ]);
      const sData = await sRes.json();
      const oData = await oRes.json();
      setSettings(sData);
      setOrders(oData.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600 font-bold text-sm">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900">لوحة تحكم وإدارة وصلة</h1>
            <p className="text-xs text-slate-500">إدارة أسعار الصرف، رسوم الشحن، وطلبات الزبائن</p>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <span>العودة للموقع الرئيسي</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form (1 col) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-emerald-600" />
              <span>إعدادات التسعير والصرف</span>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  سعر صرف الدولار (بالدينار الليبي)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100"
                    value={settings.exchangeRate}
                    onChange={(e) =>
                      setSettings({ ...settings, exchangeRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    د.ل
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  يؤثر فوراً على جميع الحسابات بالسلة.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  حد الشحن المجاني لدبي ($)
                </label>
                <input
                  type="number"
                  step="1"
                  value={settings.freeShippingDubaiThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      freeShippingDubaiThreshold: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رسوم توصيل دبي للسلات الأقل من الحد ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.dubaiDeliveryFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      dubaiDeliveryFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم هاتف خدمة العملاء
                </label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ الإعدادات وتحديث الحاسبة بنجاح!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-emerald-600/20 disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
              </button>
            </form>
          </div>

          {/* Orders List (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>سجل طلبات الزبائن ({orders.length})</span>
              </div>
              <button
                type="button"
                onClick={fetchData}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                title="تحديث"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                لا توجد طلبات مسجلة بعد. عند قيام الزبائن بتأكيد طلباتهم ستظهر هنا مباشرة.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">
                        {order.customerName} - {order.phone}
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        {formatLyd(order.pricing.totalLyd)}
                      </span>
                    </div>

                    <div className="text-slate-500 flex flex-wrap gap-2">
                      <span>المدينة: <strong>{order.city}</strong></span>
                      <span>•</span>
                      <span>
                        الاستلام:{" "}
                        <strong>
                          {order.deliveryType === "branch" ? order.branch : `منزل: ${order.address}`}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>التاريخ: {new Date(order.createdAt).toLocaleDateString("ar-LY")}</span>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 text-slate-600">
                        <span className="font-semibold block mb-1">
                          القطع ({order.items.length}):
                        </span>
                        <div className="space-y-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>
                                {it.name} (كمية: {it.quantity})
                              </span>
                              <span className="font-mono">${it.totalPriceUsd.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
