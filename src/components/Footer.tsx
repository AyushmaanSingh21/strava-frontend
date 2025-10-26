import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-lime py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-white font-heading text-3xl mb-2">STRAVAWRAPPED</h3>
          <p className="text-white/60 font-body text-sm">Stats that perform</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <a href="#features" className="text-white hover:text-lime transition-colors font-body uppercase tracking-wide">
            Features
          </a>
          <a href="#pricing" className="text-white hover:text-lime transition-colors font-body uppercase tracking-wide">
            Pricing
          </a>
          <a href="#" className="text-white hover:text-lime transition-colors font-body uppercase tracking-wide">
            Privacy
          </a>
          <a href="#" className="text-white hover:text-lime transition-colors font-body uppercase tracking-wide">
            Terms
          </a>
          <a href="#" className="text-white hover:text-lime transition-colors font-body uppercase tracking-wide">
            Contact
          </a>
        </div>
        
        <div className="flex justify-center gap-6 mb-8">
          <a 
            href="#" 
            className="w-10 h-10 border-2 border-white hover:border-lime hover:bg-lime flex items-center justify-center transition-all duration-200 group"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 text-white group-hover:text-black" />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 border-2 border-white hover:border-lime hover:bg-lime flex items-center justify-center transition-all duration-200 group"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-white group-hover:text-black" />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 border-2 border-white hover:border-lime hover:bg-lime flex items-center justify-center transition-all duration-200 group"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-white group-hover:text-black" />
          </a>
        </div>
        
        <div className="text-center text-white/60 font-body text-xs space-y-2">
          <p>
            © 2024 StravaWrapped. Built for athletes who deserve better analytics.
          </p>
          <p className="text-white/40 text-[10px]">
            Not affiliated with Strava, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
