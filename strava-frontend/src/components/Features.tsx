import { BarChart3, CreditCard, MapPin, Flame } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "STATS THAT POP",
      description: "Numbers with personality. Your 5K looks like a championship performance.",
      icon: BarChart3,
      color: "lime",
      number: "01"
    },
    {
      title: "FLEX-WORTHY CARDS",
      description: "Screenshot-ready stats designed for maximum engagement. Your feed will thank you.",
      icon: CreditCard,
      color: "hot-pink",
      number: "02"
    },
    {
      title: "LOCAL RANKINGS",
      description: "See where you stand against runners in your area. Claim your territory.",
      icon: MapPin,
      color: "electric-blue",
      number: "03"
    },
    {
      title: "GET ROASTED",
      description: "AI analyzes your runs and serves brutally honest feedback. Premium feature. No mercy.",
      icon: Flame,
      color: "intensity-red",
      number: "04",
      premium: true
    }
  ];
  
  return (
    <section id="features" className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-black p-8 md:p-12 lg:p-16 shadow-2xl">
        <h2 className="text-white font-heading text-7xl md:text-8xl text-center mb-16">
          BUILT DIFFERENT
        </h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className={`bg-black border-[3px] border-${feature.color} p-8 relative hover:scale-[1.02] transition-transform duration-200 group shadow-brutal`}
              >
                {/* Corner Number */}
                <div className={`absolute top-4 right-4 text-${feature.color} font-mono text-sm opacity-50`}>
                  {feature.number}
                </div>
                
                {/* Icon */}
                <div className="mb-4">
                  <Icon className={`w-16 h-16 text-${feature.color}`} strokeWidth={1.5} />
                </div>
                
                {/* Title */}
                <h3 className="text-white font-heading text-3xl mb-3 flex items-center gap-3">
                  {feature.title}
                  {feature.premium && (
                    <span className="text-xs bg-intensity-red text-white px-2 py-1 font-body">
                      PREMIUM
                    </span>
                  )}
                </h3>
                
                {/* Description */}
                <p className="text-white/80 font-body text-base leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Diagonal Accent Line */}
                <div 
                  className={`absolute bottom-0 right-0 w-16 h-16 bg-${feature.color} opacity-10`}
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                />
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-white/60 font-body text-sm mt-12 max-w-2xl mx-auto">
          All features designed for athletes who take their stats seriously (but not too seriously)
        </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
