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
    <div className="min-h-screen bg-[#0B0910]">
      <Navigation />

      <Hero />

      {/* Ticker divider */}
      <div className="border-y border-white/10 bg-[#0B0910] py-5 text-white">
        <Marquee
          items={[
            "Unwrap Your Run",
            "Get Roasted",
            "Shareable Cards",
            "Your Year in Running",
            "100% Free",
          ]}
          className="text-2xl md:text-4xl"
          accent="#FFB84D"
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
