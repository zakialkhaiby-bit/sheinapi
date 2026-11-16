import { NextResponse } from "next/server";
import { getOrders, saveOrder } from "@/lib/storage";

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ ok: true, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, phone, city, items, pricing, deliveryType, branch, address, notes, shareUrl } = body;

    if (!customerName || !phone || !city) {
      return NextResponse.json(
        { ok: false, error: "يرجى تعبئة الاسم ورقم الهاتف والمدينة" },
        { status: 400 }
      );
    }

    const order = saveOrder({
      customerName,
      phone,
      city,
      deliveryType: deliveryType || "branch",
      branch: branch || "فرع طرابلس - زناتة القديمة",
      address,
      notes,
      shareUrl,
      items: items || [],
      pricing: pricing || {
        productTotalUsd: 0,
        dubaiDeliveryUsd: 0,
        totalUsd: 0,
        exchangeRate: 10.09,
        totalLyd: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      order,
      message: "تم حفظ الطلب بنجاح",
    });
  } catch (err: any) {
    console.error("Order submission error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
