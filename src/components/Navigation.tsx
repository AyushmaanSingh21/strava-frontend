import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white h-16">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="text-white font-heading text-2xl tracking-wider">
          STRAVAWRAPPED
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#features" 
            className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200"
          >
            Pricing
          </a>
          <a 
            href="#demo" 
            className="text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200"
          >
            Demo
          </a>
        </div>
        
        <Button 
          variant="default"
          className="bg-strava-orange hover:bg-white hover:text-black text-black font-bold uppercase tracking-wide px-6 rounded-full transition-all duration-200 hover:scale-105"
        >
          Connect Strava
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
