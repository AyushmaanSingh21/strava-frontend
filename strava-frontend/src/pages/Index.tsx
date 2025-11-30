import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div id="hero">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="demo">
        <Demo />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
