import { NextResponse } from "next/server";
import { importSheinCart } from "@/lib/shein";
import { getSettings } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { ok: false, error: "الرجاء إدخال رابط مشاركة صالح من شي إن" },
        { status: 400 }
      );
    }

    const settings = getSettings();
    const cart = await importSheinCart(url.trim(), settings.exchangeRate);

    return NextResponse.json({
      ok: true,
      cart,
      pricing: cart.pricing,
      settings,
    });
  } catch (err: any) {
    console.error("Cart import error:", err);
    return NextResponse.json(
      { ok: false, error: "تعذر قراءة بيانات السلة. يرجى التأكد من الرابط والمحاولة مجدداً." },
      { status: 500 }
    );
  }
}
