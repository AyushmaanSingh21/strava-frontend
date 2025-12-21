import { Sparkles, CreditCard, Flame } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "STORY MODE",
      description: "Your running journey told in 7 acts. Inspired by Spotify Wrapped. Discover your runner persona, territory, signature moves, and get personalized predictions.",
      icon: Sparkles,
      borderColor: "border-[#8338ec]", // Purple
      iconColor: "text-[#8338ec]",
      number: "01"
    },
    {
      title: "GENERATE YOUR CARD",
      description: "Create stunning Spotify Wrapped-style cards with your stats. Colorful, bold, and perfect for sharing. Download and flex on social media.",
      icon: CreditCard,
      borderColor: "border-[#3a86ff]", // Blue
      iconColor: "text-[#3a86ff]",
      number: "02"
    },
    {
      title: "GET ROASTED 🔥",
      description: "AI analyzes your training patterns and serves brutally honest feedback. Funny, constructive, and savage. A feature that'll make you laugh and motivate you to improve.",
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
            THREE POWERFUL <span className="text-[#CCFF00]">FEATURES</span>
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
                className={`bg-black ${feature.borderColor} border-[4px] p-8 relative hover:scale-105 transition-all duration-300 group shadow-[8px_8px_0px_0px_#ffffff33] hover:shadow-[12px_12px_0px_0px_#ffffff55] rounded-[32px] flex flex-col`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}>
                </div>
                
                {/* Corner Number */}
                <div className="absolute top-6 right-6 text-white/20 font-bangers text-4xl">
                  {feature.number}
                </div>
                
                {/* Icon */}
                <div className={`mb-6 relative z-10 bg-black w-16 h-16 rounded-2xl flex items-center justify-center border-[3px] ${feature.borderColor} shadow-[4px_4px_0_rgba(255,255,255,0.2)] transform -rotate-3 group-hover:rotate-3 transition-transform`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={2.5} />
                </div>
                
                {/* Title */}
                <h3 className="text-white font-bangers text-3xl mb-4 uppercase relative z-10 tracking-wide">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/80 font-fredoka text-lg leading-relaxed relative z-10 font-medium">
                  {feature.description}
                </p>
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
