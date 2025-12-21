import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t-[5px] border-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-white font-bangers text-5xl md:text-6xl mb-3 uppercase tracking-wide flex items-center justify-center gap-1 drop-shadow-[4px_4px_0_#000]">
            STR<span className="text-[#CCFF00]">▲</span>V<span className="text-[#CCFF00]">▲</span> RO<span className="text-[#CCFF00]">▲</span>ST
          </h3>
          <p className="text-gray-400 font-fredoka font-bold text-lg uppercase tracking-wider">
            Making you regret your run since 2024
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-lg">
          <a href="#features" className="text-white hover:text-[#CCFF00] transition-colors font-bangers uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
            Features
          </a>
          <a href="#pricing" className="text-white hover:text-[#CCFF00] transition-colors font-bangers uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
            Pricing
          </a>
          <a href="#" className="text-white hover:text-[#CCFF00] transition-colors font-bangers uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
            Privacy
          </a>
          <a href="#" className="text-white hover:text-[#CCFF00] transition-colors font-bangers uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
            Terms
          </a>
          <a href="#" className="text-white hover:text-[#CCFF00] transition-colors font-bangers uppercase tracking-wide hover:underline decoration-2 underline-offset-4">
            Contact
          </a>
        </div>
        
        <div className="flex justify-center gap-6 mb-12">
          <a 
            href="#" 
            className="w-12 h-12 bg-black border-[3px] border-white hover:bg-[#CCFF00] hover:border-black flex items-center justify-center transition-all duration-300 group shadow-[4px_4px_0_#fff] hover:shadow-[4px_4px_0_#000] hover:-translate-y-1"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
          </a>
          <a 
            href="#" 
            className="w-12 h-12 bg-black border-[3px] border-white hover:bg-[#FF0066] hover:border-black flex items-center justify-center transition-all duration-300 group shadow-[4px_4px_0_#fff] hover:shadow-[4px_4px_0_#000] hover:-translate-y-1"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
          </a>
          <a 
            href="#" 
            className="w-12 h-12 bg-black border-[3px] border-white hover:bg-[#00F0FF] hover:border-black flex items-center justify-center transition-all duration-300 group shadow-[4px_4px_0_#fff] hover:shadow-[4px_4px_0_#000] hover:-translate-y-1"
            aria-label="Github"
          >
            <Github className="w-6 h-6 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
          </a>
        </div>
        
        <div className="text-center border-t-[3px] border-white/20 pt-8">
          <p className="text-gray-500 font-fredoka font-bold text-sm uppercase tracking-wider">
            © {new Date().getFullYear()} Strava Roast. Not affiliated with Strava (obviously).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
