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
    username: string;
    profilePhoto?: string;
    totalDistance: number;
    totalRuns: number;
    totalTime: number;
    avgPace: string;
    topGenre: string;
    calories: number;
    fastestPace: string;
    longestRun: number;
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

        // Calculate additional stats
        // Calories
        const totalCalories = activities.reduce((acc: number, curr: any) => {
            if (curr.calories) return acc + curr.calories;
            if (curr.kilojoules) return acc + (curr.kilojoules * 0.239);
            return acc + ((curr.distance || 0) / 1000 * 60);
        }, 0);

        // Fastest Run
        const fastestRunObj = [...activities]
            .filter((a: any) => a.type === "Run")
            .sort((a: any, b: any) => (b.average_speed || 0) - (a.average_speed || 0))[0];
        const fastestPaceVal = fastestRunObj ? (16.666666666667 / (fastestRunObj.average_speed || 1)) : 0;

        // Longest Run
        const longestRunObj = [...activities]
            .filter((a: any) => a.type === "Run")
            .sort((a: any, b: any) => (b.distance || 0) - (a.distance || 0))[0];
        const longestRunDist = longestRunObj ? (longestRunObj.distance / 1000) : 0;

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
          username: profile.username || profile.firstname || "athlete",
          profilePhoto: profilePhotoUrl,
          totalDistance: Math.round(totalDistance),
          totalRuns: activities.length,
          totalTime: Math.round(totalTime),
          avgPace: avgPaceNum ? formatPace(avgPaceNum) : "-",
          topGenre,
          calories: Math.round(totalCalories),
          fastestPace: fastestPaceVal ? formatPace(fastestPaceVal) : "-",
          longestRun: parseFloat(longestRunDist.toFixed(1))
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
              <h1 className="text-white font-bangers text-5xl md:text-7xl mb-6 uppercase tracking-wide leading-none">
                YOUR <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent">WRAPPED</span> CARD
              </h1>
              <p className="text-gray-400 text-lg md:text-xl font-fredoka font-bold uppercase tracking-wider mb-4">
                Spotify Wrapped Style • Powered by Your Strava Data
              </p>
              <p className="text-gray-500 text-base leading-relaxed max-w-xl font-fredoka">
                Share your running story with the world. This card captures your unique runner persona, total stats, and top achievements in a format ready for Instagram Stories or Twitter.
              </p>
            </div>

            {/* Pro Tips (Info Section) */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 shadow-2xl rounded-3xl w-full">
              <h2 className="text-white font-bangers text-2xl mb-4 uppercase flex items-center gap-2 tracking-wide">
                <span className="text-[#CCFF00]">💡</span> PRO TIPS
              </h2>
              <ul className="space-y-3 text-gray-300 text-sm font-fredoka">
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
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bangers tracking-widest px-8 py-4 border border-white/20 backdrop-blur-sm transition-all rounded-full text-lg"
              >
                VIEW FULL STORY
              </a>
              <a 
                href="/roast" 
                className="inline-flex items-center justify-center bg-[#FF0066]/10 hover:bg-[#FF0066]/20 text-[#FF0066] font-bangers tracking-widest px-8 py-4 border border-[#FF0066]/50 backdrop-blur-sm transition-all rounded-full text-lg"
              >
                GET ROASTED 🔥
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Card & Actions */}
          <div className="flex-1 flex flex-col items-center gap-8 order-1 lg:order-2 w-full max-w-sm lg:max-w-[320px]">
            
            {/* The Card */}
            <div ref={cardRef} className="relative w-full aspect-[9/16] bg-[#3a86ff] rounded-[32px] overflow-hidden border-[5px] border-black shadow-[15px_15px_0_#000000] flex flex-col p-5 group hover:scale-[1.02] transition-transform duration-300">
              
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}>
              </div>

              {/* Header */}
              <div className="relative z-10 flex justify-between items-start mb-2">
                <div className="bg-black text-[#CCFF00] px-3 py-1 rounded-full border-2 border-black transform -rotate-2 shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                  <span className="font-bangers tracking-wider text-lg">#2025</span>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-black font-black tracking-tighter text-xl uppercase flex items-center gap-[2px] italic">
                    STR<span className="text-[#CCFF00] drop-shadow-[2px_2px_0_#000]">▲</span>V<span className="text-[#CCFF00] drop-shadow-[2px_2px_0_#000]">▲</span>
                  </div>
                  <div className="text-black font-black tracking-tighter text-xl uppercase flex items-center gap-[2px] italic -mt-2">
                    WR<span className="text-[#CCFF00] drop-shadow-[2px_2px_0_#000]">▲</span>PPED
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 flex-1 flex flex-col items-center text-center mt-1">
                
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-[5px] border-black overflow-hidden bg-white relative z-10">
                    {cardData.profilePhoto ? (
                      <img src={cardData.profilePhoto} alt={cardData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black text-5xl font-bangers text-[#CCFF00]">
                        {cardData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Decorative Elements behind profile */}
                  <div className="absolute top-0 -right-4 text-4xl animate-bounce delay-700">✨</div>
                  <div className="absolute bottom-0 -left-4 text-4xl animate-bounce">⚡</div>
                </div>

                {/* Name & Title */}
                <h2 className="font-bangers text-3xl text-white drop-shadow-[3px_3px_0_#000] uppercase tracking-wide mb-1 transform -rotate-1">
                  @{cardData.username}
                </h2>
                <div className="bg-white border-2 border-black px-4 py-0.5 rounded-full inline-block transform rotate-1 mb-6 shadow-[3px_3px_0_#000]">
                  <p className="font-fredoka font-bold text-black uppercase tracking-wider text-xs">
                    {cardData.topGenre}
                  </p>
                </div>

                {/* Main Stat: Distance */}
                <div className="w-full bg-black rounded-[20px] p-4 border-[3px] border-white/20 relative overflow-hidden mb-4">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#CCFF00] via-[#00F0FF] to-[#CCFF00]"></div>
                  <p className="text-[#CCFF00] font-fredoka font-bold uppercase tracking-widest text-xs mb-1">Total Distance</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-white font-bangers text-6xl tracking-wide leading-none">
                      {Math.round(cardData.totalDistance).toLocaleString()}
                    </span>
                    <span className="text-white/50 font-bangers text-2xl">KM</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  {/* Calories */}
                  <div className="bg-[#8338ec] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
                    <span className="text-xl mb-1">🔥</span>
                    <span className="text-white font-bangers text-lg leading-none">
                      {(cardData.calories / 1000).toFixed(1)}k
                    </span>
                    <span className="text-white/80 font-fredoka text-[9px] uppercase font-bold">Cals</span>
                  </div>

                  {/* Fastest Run */}
                  <div className="bg-[#ff006e] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform delay-75">
                    <span className="text-xl mb-1">🚀</span>
                    <span className="text-white font-bangers text-lg leading-none">
                      {cardData.fastestPace}
                    </span>
                    <span className="text-white/80 font-fredoka text-[9px] uppercase font-bold">/km</span>
                  </div>

                  {/* Longest Run */}
                  <div className="bg-[#ffbe0b] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform delay-150">
                    <span className="text-xl mb-1">🏆</span>
                    <span className="text-black font-bangers text-lg leading-none">
                      {cardData.longestRun}
                    </span>
                    <span className="text-black/80 font-fredoka text-[9px] uppercase font-bold">km</span>
                  </div>
                </div>

              </div>

              {/* Footer Bar */}
              <div className="mt-4 border-t-4 border-black pt-2 flex justify-center">
                 <p className="font-fredoka font-bold text-black text-[10px] uppercase tracking-[0.3em]">
                   Your Year In Run
                 </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-[#CCFF00] hover:bg-[#b3e600] text-black font-bangers uppercase tracking-widest py-6 rounded-full shadow-lg hover:shadow-[#CCFF00]/20 transition-all flex items-center justify-center gap-2 text-xl"
              >
                <Download className="w-5 h-5" /> DOWNLOAD
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-[#FF0066] hover:bg-[#e6005c] text-white font-bangers uppercase tracking-widest py-6 rounded-full shadow-lg hover:shadow-[#FF0066]/20 transition-all flex items-center justify-center gap-2 text-xl"
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
