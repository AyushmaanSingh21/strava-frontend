import { Button } from "@/components/ui/button";
import { initiateStravaLogin } from "@/services/stravaAuth";
import heroImage from "@/assets/hero-runner.webp";

const Hero = () => {
  return (
    <section className="pt-24 pb-8 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#2F71FF' }}>
          <div className="p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 text-white space-y-8">
            {/* Main Heading */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight font-bold tracking-tight">
              RUN<br />
              <span className="text-white drop-shadow-lg">SMARTER</span>
            </h1>
            
            {/* Sub-headline */}
            <p className="text-white text-lg sm:text-xl md:text-2xl max-w-xl font-body leading-relaxed">
              Transform your Strava data into powerful visual content that inspires
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white hover:bg-gray-100 text-black font-bold uppercase tracking-wide px-8 py-6 text-base sm:text-lg rounded-sm shadow-lg transition-all duration-200 hover:scale-105"
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
            <div className="text-white text-sm font-body tracking-wide pt-4">
              <span className="font-bold text-2xl md:text-3xl">10,000+</span> RUNS ANALYZED THIS MONTH
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative lg:block">
            <div className="relative h-[500px] lg:h-[700px] flex items-end justify-end">
              <img 
                src={heroImage} 
                alt="Runner in motion" 
                className="h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
