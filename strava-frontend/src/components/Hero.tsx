import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import heroImage from "@/assets/hero-runner-final.jpg";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Runner in motion" 
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(3px) brightness(0.6)',
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease-out'
          }}
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading - Large and Bold */}
          <h1 className="text-white font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6 font-bold tracking-tight drop-shadow-2xl">
            RUN<br />
            <span className="text-strava-orange">SMARTER</span>
          </h1>
          
          {/* Sub-headline */}
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl font-body leading-relaxed drop-shadow-lg">
            TRANSFORM YOUR STRAVA DATA INTO POWERFUL VISUAL CONTENT THAT INSPIRES
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg"
              className="bg-white hover:bg-gray-100 text-black font-bold uppercase tracking-wide px-8 py-6 text-base sm:text-lg border-2 border-black rounded-sm shadow-lg transition-all duration-200 hover:scale-105"
              onClick={initiateStravaLogin}
            >
              CONNECT WITH STRAVA
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-white/10 text-white font-bold uppercase tracking-wide px-8 py-6 text-base sm:text-lg border-2 border-white rounded-sm shadow-lg transition-all duration-200 hover:scale-105"
            >
              SEE UPCOMING FEATURES
            </Button>
          </div>
          
          {/* Statistic Display */}
          <div className="text-white text-xs sm:text-sm md:text-base font-body tracking-wide opacity-90">
            <span className="font-bold text-xl sm:text-2xl md:text-3xl">10,000+</span> RUNS ANALYZED THIS MONTH
          </div>
        </div>
      </div>
      
      {/* Carousel Indicator Arrow (Right Side) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <button 
          className="text-white hover:text-strava-orange transition-colors duration-200 p-2"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
