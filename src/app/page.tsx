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
        <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-600 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4615a4]" />
          <span>هوية للشحن والتسوق الدولي · Huwiyya Ship 🇱🇾</span>
        </div>
        <p className="text-[10px] text-slate-400">حاسبة سلات شي إن المباشرة بدون عمولة شراء وشحن مجاني</p>
      </footer>
    </main>
  );
}
