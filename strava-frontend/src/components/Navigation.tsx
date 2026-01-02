import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, CreditCard, Flame, User } from "lucide-react";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";

interface NavigationProps {
  autoPlayMusic?: boolean;
}

const Navigation = ({ autoPlayMusic = false }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem("strava_profile");
    if (profile) {
      try {
        setUserProfile(JSON.parse(profile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const Logo = () => (
    <div className="flex flex-col items-center">
      <span className="text-white font-bangers tracking-wider text-2xl uppercase flex items-center gap-[1px] drop-shadow-[2px_2px_0_#000]">
        RUNWR<span className="text-[#CCFF00]">▲</span>PPED
      </span>
      <svg width="100" height="12" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="-mt-1">
        <path d="M5 8H42C42 8 45 3 50 3C55 3 58 8 58 8H95" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 3C47 3 45 5 45 7C45 9 48 9 50 8" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 3C53 3 55 5 55 7C55 9 52 9 50 8" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6 px-6 pointer-events-none">
      
      {/* Left: Logo (Absolute) */}
      <div className="absolute left-8 top-8 pointer-events-auto hidden md:flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/')}>
        <Logo />
      </div>

      {/* Center: Pill Navigation */}
      <div className="pointer-events-auto bg-black border-[3px] border-white rounded-full p-2 shadow-[4px_4px_0_#000] flex items-center gap-2">
        
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-bangers uppercase tracking-wide transition-all border-2 ${isActive('/') ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0_#000]' : 'bg-transparent text-white border-transparent hover:bg-white/10'}`}
        >
          <Home className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Home</span>
        </button>

        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-bangers uppercase tracking-wide transition-all border-2 ${isActive('/dashboard') ? 'bg-[#00F0FF] text-black border-black shadow-[2px_2px_0_#000]' : 'bg-transparent text-white border-transparent hover:bg-white/10'}`}
        >
          <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Wrap</span>
        </button>

        <button 
          onClick={() => navigate('/cards')}
          className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-bangers uppercase tracking-wide transition-all border-2 ${isActive('/cards') ? 'bg-[#FF0066] text-white border-black shadow-[2px_2px_0_#000]' : 'bg-transparent text-white border-transparent hover:bg-white/10'}`}
        >
          <CreditCard className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Cards</span>
        </button>

        <button 
          onClick={() => navigate('/roast')}
          className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-bangers uppercase tracking-wide transition-all border-2 ${isActive('/roast') ? 'bg-white text-black border-black shadow-[2px_2px_0_#000]' : 'bg-transparent text-white border-transparent hover:bg-white/10'}`}
        >
          <Flame className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Roast</span>
        </button>

        <button 
          onClick={() => navigate('/about')}
          className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-sm font-bangers uppercase tracking-wide transition-all border-2 ${isActive('/about') ? 'bg-[#CCFF00] text-black border-black shadow-[2px_2px_0_#000]' : 'bg-transparent text-white border-transparent hover:bg-white/10'}`}
        >
          <User className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">About</span>
        </button>

        {!userProfile && (
          <Button 
            onClick={initiateStravaLogin}
            className="ml-2 bg-[#FC4C02] hover:bg-[#E34402] text-white font-bangers uppercase tracking-wider border-[3px] border-black shadow-[4px_4px_0_#000] hover:translate-y-1 hover:shadow-none transition-all rounded-full px-4 sm:px-6 py-2 h-auto text-sm"
          >
            <span className="hidden sm:inline">Connect Strava</span>
            <span className="sm:hidden">Connect</span>
          </Button>
        )}
      </div>

      {/* Right: User Profile (Absolute) */}
      <div className="absolute right-4 md:right-8 top-8 pointer-events-auto flex items-center gap-2 md:gap-4">
        <MusicPlayer autoPlay={autoPlayMusic} />
        <div className="hidden md:block">
          {userProfile ? (
            <div className="flex items-center gap-3 bg-black border-[3px] border-white px-4 py-2 rounded-full shadow-[4px_4px_0_#000]">
              <img 
                src={userProfile.profile} 
                alt={userProfile.firstname} 
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="flex flex-col">
                <span className="text-white font-bangers uppercase tracking-wide leading-none">{userProfile.firstname} {userProfile.lastname}</span>
                <span className="text-[#CCFF00] text-[10px] font-fredoka font-bold uppercase tracking-wider">Athlete</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 font-bangers uppercase tracking-wide">
              <User className="w-5 h-5" />
              <span className="text-sm">Guest</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
