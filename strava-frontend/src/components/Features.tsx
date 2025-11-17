import { Sparkles, CreditCard, Flame } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "STORY MODE",
      description: "Your running journey told in 7 acts. Inspired by Spotify Wrapped. Discover your runner persona, territory, signature moves, and get personalized predictions.",
      icon: Sparkles,
      color: "#CCFF00",
      gradient: "from-purple-600 to-pink-600",
      number: "01"
    },
    {
      title: "GENERATE YOUR CARD",
      description: "Create stunning Spotify Wrapped-style cards with your stats. Colorful, bold, and perfect for sharing. Download and flex on social media.",
      icon: CreditCard,
      color: "#00F0FF",
      gradient: "from-cyan-500 to-blue-600",
      number: "02"
    },
    {
      title: "GET ROASTED 🔥",
      description: "AI analyzes your training patterns and serves brutally honest feedback. Funny, constructive, and savage. Premium feature that'll make you laugh and motivate you to improve.",
      icon: Flame,
      color: "#FF0066",
      gradient: "from-pink-600 to-red-600",
      number: "03",
      premium: true
    }
  ];
  
  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white font-display text-6xl md:text-8xl font-black mb-4 uppercase tracking-tight">
            THREE POWERFUL FEATURES
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider">
            Everything you need to level up your running game
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-black border-4 border-white p-8 relative hover:scale-105 transition-all duration-300 group shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(204,255,0,0.3)]"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Corner Number */}
                <div className="absolute top-4 right-4 text-gray-600 font-mono text-xl font-bold">
                  {feature.number}
                </div>
                
                {/* Icon */}
                <div className="mb-6 relative z-10">
                  <Icon className="w-16 h-16" style={{ color: feature.color }} strokeWidth={2} />
                </div>
                
                {/* Title */}
                <h3 className="text-white font-display text-2xl font-black mb-4 flex items-center gap-3 uppercase relative z-10">
                  {feature.title}
                  {feature.premium && (
                    <span className="text-xs bg-[#FF0066] text-white px-3 py-1 font-bold uppercase border-2 border-white">
                      PREMIUM
                    </span>
                  )}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 font-body text-base leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-gray-500 font-bold text-sm mt-16 max-w-2xl mx-auto uppercase tracking-wider">
          Built for athletes who want more than just numbers
        </p>
      </div>
    </section>
  );
};

export default Features;
