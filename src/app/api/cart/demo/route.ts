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
      imageUrl: "https://img.ltwebstatic.com/v4/j/pics3/2026/11/11/f0/179432935409378c1a06d7d31450ac99f22838f907.jpg",
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
      imageUrl: "https://img.ltwebstatic.com/images3_pi/2024/07/10/a5/1720584443a6d953ef8218151525a7b8e1a6c4295e_thumbnail_600x.webp",
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
      imageUrl: "https://img.ltwebstatic.com/images3_pi/2023/11/22/e1/170062402120e7f7223011400c2836ff744c80cb54_thumbnail_600x.webp",
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
