import Navbar from "@/components/Navbar";
import SheinCalculator from "@/components/SheinCalculator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9FA] pb-24">
      <Navbar />
      <div className="flex-1 w-full max-w-md mx-auto px-3.5 pt-2">
        <SheinCalculator />
      </div>
      <footer className="mt-8 text-center text-[11px] text-slate-400 py-4 max-w-md mx-auto px-4">
        <p>© {new Date().getFullYear()} وصلة للشحن الدولي · Wasla Ship 🇱🇾</p>
        <p className="mt-0.5 text-[10px]">حاسبة سلات شي إن المباشرة · عمولة شراء 0% وشحن مجاني</p>
      </footer>
    </main>
  );
}
