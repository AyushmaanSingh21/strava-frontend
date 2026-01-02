import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { Footprints, Map, Flame, Trophy, Activity, Zap, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const Hero = () => {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/users/count`);
        if (res.ok) {
          const data = await res.json();
          setUserCount(data.count);
        }
      } catch (e) {
        console.error("Failed to fetch user count", e);
      }
    };
    fetchCount();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-40 pb-20 border-b-[5px] border-white/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>
      
      {/* Floating Icons (Desktop) */}
      <div className="absolute top-[15%] left-[5%] hidden lg:block animate-float-delayed">
        <div className="bg-black p-4 rounded-2xl border-4 border-[#CCFF00] transform -rotate-12 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
          <Footprints className="w-12 h-12 text-[#CCFF00]" />
        </div>
      </div>

      <div className="absolute top-[40%] left-[8%] hidden lg:block animate-float">
        <div className="bg-black p-4 rounded-2xl border-4 border-[#00F0FF] transform rotate-6 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <Map className="w-12 h-12 text-[#00F0FF]" />
        </div>
      </div>

      <div className="absolute top-[15%] right-[5%] hidden lg:block animate-float">
        <div className="bg-black p-4 rounded-2xl border-4 border-[#FF0066] transform rotate-12 shadow-[0_0_20px_rgba(255,0,102,0.3)]">
          <Trophy className="w-12 h-12 text-[#FF0066]" />
        </div>
      </div>

      <div className="absolute top-[40%] right-[8%] hidden lg:block animate-float-delayed">
        <div className="bg-black p-4 rounded-2xl border-4 border-orange-500 transform -rotate-6 shadow-[0_0_20px_rgba(255,165,0,0.3)]">
          <Flame className="w-12 h-12 text-orange-500" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Badge */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 animate-fade-in-up backdrop-blur-md transform -rotate-2 hover:rotate-0 transition-transform">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
            </span>
            <span className="text-[#CCFF00] text-sm font-bangers tracking-widest uppercase">The #1 Storyteller for Runners</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 animate-fade-in-up delay-100 backdrop-blur-md">
            <span className="text-[#CCFF00] text-xs font-fredoka font-bold uppercase tracking-wider">
              Trusted by {userCount ? userCount + 100 : "100+"} Athletes
            </span>
          </div>
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

        {/* Social Proof Stickers */}
        <div className="mt-16 relative max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-12">
            
            {/* Reddit 1 */}
            <div className="transform -rotate-3 hover:scale-105 transition-transform duration-300 z-10">
                <img src="/reviews/reddit-1.png" className="w-48 md:w-56 rounded-md border-[3px] border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)]" alt="Reddit Review" />
            </div>

            {/* Twitter 1 */}
            <div className="transform rotate-2 hover:scale-105 transition-transform duration-300 z-10 mt-4 md:mt-8">
                <img src="/reviews/twitter-1.png" className="w-48 md:w-56 rounded-md border-[3px] border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)]" alt="Twitter Review" />
            </div>

            {/* Reddit 2 (Hidden on small mobile) */}
            <div className="transform -rotate-2 hover:scale-105 transition-transform duration-300 z-10 hidden sm:block">
                <img src="/reviews/reddit-2.png" className="w-48 md:w-56 rounded-md border-[3px] border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)]" alt="Reddit Review" />
            </div>

            {/* Twitter 2 (Hidden on small mobile) */}
            <div className="transform rotate-3 hover:scale-105 transition-transform duration-300 z-10 mt-4 md:mt-8 hidden sm:block">
                <img src="/reviews/twitter-2.png" className="w-48 md:w-56 rounded-md border-[3px] border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)]" alt="Twitter Review" />
            </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-24 opacity-80 hover:opacity-100 transition-opacity duration-500">
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
