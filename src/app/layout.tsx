import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "وصلة للشحن الجوي والبحري | WASLA for Shipping",
  description: "خدمات الشحن الجوي والبحري من الصين وتركيا والإمارات وأمريكا والسعودية إلى ليبيا. حاسبة سلات شي إن بدون عمولة شراء وشحن مجاني.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
