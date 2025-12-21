import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-black relative overflow-hidden border-b-[5px] border-white/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-bangers text-6xl md:text-8xl mb-4 uppercase tracking-wide drop-shadow-[4px_4px_0_#000]">
            SIMPLE <span className="text-[#CCFF00] drop-shadow-[4px_4px_0_#000]">PRICING</span>
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl font-fredoka font-bold uppercase tracking-wider">
            Because we're bad at capitalism
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-black border-[4px] border-white p-10 hover:scale-105 transition-all duration-300 shadow-[10px_10px_0px_0px_#ffffff33] rounded-[32px] flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-bangers text-4xl uppercase text-white">CHEAPSKATE</h3>
              <span className="bg-[#CCFF00] text-black px-3 py-2 text-sm font-bangers uppercase border-2 border-black rounded-lg transform rotate-2">
                POPULAR
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-bangers text-7xl text-white">$0</span>
                <span className="text-gray-400 font-fredoka text-xl font-bold">/forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Full Story Mode (7 Acts)",
                "Generate shareable cards",
                "All data analytics",
                "Get Roasted (It's free now)",
                "Export to social media"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-fredoka text-white font-medium text-lg">
                  <div className="w-6 h-6 bg-[#CCFF00] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full border-2 border-black">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-white hover:bg-gray-200 text-black font-bangers text-xl uppercase tracking-widest py-6 border-4 border-white transition-all duration-200 rounded-xl shadow-[4px_4px_0_#CCFF00]"
            >
              START FREE
            </Button>
          </div>
          
          {/* Premium Tier (Sarcastic) */}
          <div className="bg-[#FF0066] border-[4px] border-black p-10 relative hover:scale-105 transition-all duration-300 shadow-[10px_10px_0px_0px_#ffffff33] rounded-[32px] flex flex-col">
            <div className="absolute -top-6 -right-4 bg-white text-black px-4 py-2 font-bangers text-lg uppercase border-[3px] border-black -rotate-3 shadow-[4px_4px_0_#000]">
              💸 FOR RICH PEOPLE
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-bangers text-4xl uppercase text-white drop-shadow-[2px_2px_0_#000]">HIGH ROLLER</h3>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-bangers text-7xl text-white drop-shadow-[3px_3px_0_#000]">$0</span>
                <span className="text-white/80 font-fredoka text-xl font-bold">/also forever</span>
              </div>
              <p className="text-lg text-white font-fredoka font-bold mt-2">
                Exactly the same, but pink.
              </p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Free",
                "You feel superior",
                "Pink background (fancy)",
                "Still $0 (we are bad at business)",
                "Unlimited bragging rights",
                "Priority support (we reply faster)"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-fredoka text-white font-bold text-lg">
                  <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0 mt-0.5 rounded-full border-2 border-black">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-white hover:bg-gray-100 text-black font-bangers text-xl uppercase tracking-widest py-6 border-4 border-black transition-all duration-200 rounded-xl shadow-[4px_4px_0_#000]"
            >
              FEEL EXPENSIVE
            </Button>
          </div>
        </div>
        
        <p className="text-center text-gray-500 font-bangers text-xl mt-16 max-w-2xl mx-auto uppercase tracking-widest">
          No credit card required. We don't even know how to process payments.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
