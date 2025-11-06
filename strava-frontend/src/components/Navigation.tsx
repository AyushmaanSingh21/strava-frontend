import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white h-16">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="text-white font-heading text-2xl tracking-wider">
          STRAVAWRAPPED
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className={`text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200 ${isActive("/dashboard") ? "font-semibold text-lime" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            to="/cards"
            className={`text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200 ${isActive("/cards") ? "font-semibold text-lime" : ""}`}
          >
            Cards
          </Link>
          <Link
            to="/roast"
            className={`text-white uppercase text-sm tracking-widest hover:text-lime transition-colors duration-200 ${isActive("/roast") ? "font-semibold text-lime" : ""}`}
          >
            Roast
          </Link>
        </div>
        
        <Button 
          variant="default"
          className="bg-strava-orange hover:bg-white hover:text-black text-black font-bold uppercase tracking-wide px-6 rounded-full transition-all duration-200 hover:scale-105"
          onClick={() => navigate('/dashboard')}
        >
          Connect Strava
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
