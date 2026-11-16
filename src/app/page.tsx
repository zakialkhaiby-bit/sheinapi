import Navbar from "@/components/Navbar";
import SheinCalculator from "@/components/SheinCalculator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-100/70 pb-10">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto pt-2 sm:pt-4">
        <SheinCalculator />
      </div>
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-xs py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} وصلة للشحن الدولي · Wasla Ship. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-3">
            <a href="tel:0943964444" className="hover:text-emerald-700 transition font-mono" dir="ltr">
              094 396 44 44
            </a>
            <span>•</span>
            <a
              href="https://wa.me/218943964444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold transition"
            >
              خدمة العملاء (واتساب)
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
