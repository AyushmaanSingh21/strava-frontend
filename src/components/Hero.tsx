import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-runner-clouds.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#4A7BA7] pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Athletic runner in colorful clouds" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A7BA7]/20 via-transparent to-[#4A7BA7]/40" />
      </div>
      
      {/* Cloud Accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
        <div className="w-full h-full" style={{
          background: `radial-gradient(circle at 30% 50%, #FF9999 0%, transparent 50%),
                       radial-gradient(circle at 70% 60%, #C4B454 0%, transparent 50%),
                       radial-gradient(circle at 50% 80%, #B89EC4 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl">
          {/* Floating Stats */}
          <div className="absolute -top-20 right-0 hidden lg:flex flex-col gap-4 font-mono text-white">
            <div className="border-3 border-black px-4 py-2 bg-[#FF9999] rounded-lg shadow-lg">
              <div className="text-xs opacity-70 text-black">DISTANCE</div>
              <div className="text-2xl font-bold text-black">5K</div>
            </div>
            <div className="border-3 border-black px-4 py-2 bg-[#C4B454] rounded-lg shadow-lg">
              <div className="text-xs opacity-70 text-black">PACE</div>
              <div className="text-2xl font-bold text-black">10:23</div>
            </div>
            <div className="border-3 border-black px-4 py-2 bg-[#B89EC4] rounded-lg shadow-lg">
              <div className="text-xs opacity-70 text-black">FASTER</div>
              <div className="text-2xl font-bold text-black">↑ 2.4%</div>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-white font-heading text-7xl md:text-9xl leading-none mb-6 transform" 
              style={{ 
                textShadow: '6px 6px 0 black, -3px -3px 0 black, 3px -3px 0 black, -3px 3px 0 black',
                WebkitTextStroke: '3px black',
                fontFamily: "'Fredoka One', 'Bebas Neue', cursive"
              }}>
            STRAVA STATS<br />
            THAT ACTUALLY<br />
            <span className="text-[#FF9999]">SLAP</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-white text-xl md:text-2xl mb-10 max-w-2xl font-body drop-shadow-lg">
            Turn your runs into content that hits harder than your PR
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-[#E67A3C] hover:bg-[#FF9999] hover:text-black text-white font-bold uppercase tracking-wide px-8 py-6 text-lg border-3 border-black rounded-xl shadow-lg transition-all duration-200"
            >
              CONNECT WITH STRAVA
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/90 hover:bg-[#C4B454] hover:text-black text-black font-bold uppercase tracking-wide px-8 py-6 text-lg border-3 border-black rounded-xl shadow-lg transition-all duration-200"
            >
              SEE IT IN ACTION →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
