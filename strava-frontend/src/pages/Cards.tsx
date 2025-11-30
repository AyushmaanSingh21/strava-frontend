import { useEffect, useState, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import { getAthleteProfile, getActivities } from "../services/stravaAPI";
import { 
  calculateTotalDistance, 
  calculateTotalTime, 
  getAveragePace,
  findPersonalRecords 
} from "../utils/dataProcessor";

const Cards = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<{
    name: string;
    profilePhoto?: string;
    totalDistance: number;
    totalRuns: number;
    totalTime: number;
    avgPace: string;
    topGenre: string;
  } | null>(null);

  // Helper function to get proxied image URL
  const getProxiedImageUrl = (url: string): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/api/proxy/image?url=${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await getAthleteProfile();
        const activities = await getActivities(1, 200);
        if (!profile || !activities) throw new Error("Failed to fetch data");

        const totalDistance = calculateTotalDistance(activities);
        const totalTime = calculateTotalTime(activities);
        const avgPaceNum = getAveragePace(activities);

        // Determine top genre based on time of day
        const morningRuns = activities.filter((a: any) => {
          const hour = new Date(a.start_date_local).getHours();
          return hour >= 5 && hour < 11;
        }).length;
        const eveningRuns = activities.filter((a: any) => {
          const hour = new Date(a.start_date_local).getHours();
          return hour >= 17 && hour < 22;
        }).length;
        
        let topGenre = "Consistent Runner";
        if (morningRuns > eveningRuns && morningRuns > activities.length * 0.4) topGenre = "Morning Runner";
        else if (eveningRuns > activities.length * 0.4) topGenre = "Evening Warrior";

        // Get proxied profile photo URL
        const photoUrl = profile.profile_medium || profile.profile;
        const profilePhotoUrl = photoUrl ? getProxiedImageUrl(photoUrl) : undefined;

        const stats = {
          name: `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || "Runner",
          profilePhoto: profilePhotoUrl,
          totalDistance: Math.round(totalDistance),
          totalRuns: activities.length,
          totalTime: Math.round(totalTime),
          avgPace: avgPaceNum ? formatPace(avgPaceNum) : "-",
          topGenre,
        };

        setCardData(stats);
      } catch (e: any) {
        setError(e?.message || "Could not load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  function formatPace(paceMinPerKm: number) {
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  const handleDownload = async () => {
    if (!cardRef.current || !cardData) return;
    try {
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2, 
        backgroundColor: '#000000',
        logging: false,
        useCORS: true 
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `strava-wrapped-${(cardData.name || "runner").replace(/\s/g, "-")}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) {
      console.error("Failed to download card", e);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        logging: false,
        useCORS: true
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "strava-wrapped.png", { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My Strava Wrapped",
            text: "Check out my running stats!"
          });
        } else {
          // Fallback to download
          handleDownload();
        }
      }, "image/png");
    } catch (e) {
      console.error("Failed to share", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading your wrapped...</div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-2xl font-bold">{error || "Failed to load data"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background - base layer */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
      
      {/* Navbar */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-20 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          
          {/* LEFT COLUMN: Content & Instructions */}
          <div className="flex-1 flex flex-col items-start text-left space-y-8 order-2 lg:order-1 max-w-2xl">
            
            {/* Header */}
            <div>
              <h1 className="text-white font-display text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-none">
                YOUR <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent">WRAPPED</span> CARD
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-4">
                Spotify Wrapped Style • Powered by Your Strava Data
              </p>
              <p className="text-gray-500 text-base leading-relaxed max-w-xl">
                Share your running story with the world. This card captures your unique runner persona, total stats, and top achievements in a format ready for Instagram Stories or Twitter.
              </p>
            </div>

            {/* Pro Tips (Info Section) */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-2xl rounded-3xl w-full">
              <h2 className="text-white font-display text-xl font-black mb-4 uppercase flex items-center gap-2">
                <span className="text-[#CCFF00]">💡</span> PRO TIPS
              </h2>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold">→</span>
                  <span><strong className="text-white">Download</strong> to save high-res PNG</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold">→</span>
                  <span><strong className="text-white">Share</strong> directly to social apps</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#CCFF00] font-bold">→</span>
                  <span><strong className="text-white">Runner Type</strong> based on activity time</span>
                </li>
              </ul>
            </div>

            {/* Navigation Links (CTA) */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="/dashboard" 
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wide px-8 py-4 border border-white/20 backdrop-blur-sm transition-all rounded-full text-sm"
              >
                VIEW FULL STORY
              </a>
              <a 
                href="/roast" 
                className="inline-flex items-center justify-center bg-[#FF0066]/10 hover:bg-[#FF0066]/20 text-[#FF0066] font-bold uppercase tracking-wide px-8 py-4 border border-[#FF0066]/50 backdrop-blur-sm transition-all rounded-full text-sm"
              >
                GET ROASTED 🔥
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Card & Actions */}
          <div className="flex-1 flex flex-col items-center gap-8 order-1 lg:order-2 w-full max-w-sm lg:max-w-[320px]">
            
            {/* The Card */}
            <div ref={cardRef} className="relative w-full aspect-[9/16] bg-black rounded-[32px] overflow-hidden shadow-2xl group hover:scale-[1.02] transition-transform duration-500">
              {/* Background - Neon Abstract */}
              <div className="absolute inset-0 bg-black">
                {/* Pink/Red Gradient Mesh */}
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] bg-gradient-to-br from-[#FF0066] via-[#FF0000] to-transparent opacity-80 blur-3xl transform rotate-12" />
                <div className="absolute top-[10%] right-[-20%] w-[100%] h-[60%] bg-gradient-to-bl from-[#FF0066] via-[#FF4D00] to-transparent opacity-60 blur-3xl" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col p-8">
                
                {/* Top Section: Profile Pic */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-48 h-48 shadow-2xl transform -rotate-2">
                    {cardData.profilePhoto ? (
                      <img src={cardData.profilePhoto} alt={cardData.name} className="w-full h-full object-cover shadow-lg" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-4xl font-bold text-white">
                        {cardData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Stats */}
                <div className="mt-auto space-y-8">
                  
                  {/* Two Columns */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Runner Type</h3>
                      <p className="text-lg font-bold leading-tight text-white">{cardData.topGenre}</p>
                      <p className="text-sm text-white/50">{cardData.totalRuns} total runs</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Avg Pace</h3>
                      <p className="text-lg font-bold leading-tight text-white">{cardData.avgPace} /km</p>
                      <p className="text-sm text-white/50">{Math.floor(cardData.totalTime / 60)}h {cardData.totalTime % 60}m time</p>
                    </div>
                  </div>

                  {/* Big Number */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Total Distance</h3>
                    <div className="text-6xl font-black tracking-tighter leading-none text-white">
                      {Math.round(cardData.totalDistance).toLocaleString()}
                      <span className="text-2xl ml-2 font-bold text-[#FF0066]">km</span>
                    </div>
                  </div>

                  {/* Branding Footer */}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Strava Wrapped</span>
                    <span className="text-[10px] font-bold text-[#FF0066]">2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-[#CCFF00] hover:bg-[#b3e600] text-black font-black uppercase tracking-wide py-6 rounded-full shadow-lg hover:shadow-[#CCFF00]/20 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Download className="w-5 h-5" /> DOWNLOAD
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-[#FF0066] hover:bg-[#e6005c] text-white font-black uppercase tracking-wide py-6 rounded-full shadow-lg hover:shadow-[#FF0066]/20 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Share2 className="w-5 h-5" /> SHARE
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
