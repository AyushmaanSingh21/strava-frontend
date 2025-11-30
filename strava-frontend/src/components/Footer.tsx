import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#CCFF00]/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-white font-display text-4xl font-black mb-3 uppercase tracking-tight flex items-center justify-center gap-1">
            STR<span className="text-[#CCFF00]">▲</span>V<span className="text-[#CCFF00]">▲</span>WR<span className="text-[#CCFF00]">▲</span>PPED
          </h3>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Your stats, elevated</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
          <a href="#features" className="text-gray-400 hover:text-[#CCFF00] transition-colors font-bold uppercase tracking-wide">
            Features
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-[#CCFF00] transition-colors font-bold uppercase tracking-wide">
            Pricing
          </a>
          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors font-bold uppercase tracking-wide">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors font-bold uppercase tracking-wide">
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-[#CCFF00] transition-colors font-bold uppercase tracking-wide">
            Contact
          </a>
        </div>
        
        <div className="flex justify-center gap-6 mb-12">
          <a 
            href="#" 
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00] hover:bg-[#CCFF00] flex items-center justify-center transition-all duration-300 group"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </a>
          <a 
            href="#" 
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00] hover:bg-[#CCFF00] flex items-center justify-center transition-all duration-300 group"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </a>
          <a 
            href="#" 
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00] hover:bg-[#CCFF00] flex items-center justify-center transition-all duration-300 group"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </a>
        </div>
        
        <div className="text-center text-gray-500 font-body text-xs space-y-2">
          <p className="font-bold uppercase tracking-wider">
            © 2024 StravaWrapped. Built for athletes who demand more.
          </p>
          <p className="text-gray-600 text-[10px]">
            Not affiliated with Strava, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
