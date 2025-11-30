import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { Footprints, Map, Flame, Trophy, Timer, Activity, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
      
      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
      
      {/* Decorative Ring (mimicking the inspiration) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[700px] h-[150px] md:h-[350px] border-[20px] border-white/5 rounded-[100%] rotate-[-15deg] blur-sm pointer-events-none animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[720px] h-[170px] md:h-[370px] border-[1px] border-white/10 rounded-[100%] rotate-[-15deg] pointer-events-none animate-float"></div>

      {/* Floating Elements - Left Side */}
      <div className="absolute top-1/4 left-[5%] md:left-[10%] hidden lg:block animate-float-delayed">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 group">
          <Footprints className="w-12 h-12 text-[#CCFF00] group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="absolute bottom-1/3 left-[8%] md:left-[15%] hidden lg:block animate-float">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
          <Map className="w-10 h-10 text-[#00F0FF] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Floating Elements - Right Side */}
      <div className="absolute top-1/3 right-[5%] md:right-[10%] hidden lg:block animate-float">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500 group">
          <Trophy className="w-12 h-12 text-[#FF0066] group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="absolute bottom-1/4 right-[8%] md:right-[15%] hidden lg:block animate-float-delayed">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 group">
          <Flame className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up backdrop-blur-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
          </span>
          <span className="text-gray-300 text-xs md:text-sm font-medium tracking-wider uppercase">The #1 Storyteller for Runners</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase mb-8 relative z-20">
          <span className="block text-white drop-shadow-2xl">UNWRAP</span>
          <span className="block bg-gradient-to-r from-[#CCFF00] via-[#00F0FF] to-[#FF0066] bg-clip-text text-transparent animate-gradient-x drop-shadow-2xl">
            YOUR RUN
          </span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Turn your sweat into a story. Visualize your year in running with our AI-powered dashboard.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-20">
          <Button 
            size="lg"
            className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-black uppercase tracking-wider px-10 py-8 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(204,255,0,0.5)] hover:shadow-[0_0_60px_-15px_rgba(204,255,0,0.6)] transition-all duration-300 hover:scale-105"
            onClick={initiateStravaLogin}
          >
            Connect Strava
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-transparent hover:bg-white/10 text-white font-bold uppercase tracking-wider px-10 py-8 text-lg rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
          >
            View Demo
          </Button>
        </div>

        {/* Stats Strip */}
        <div className="mt-24 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-[#CCFF00]" />
                <span className="text-white font-bold tracking-wider">10K+ RUNS</span>
            </div>
            <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#00F0FF]" />
                <span className="text-white font-bold tracking-wider">AI POWERED</span>
            </div>
            <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 text-[#FF0066]" />
                <span className="text-white font-bold tracking-wider">INSTANT RECAP</span>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
