import { Link2, Zap, Download } from "lucide-react";

const Demo = () => {
  const steps = [
    {
      icon: Link2,
      title: "CONNECT STRAVA",
      description: "Click the button. We grab your stats faster than you grab water at an aid station. Secure, safe, and judgment-free (until the roast starts).",
      color: "bg-[#CCFF00]",
      textColor: "text-black",
      number: "01"
    },
    {
      icon: Zap,
      title: "WE ANALYZE YOUR RUN DATA",
      description: "We look at your pace, your distance, and that 3-week break you took in November. We find the story behind your sweat.",
      color: "bg-[#00F0FF]",
      textColor: "text-black",
      number: "02"
    },
    {
      icon: Download,
      title: "YOU GET WRAPPED + ROASTED",
      description: "Your year in review, served with a side of sass. One beautiful card to rule them all. Share it before you change your mind.",
      color: "bg-[#FF0066]",
      textColor: "text-white",
      number: "03"
    }
  ];
  
  return (
    <section id="demo" className="py-24 relative bg-black border-b-[5px] border-white/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-white font-bangers text-6xl md:text-8xl mb-4 uppercase tracking-wide drop-shadow-[4px_4px_0_#000]">
              HOW IT <span className="text-[#FF0066]">WORKS</span>
            </h2>
            <p className="text-gray-400 text-xl md:text-2xl font-fredoka font-bold uppercase tracking-wider">
              Takes less time than your warm-up.
            </p>
          </div>
          
          {/* Steps */}
          <div className="max-w-5xl mx-auto space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="bg-black border-[4px] border-white/20 p-8 md:p-10 relative hover:translate-x-2 transition-all duration-300 group shadow-[8px_8px_0px_0px_#ffffff33] hover:shadow-[12px_12px_0px_0px_#ffffff55] rounded-[24px]"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Number & Icon */}
                    <div className={`flex-shrink-0 relative w-24 h-24 flex items-center justify-center rounded-full border-[3px] border-black ${step.color} shadow-[4px_4px_0_#fff]`}>
                      <Icon className={`w-10 h-10 text-black`} strokeWidth={2.5} />
                      <div className="absolute -top-2 -right-2 bg-black text-white font-bangers text-xl px-3 py-1 rounded-full border-2 border-white transform rotate-12">
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-white font-bangers text-4xl mb-2 uppercase tracking-wide">
                        {step.title}
                      </h3>
                      <p className="text-white/80 font-fredoka text-xl leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-center text-gray-500 font-bangers text-xl mt-16 uppercase tracking-widest">
            Takes less time than your warm-up.
          </p>
      </div>
    </section>
  );
};

export default Demo;
