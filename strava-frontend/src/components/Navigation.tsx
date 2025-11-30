import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, CreditCard, Flame, User } from "lucide-react";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { useEffect, useState } from "react";

const Navigation = () => {
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
    <span className="text-white font-black tracking-wider text-lg uppercase flex items-center gap-[1px]">
      STR<span className="text-[#CCFF00]">▲</span>V<span className="text-[#CCFF00]">▲</span>WR<span className="text-[#CCFF00]">▲</span>PPED
    </span>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6 px-6 pointer-events-none">
      
      {/* Left: Logo (Absolute) */}
      <div className="absolute left-8 top-8 pointer-events-auto hidden md:flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <Logo />
      </div>

      {/* Center: Pill Navigation */}
      <div className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl shadow-purple-500/10 flex items-center gap-1">
        
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => navigate('/cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/cards') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Card</span>
        </button>

        <button 
          onClick={() => navigate('/roast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/roast') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Flame className="w-4 h-4" />
          <span>Roast</span>
        </button>

        {!userProfile && (
          <Button 
            onClick={initiateStravaLogin}
            className="ml-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-6 py-2 h-auto text-sm font-medium shadow-lg shadow-purple-500/25 border border-purple-400/20"
          >
            Connect Strava
          </Button>
        )}
      </div>

      {/* Right: User Profile (Absolute) */}
      <div className="absolute right-8 top-8 pointer-events-auto hidden md:flex items-center gap-4">
        {userProfile ? (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <img 
              src={userProfile.profile} 
              alt={userProfile.firstname} 
              className="w-8 h-8 rounded-full border-2 border-[#CCFF00]"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold leading-none">{userProfile.firstname} {userProfile.lastname}</span>
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Athlete</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-sm">Guest</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
