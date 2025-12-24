import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import MusicPlayer from "./MusicPlayer";

interface DashboardNavProps {
  currentPage: "dashboard" | "cards" | "roast";
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const DashboardNav = ({ currentPage, sidebarOpen, onToggleSidebar, showSidebarToggle = false }: DashboardNavProps) => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get username from localStorage or API
    const storedProfile = localStorage.getItem("strava_profile");
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setUserName(`${profile.firstname || ""} ${profile.lastname || ""}`.trim() || "User");
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("strava_token");
    localStorage.removeItem("strava_profile");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <button 
              onClick={onToggleSidebar}
              className="text-gray-700 hover:text-[#2F71FF] transition-colors"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
          <a href="/" className="bg-gradient-to-r from-[#2F71FF] to-[#FF006E] bg-clip-text text-transparent font-heading text-2xl tracking-wider font-bold">
            RUNWRAPPED
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="/dashboard" 
            className={`uppercase text-sm tracking-widest font-bold transition-colors duration-200 ${
              currentPage === "dashboard" ? "text-[#2F71FF]" : "text-gray-600 hover:text-[#2F71FF]"
            }`}
          >
            Dashboard
          </a>
          <a 
            href="/cards" 
            className={`uppercase text-sm tracking-widest font-bold transition-colors duration-200 ${
              currentPage === "cards" ? "text-[#2F71FF]" : "text-gray-600 hover:text-[#2F71FF]"
            }`}
          >
            Cards
          </a>
          <a 
            href="/roast" 
            className={`uppercase text-sm tracking-widest font-bold transition-colors duration-200 ${
              currentPage === "roast" ? "text-[#2F71FF]" : "text-gray-600 hover:text-[#2F71FF]"
            }`}
          >
            Roast
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <MusicPlayer />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2F71FF] to-[#FF006E] flex items-center justify-center text-white font-bold">
              {userName[0]}
            </div>
            <span className="text-black font-bold hidden md:block">{userName}</span>
          </div>
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 uppercase text-xs tracking-wider font-bold"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
