import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SplitScreenDemo from "@/components/SplitScreenDemo";
import AgentsGrid from "@/components/AgentsGrid";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <AgentsGrid />
      <SplitScreenDemo />
      <PricingSection />
      <Footer />
      <ChatModal />
    </main>
  );
}
