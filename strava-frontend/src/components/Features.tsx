import { Sparkles, CreditCard, Flame, Check } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "RUN WRAPPED",
      shortCopy: "Your running year, boiled down to what matters.",
      items: ["Total distance", "Pace highlights", "Your running personality", "Year-in-review summary"],
      icon: Sparkles,
      borderColor: "border-[#8338ec]", // Purple
      iconColor: "text-[#8338ec]",
      number: "01"
    },
    {
      title: "WRAPPED CARD",
      shortCopy: "One card. All the flex.",
      items: ["One clean, shareable card", "Auto-generated", "Instagram/X ready"],
      icon: CreditCard,
      borderColor: "border-[#3a86ff]", // Blue
      iconColor: "text-[#3a86ff]",
      number: "02"
    },
    {
      title: "THE ROAST",
      shortCopy: "We roast your runs. Respectfully.",
      items: ["Playful, not toxic", "Based on your data only"],
      icon: Flame,
      borderColor: "border-[#ff006e]", // Pink
      iconColor: "text-[#ff006e]",
      number: "03"
    }
  ];
  
  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden border-b-[5px] border-white/20">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-bangers text-6xl md:text-8xl mb-4 uppercase tracking-wide drop-shadow-[4px_4px_0_#000]">
            WHAT <span className="text-[#CCFF00]">YOU GET</span>
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl font-fredoka font-bold uppercase tracking-wider">
            Everything you need to level up your running game
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className={`bg-black ${feature.borderColor} border-[4px] p-6 relative hover:scale-105 transition-all duration-300 group shadow-[8px_8px_0px_0px_#ffffff33] hover:shadow-[12px_12px_0px_0px_#ffffff55] rounded-[24px] flex flex-col max-w-sm mx-auto w-full`}
              >
                
                {/* Corner Number */}
                <div className="absolute top-4 right-4 text-white/20 font-bangers text-3xl">
                  {feature.number}
                </div>
                
                {/* Icon */}
                <div className={`mb-4 relative z-10 bg-black w-12 h-12 rounded-xl flex items-center justify-center border-[3px] ${feature.borderColor} shadow-[3px_3px_0_rgba(255,255,255,0.2)] transform -rotate-3 group-hover:rotate-3 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={2.5} />
                </div>
                
                {/* Title */}
                <h3 className="text-white font-bangers text-2xl mb-4 uppercase relative z-10 tracking-wide">
                  {feature.title}
                </h3>
                
                {/* Items List */}
                <ul className="space-y-2 mb-6 relative z-10 flex-1">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className={`mt-1 w-4 h-4 rounded-full border-2 ${feature.borderColor} flex items-center justify-center flex-shrink-0`}>
                        <Check className={`w-2.5 h-2.5 ${feature.iconColor}`} strokeWidth={4} />
                      </div>
                      <span className="text-white/90 font-fredoka text-base font-medium leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Short Copy */}
                <div className={`relative z-10 pt-4 border-t-2 ${feature.borderColor.replace('border-', 'border-opacity-30 ')}`}>
                  <p className="text-white font-bangers text-lg uppercase tracking-wide leading-tight">
                    "{feature.shortCopy}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-gray-500 font-bangers text-xl mt-16 max-w-2xl mx-auto uppercase tracking-widest">
          Built for athletes who want more than just numbers
        </p>
      </div>
    </section>
  );
};

export default Features;
