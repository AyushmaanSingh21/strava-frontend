import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <section id="pricing" className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 md:p-12 lg:p-16 shadow-xl grid-pattern relative">
        <h2 className="text-black font-heading text-7xl md:text-8xl text-center mb-16">
          PICK YOUR PACE
        </h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="bg-white border-4 border-black shadow-brutal-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-heading text-4xl">FREE FOREVER</h3>
              <span className="bg-black text-white px-3 py-1 text-xs font-body uppercase">
                START HERE
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-7xl font-bold">$0</span>
                <span className="text-muted-foreground font-body">/forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "All core stats & analytics",
                "Generate shareable cards",
                "Local comparison rankings",
                "1 free roast sample",
                "Export to social media"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-body">
                  <div className="w-6 h-6 bg-lime flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-black hover:bg-white hover:text-black text-white font-bold uppercase tracking-wide py-6 border-2 border-black hover:border-lime transition-all duration-200"
            >
              START FREE
            </Button>
          </div>
          
          {/* Premium Tier */}
          <div className="bg-white border-4 border-hot-pink shadow-brutal-lg p-8 relative pulse-glow">
            <div className="absolute -top-3 -right-3 bg-hot-pink text-white px-4 py-2 font-body text-xs uppercase font-bold border-2 border-black">
              🔥 NO LIMITS
            </div>
            
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-heading text-4xl">PREMIUM</h3>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-7xl font-bold">$4.99</span>
                <span className="text-muted-foreground font-body">/month</span>
              </div>
              <p className="text-sm text-muted-foreground font-body mt-1">
                or $2.99 one-time unlock
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                "Everything in Free",
                "Unlimited AI roasts",
                "Advanced insights & predictions",
                "Priority stats processing",
                "Custom card themes",
                "Performance tracking over time"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-body">
                  <div className="w-6 h-6 bg-hot-pink flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-hot-pink hover:bg-black hover:text-white hover:border-hot-pink text-white font-bold uppercase tracking-wide py-6 border-2 border-black transition-all duration-200"
            >
              GET PREMIUM
            </Button>
          </div>
        </div>
        
        {/* VS Divider */}
        <div className="flex justify-center -mt-[52px] md:-mt-[280px] relative z-20 pointer-events-none">
          <div className="bg-black text-lime px-6 py-3 font-heading text-3xl border-4 border-lime transform rotate-12">
            VS
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
