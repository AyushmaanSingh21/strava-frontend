import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { Footprints, Map, Flame, Trophy, Activity, Zap, Timer } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-40 pb-20 border-b-[5px] border-white/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>
      
      {/* Floating Elements - Left Side */}
      <div className="absolute top-1/4 left-[5%] md:left-[10%] hidden lg:block animate-float-delayed">
        <div className="bg-black border-[3px] border-[#CCFF00] p-4 rounded-2xl shadow-[4px_4px_0_#CCFF00] transform -rotate-12 hover:rotate-0 transition-transform duration-500 group">
          <Footprints className="w-12 h-12 text-[#CCFF00] group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="absolute bottom-1/3 left-[8%] md:left-[15%] hidden lg:block animate-float">
        <div className="bg-black border-[3px] border-[#00F0FF] p-4 rounded-2xl shadow-[4px_4px_0_#00F0FF] transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
          <Map className="w-10 h-10 text-[#00F0FF] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Floating Elements - Right Side */}
      <div className="absolute top-1/3 right-[5%] md:right-[10%] hidden lg:block animate-float">
        <div className="bg-black border-[3px] border-[#FF0066] p-4 rounded-2xl shadow-[4px_4px_0_#FF0066] transform rotate-12 hover:rotate-0 transition-transform duration-500 group">
          <Trophy className="w-12 h-12 text-[#FF0066] group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="absolute bottom-1/4 right-[8%] md:right-[15%] hidden lg:block animate-float-delayed">
        <div className="bg-black border-[3px] border-orange-500 p-4 rounded-2xl shadow-[4px_4px_0_orange] transform -rotate-6 hover:rotate-0 transition-transform duration-500 group">
          <Flame className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-12 animate-fade-in-up backdrop-blur-md mt-12 transform -rotate-2 hover:rotate-0 transition-transform">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
          </span>
          <span className="text-[#CCFF00] text-sm font-bangers tracking-widest uppercase">The #1 Storyteller for Runners</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-bangers text-6xl sm:text-8xl md:text-9xl tracking-wide uppercase mb-8 relative z-20">
          <span className="block text-white drop-shadow-[4px_4px_0_#000]">UNWRAP</span>
          <span className="block text-[#00F0FF] drop-shadow-[4px_4px_0_#000] transform -rotate-1">
            YOUR RUN
          </span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-fredoka font-medium leading-relaxed">
          Connect Strava. Get your run wrap, shareable cards, and a friendly roast — in seconds.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20">
          <Button 
            size="lg"
            className="bg-[#CCFF00] hover:bg-[#b3e600] text-black font-bangers uppercase tracking-widest px-10 py-8 text-2xl rounded-full shadow-[4px_4px_0_#fff] hover:shadow-[6px_6px_0_#fff] hover:-translate-y-1 transition-all duration-300 border-2 border-black"
            onClick={initiateStravaLogin}
          >
            Connect Strava
          </Button>
          <Button 
            size="lg"
            className="bg-[#CCFF00] text-black font-bangers text-2xl px-10 py-8 rounded-xl hover:bg-[#b3e600] hover:scale-105 transition-all border-2 border-black shadow-[4px_4px_0_#fff] uppercase tracking-widest"
          >
            Join Our Club
          </Button>
        </div>

        {/* Stats Strip */}
        <div className="mt-32 flex flex-wrap justify-center gap-12 md:gap-24 opacity-80 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-4 group cursor-default">
                <Activity className="w-6 h-6 text-[#CCFF00] group-hover:scale-110 transition-transform" />
                <span className="text-white font-bangers tracking-widest text-lg md:text-xl">10K+ RUNS</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
                <Zap className="w-6 h-6 text-[#00F0FF] group-hover:scale-110 transition-transform" />
                <span className="text-white font-bangers tracking-widest text-lg md:text-xl">AI POWERED</span>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
                <Timer className="w-6 h-6 text-[#FF0066] group-hover:scale-110 transition-transform" />
                <span className="text-white font-bangers tracking-widest text-lg md:text-xl">INSTANT RECAP</span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
