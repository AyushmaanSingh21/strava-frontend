import { Twitter, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t-[5px] border-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center mb-3">
            <h3 className="text-white font-bangers text-5xl md:text-6xl uppercase tracking-wide flex items-center justify-center gap-1 drop-shadow-[4px_4px_0_#000]">
              RUNWR<span className="text-[#CCFF00]">▲</span>PPED
            </h3>
            <svg width="200" height="24" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-2 md:-mt-4">
              <path d="M5 8H42C42 8 45 3 50 3C55 3 58 8 58 8H95" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 3C47 3 45 5 45 7C45 9 48 9 50 8" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M50 3C53 3 55 5 55 7C55 9 52 9 50 8" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-gray-400 font-fredoka font-bold text-lg uppercase tracking-wider">
            You ran. We kept receipts.
          </p>
        </div>
        
        <div className="flex justify-center gap-6 mb-12">
          <a 
            href="https://x.com/AyuuSure" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black border-[3px] border-white hover:bg-[#CCFF00] hover:border-black flex items-center justify-center transition-all duration-300 group shadow-[4px_4px_0_#fff] hover:shadow-[4px_4px_0_#000] hover:-translate-y-1"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
          </a>
          <a 
            href="https://strava.app.link/LtgcoA7NiZb" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black border-[3px] border-white hover:bg-[#FC4C02] hover:border-black flex items-center justify-center transition-all duration-300 group shadow-[4px_4px_0_#fff] hover:shadow-[4px_4px_0_#000] hover:-translate-y-1"
            aria-label="Join Strava Club"
          >
            <Users className="w-6 h-6 text-white group-hover:text-black transition-colors" strokeWidth={2.5} />
          </a>
        </div>
        
        <div className="text-center border-t-[3px] border-white/20 pt-8">
          <p className="text-gray-500 font-fredoka font-bold text-sm uppercase tracking-wider">
            © {new Date().getFullYear()} RunWrapped.me. Not affiliated with Strava (obviously).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
