import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SectorBar from "@/components/SectorBar";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import PricingSection from "@/components/PricingSection";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SectorBar />
      <HowItWorks />
      <Features />
      <Testimonials />
      <PricingSection />
      <Comparison />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
