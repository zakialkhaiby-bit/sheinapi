import { NextResponse } from "next/server";
import { calculatePricing } from "@/lib/pricing";
import { getSettings } from "@/lib/storage";
import { SheinProduct } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, products } = body;
    const settings = getSettings();

    // If full products array is provided
    if (products && Array.isArray(products)) {
      const pricing = calculatePricing(products, settings.exchangeRate);
      return NextResponse.json({
        ok: true,
        pricing,
        settings,
      });
    }

    // If partial items with updated quantities are provided
    if (items && Array.isArray(items)) {
      const mappedProducts: SheinProduct[] = items.map((it: any) => ({
        id: it.id || it.sku,
        sku: it.sku || it.id,
        name: it.name || "منتج شي إن",
        imageUrl: it.imageUrl || "",
        available: it.available !== false,
        quantity: Math.max(1, Number(it.quantity) || 1),
        originalUnitCents: Number(it.originalUnitCents || it.productUnitCents || it.salePriceCents || 0),
        productUnitCents: Number(it.productUnitCents || it.salePriceCents || 0),
        color: it.color,
        size: it.size,
      }));

      const pricing = calculatePricing(mappedProducts, settings.exchangeRate);
      return NextResponse.json({
        ok: true,
        pricing,
        settings,
      });
    }

    return NextResponse.json({ ok: false, error: "قائمة المنتجات غير صحيحة" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
