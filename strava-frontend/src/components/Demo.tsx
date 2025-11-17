import { Link2, Zap, Download } from "lucide-react";

const Demo = () => {
  const steps = [
    {
      icon: Link2,
      title: "CONNECT STRAVA",
      description: "One click. That's it. We securely connect to your Strava account using official OAuth. Your data stays yours.",
      color: "#CCFF00",
      number: "01"
    },
    {
      icon: Zap,
      title: "AI ANALYZES",
      description: "Our AI instantly processes your running history. Stats, patterns, insights - everything analyzed in seconds. No waiting around.",
      color: "#00F0FF",
      number: "02"
    },
    {
      icon: Download,
      title: "SHARE & FLEX",
      description: "Get your personalized story mode, generate cards, or get roasted. Download, share, repeat. Make your followers jealous.",
      color: "#FF0066",
      number: "03"
    }
  ];
  
  return (
    <section id="demo" className="py-24 relative bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/10 to-blue-900/10 animate-gradient-shift"></div>
      
      <div className="container mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-white font-display text-6xl md:text-8xl font-black mb-4 uppercase tracking-tight">
              HOW IT WORKS
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider">
              Three simple steps to unleash your stats
            </p>
          </div>
          
          {/* Steps */}
          <div className="max-w-5xl mx-auto space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="bg-black border-4 border-white p-8 md:p-12 relative hover:translate-x-2 transition-all duration-300 group shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[12px_12px_0px_0px_rgba(204,255,0,0.3)]"
                >
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Number & Icon */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="text-8xl md:text-9xl font-black text-gray-800 absolute -top-4 -left-2">
                          {step.number}
                        </div>
                        <Icon className="w-24 h-24 relative z-10" style={{ color: step.color }} strokeWidth={2} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-white font-display text-3xl md:text-4xl font-black mb-4 uppercase" style={{ color: step.color }}>
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-center text-gray-500 font-bold text-sm mt-16 uppercase tracking-wider">
            From zero to hero in under 60 seconds
          </p>
      </div>
    </section>
  );
};

export default Demo;
