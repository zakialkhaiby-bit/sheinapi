import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SheinCalculator from "@/components/SheinCalculator";
import HowItWorks from "@/components/HowItWorks";
import ShippingRates from "@/components/ShippingRates";
import GeneralShippingCalculator from "@/components/GeneralShippingCalculator";
import Branches from "@/components/Branches";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <SheinCalculator />
      <HowItWorks />
      <ShippingRates />
      <GeneralShippingCalculator />
      <Branches />
      <FAQ />
      <Footer />
    </main>
  );
}
