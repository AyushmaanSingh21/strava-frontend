import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-runner.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Athletic runner in action" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      </div>
      
      {/* Diagonal Stripes Accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
        <div className="w-full h-full" style={{
          background: `repeating-linear-gradient(
            45deg,
            hsl(var(--lime)),
            hsl(var(--lime)) 2px,
            transparent 2px,
            transparent 10px
          ), repeating-linear-gradient(
            45deg,
            hsl(var(--hot-pink)),
            hsl(var(--hot-pink)) 2px,
            transparent 2px,
            transparent 10px
          )`
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl">
          {/* Floating Stats */}
          <div className="absolute -top-20 right-0 hidden lg:flex flex-col gap-4 font-mono text-white">
            <div className="border-2 border-white px-4 py-2 bg-black/80">
              <div className="text-xs opacity-70">DISTANCE</div>
              <div className="text-2xl font-bold">5K</div>
            </div>
            <div className="border-2 border-lime px-4 py-2 bg-black/80">
              <div className="text-xs opacity-70">PACE</div>
              <div className="text-2xl font-bold text-lime">10:23</div>
            </div>
            <div className="border-2 border-hot-pink px-4 py-2 bg-black/80">
              <div className="text-xs opacity-70">FASTER</div>
              <div className="text-2xl font-bold text-hot-pink">↑ 2.4%</div>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-white font-heading text-7xl md:text-9xl leading-none mb-6 -rotate-2 transform" 
              style={{ 
                textShadow: '4px 4px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
                WebkitTextStroke: '2px black'
              }}>
            STRAVA STATS<br />
            THAT ACTUALLY<br />
            <span className="text-lime">SLAP</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-white text-xl md:text-2xl mb-10 max-w-2xl font-body">
            Turn your runs into content that hits harder than your PR
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-strava-orange hover:bg-black hover:text-white hover:border-lime text-black font-bold uppercase tracking-wide px-8 py-6 text-lg border-2 border-transparent transition-all duration-200"
            >
              CONNECT WITH STRAVA
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-lime hover:text-black text-white font-bold uppercase tracking-wide px-8 py-6 text-lg border-2 border-white transition-all duration-200"
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
