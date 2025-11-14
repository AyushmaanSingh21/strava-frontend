import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#7C3AED' }}>
      <Navigation />
      <Hero />
      <Demo />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
