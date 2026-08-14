import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Demo from "@/components/Demo";
import Reviews from "@/components/Reviews";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <Hero />

      {/* Ticker divider */}
      <div className="border-y border-white/10 bg-black py-5 text-white">
        <Marquee
          items={[
            "Unwrap Your Run",
            "Get Roasted",
            "Shareable Cards",
            "Your Year in Running",
            "100% Free",
          ]}
          className="text-2xl md:text-4xl"
          accent="#CCFF00"
        />
      </div>

      <Features />
      <Demo />
      <Reviews />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
