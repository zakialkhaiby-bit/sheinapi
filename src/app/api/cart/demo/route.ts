import { NextResponse } from "next/server";
import { calculatePricing } from "@/lib/pricing";
import { getSettings } from "@/lib/storage";
import { SheinProduct } from "@/types";

export async function GET() {
  const settings = getSettings();
  
  const demoProducts: SheinProduct[] = [
    {
      id: "demo-shirt",
      sku: "DEMO-SHIRT-PURPLE-M",
      name: "كنزة صوفية نسائية بياقة V وأكمام قصيرة (مثال توضيحي)",
      color: "بنفسجي",
      size: "M",
      imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      available: true,
      quantity: 1,
      originalUnitCents: 1950,
      productUnitCents: 1836,
    },
    {
      id: "demo-dress",
      sku: "DEMO-DRESS-BEIGE-L",
      name: "فستان ميدي كاجوال مزين بنقوش ناعمة (مثال توضيحي)",
      color: "بيج",
      size: "L",
      imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
      available: true,
      quantity: 1,
      originalUnitCents: 1800,
      productUnitCents: 1400,
      maxQuantity: 5,
    },
    {
      id: "demo-bag",
      sku: "DEMO-BAG-BROWN-OS",
      name: "حقيبة كتف جلدية كلاسيكية (مثال توضيحي)",
      color: "بني",
      size: "مقاس موحد",
      imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
      available: true,
      quantity: 1,
      originalUnitCents: 2500,
      productUnitCents: 1990,
    }
  ];

  const pricing = calculatePricing(demoProducts, settings.exchangeRate);

  return NextResponse.json({
    ok: true,
    cart: {
      kind: "demo",
      country: "AE",
      currency: "USD",
      pricesConfirmed: false,
      updatedAt: null,
      source: "منتجات وأسعار وصور توضيحية لتجربة الحاسبة، وليست بيانات حية من SHEIN",
      shareUrl: "https://onelink.shein.com/60/67svd5xn164m?shc=2_RdWTfd6LwPT",
      products: demoProducts,
      pricing,
    },
    pricing,
    settings,
  });
}
