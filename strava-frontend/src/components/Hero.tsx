import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import heroImage from "@/assets/hero-runner.webp";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-shift"></div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Content */}
          <div className="relative z-10 text-white space-y-8">
            {/* Main Heading */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight font-black tracking-tight uppercase">
              RUN<br />
              <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent drop-shadow-2xl">SMARTER</span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-xl font-body leading-relaxed">
              Transform your Strava data into powerful visual content that inspires
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#CCFF00] hover:bg-[#CCFF00]/90 text-black font-bold uppercase tracking-wide px-8 py-6 text-base sm:text-lg shadow-lg transition-all duration-200 hover:scale-105 border-4 border-black"
                onClick={initiateStravaLogin}
              >
                CONNECT WITH STRAVA
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-6 text-base sm:text-lg border-4 border-white shadow-lg transition-all duration-200 hover:scale-105"
              >
                SEE UPCOMING FEATURES
              </Button>
            </div>
            
            {/* Statistic Display */}
            <div className="text-white text-sm font-body tracking-wide pt-4">
              <span className="font-black text-3xl md:text-4xl text-[#CCFF00]">10,000+</span> <span className="uppercase font-bold">RUNS ANALYZED THIS MONTH</span>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative lg:block">
            <div className="relative h-[500px] lg:h-[700px] flex items-end justify-end">
              <img 
                src={heroImage} 
                alt="Runner in motion" 
                className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
