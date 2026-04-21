import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SplitScreenDemo from "@/components/SplitScreenDemo";
import AgentsGrid from "@/components/AgentsGrid";
import Testimonials from "@/components/Testimonials";
import PricingSection from "@/components/PricingSection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";
import NeuralBackground from "@/components/NeuralBackground";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative">
      <NeuralBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AgentsGrid />
        <SplitScreenDemo />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <Footer />
      </div>
      <ChatModal />
    </main>
  );
}
