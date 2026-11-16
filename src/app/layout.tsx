import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0b192c",
};

export const metadata: Metadata = {
  title: "وصلة للشحن الجوي والبحري | WASLA for Shipping",
  description: "خدمات الشحن الجوي والبحري من الصين وتركيا والإمارات وأمريكا والسعودية إلى ليبيا. حاسبة سلات شي إن بدون عمولة شراء وشحن مجاني.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "وصلة للشحن",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white pb-14 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
