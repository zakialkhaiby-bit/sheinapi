import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#4615a4",
};

export const metadata: Metadata = {
  title: "هوية للشحن والتسوق الدولي | HUWIYYA",
  description: "خدمات الشحن والتسوق الدولي مع هوية huwiyya. حاسبة سلات شي إن المباشرة بدون عمولة شراء وبأفضل سعر صرف.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "هوية huwiyya",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#F8F9FA] text-slate-900 antialiased selection:bg-[#4615a4] selection:text-white pb-14 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
