import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RoiStats from "@/components/RoiStats";
import SectorBar from "@/components/SectorBar";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FeatureTabs from "@/components/FeatureTabs";
import DemoSection from "@/components/DemoSection";
import IntegrationsOrbit from "@/components/IntegrationsOrbit";
import Testimonials from "@/components/Testimonials";
import Comparison from "@/components/Comparison";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <RoiStats />
      <SectorBar />
      <Features />
      <HowItWorks />
      <FeatureTabs />
      <DemoSection />
      <IntegrationsOrbit />
      <Testimonials />
      <Comparison />
      <PricingSection />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
