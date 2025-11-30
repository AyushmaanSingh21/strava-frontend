import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-display text-6xl md:text-8xl font-black mb-4 uppercase tracking-tight">
            SIMPLE PRICING
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider">
            Start free. Upgrade when you're ready.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-black border-4 border-white p-10 hover:scale-105 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] rounded-3xl">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-display text-4xl font-black uppercase text-white">FREE FOREVER</h3>
              <span className="bg-[#CCFF00] text-black px-3 py-2 text-xs font-bold uppercase border-2 border-white rounded-lg">
                START HERE
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-7xl font-black text-white">$0</span>
                <span className="text-gray-400 font-body text-xl">/forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Full Story Mode (7 Acts)",
                "Generate shareable cards",
                "All data analytics",
                "1 free roast sample",
                "Export to social media"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-gray-300">
                  <div className="w-6 h-6 bg-[#CCFF00] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-white hover:bg-[#CCFF00] text-black font-bold uppercase tracking-wide py-6 border-4 border-white transition-all duration-200 rounded-xl"
            >
              START FREE
            </Button>
          </div>
          
          {/* Premium Tier */}
          <div className="bg-black border-4 border-[#FF0066] p-10 relative hover:scale-105 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(255,0,102,0.3)] rounded-3xl">
            <div className="absolute -top-4 -right-4 bg-[#FF0066] text-white px-4 py-2 font-bold text-xs uppercase border-2 border-white rotate-3 rounded-lg shadow-lg">
              🔥 MOST POPULAR
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-display text-4xl font-black uppercase text-white">PREMIUM</h3>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-7xl font-black text-[#FF0066]">$2.99</span>
              </div>
              <p className="text-lg text-gray-400 font-body mt-2">
                One-time payment • Lifetime access
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Everything in Free",
                "Unlimited AI roasts",
                "10-minute AI coach chat",
                "Advanced insights & predictions",
                "Downloadable roast reports",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-gray-300">
                  <div className="w-6 h-6 bg-[#FF0066] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-[#FF0066] hover:bg-white hover:text-black text-white font-bold uppercase tracking-wide py-6 border-4 border-[#FF0066] hover:border-white transition-all duration-200 rounded-xl"
            >
              GET PREMIUM
            </Button>
          </div>
        </div>
        
        <p className="text-center text-gray-500 font-bold text-sm mt-16 uppercase tracking-wider">
          No hidden fees • No subscriptions • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default Pricing;
