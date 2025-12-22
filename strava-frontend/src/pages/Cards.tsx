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
import { assignAnimal } from "../utils/animalPersonality";

const Cards = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<{
    name: string;
    username: string;
    profilePhoto?: string;
    originalProfilePhoto?: string;
    totalDistance: number;
    totalRuns: number;
    totalTime: number;
    totalMinutes: number;
    avgPace: string;
    topGenre: string;
    calories: number;
    fastestPace: string;
    longestRun: number;
    animal: any;
  } | null>(null);
  
  // State to manage which image source to display
  const [displayImage, setDisplayImage] = useState<string | undefined>(undefined);

  // Helper function to get proxied image URL
  const getProxiedImageUrl = (url: string): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/api/proxy/image?url=${encodeURIComponent(url)}`;
  };

  // Effect to attempt upgrading to proxy image for better download quality
  useEffect(() => {
    if (!cardData?.originalProfilePhoto) return;

    const originalUrl = cardData.originalProfilePhoto;
    const proxyUrl = getProxiedImageUrl(originalUrl);

    // Initially set to original to ensure immediate display
    setDisplayImage(originalUrl);

    // Try to load the proxy version in the background
    const img = new Image();
    img.src = proxyUrl;
    img.onload = () => {
      // If proxy loads successfully, switch to it (enables CORS-free download)
      setDisplayImage(proxyUrl);
    };
    img.onerror = () => {
      // If proxy fails (backend down), we just stay with the original
      // This prevents the broken image UI, though console might still show a network error
      console.warn("Backend proxy unreachable, using original profile image");
    };
  }, [cardData?.originalProfilePhoto]);

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

        // Calculate total minutes directly
        const totalTimeSeconds = activities.reduce((acc: number, curr: any) => acc + (curr.moving_time || 0), 0);
        const totalMinutes = Math.round(totalTimeSeconds / 60);

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

        // Calculate Animal Personality
        let animal = null;
        if (activities.length > 0) {
            const dates = activities.map((a: any) => new Date(a.start_date));
            const minDate = new Date(Math.min(...dates.map((d: any) => d.getTime())));
            const maxDate = new Date(Math.max(...dates.map((d: any) => d.getTime())));
            const diffTime = Math.abs(maxDate.getTime() - minDate.getTime());
            const diffWeeks = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)));
            const weeklyDist = totalDistance / diffWeeks;
            animal = assignAnimal(avgPaceNum || 10, weeklyDist);
        }

        // Get proxied profile photo URL
        // Prefer high-res profile image, fallback to medium
        const photoUrl = profile.profile || profile.profile_medium;
        // We don't set the proxy URL immediately anymore, we let the effect handle the upgrade
        
        const stats = {
          name: `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() || "Runner",
          username: profile.username || profile.firstname || "athlete",
          profilePhoto: photoUrl, // Default to original
          originalProfilePhoto: photoUrl,
          totalDistance: Math.round(totalDistance),
          totalRuns: activities.length,
          totalTime: Math.round(totalTime),
          totalMinutes,
          avgPace: avgPaceNum ? formatPace(avgPaceNum) : "-",
          topGenre,
          calories: Math.round(totalCalories),
          fastestPace: fastestPaceVal ? formatPace(fastestPaceVal) : "-",
          longestRun: parseFloat(longestRunDist.toFixed(1)),
          animal
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
        <div className="text-center">
          <div className="text-6xl animate-spin mb-6">🃏</div>
          <p className="text-white font-bangers text-3xl tracking-widest animate-pulse">DEALING YOUR STATS...</p>
        </div>
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
      <div className="pt-20 pb-16 px-4 relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        
        {/* Header - Simplified & Centered */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-white font-bangers text-5xl md:text-7xl mb-4 uppercase tracking-wide leading-none">
            YOUR <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent">WRAPPED</span> CARD
          </h1>
          <p className="text-gray-400 text-lg font-fredoka">
            Ready to share your 2025 story?
          </p>
        </div>

        {/* Card Container */}
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            
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
                    RUNWR<span className="text-[#CCFF00] drop-shadow-[2px_2px_0_#000]">▲</span>PPED.ME
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 flex-1 flex flex-col items-center text-center mt-1">
                
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-[5px] border-black overflow-hidden bg-white relative z-10">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={cardData.name} 
                        className="w-full h-full object-cover" 
                        crossOrigin={displayImage.includes('/api/proxy') ? "anonymous" : undefined}
                      />
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
                <div className="flex flex-col items-center mb-6">
                  <p className="font-bangers text-[#CCFF00] text-xl tracking-widest drop-shadow-[2px_2px_0_#000] transform -rotate-2">
                    YOU THE BESH! 💅
                  </p>
                </div>

                {/* Row 1: Runs & Distance */}
                <div className="grid grid-cols-2 gap-3 w-full mb-3">
                  {/* Total Runs */}
                  <div className="bg-[#8338ec] rounded-[16px] p-3 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
                    <span className="text-xl mb-1">👟</span>
                    <span className="text-white font-bangers text-3xl leading-none">
                      {cardData.totalRuns}
                    </span>
                    <span className="text-white/80 font-fredoka text-[10px] uppercase font-bold">Total Runs</span>
                  </div>

                  {/* Total Distance */}
                  <div className="bg-black rounded-[16px] p-3 border-[3px] border-white/20 shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CCFF00] via-[#00F0FF] to-[#CCFF00]"></div>
                    <span className="text-xl mb-1">📏</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-white font-bangers text-3xl leading-none">
                        {Math.round(cardData.totalDistance).toLocaleString()}
                        </span>
                        <span className="text-[#CCFF00] font-bangers text-sm">KM</span>
                    </div>
                    <span className="text-white/60 font-fredoka text-[10px] uppercase font-bold">Distance</span>
                  </div>
                </div>

                {/* Row 2: Calories, Mins, Regrets */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  {/* Calories */}
                  <div className="bg-[#ffbe0b] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
                    <span className="text-lg mb-1">🔥</span>
                    <span className="text-black font-bangers text-xl leading-none">
                      {(cardData.calories / 1000).toFixed(1)}k
                    </span>
                    <span className="text-black/80 font-fredoka text-[8px] uppercase font-bold">Cals</span>
                  </div>

                  {/* Total Minutes */}
                  <div className="bg-[#ff006e] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform delay-75">
                    <span className="text-lg mb-1">⏱️</span>
                    <span className="text-white font-bangers text-xl leading-none">
                      {cardData.totalMinutes.toLocaleString()}
                    </span>
                    <span className="text-white/80 font-fredoka text-[8px] uppercase font-bold">Mins</span>
                  </div>

                  {/* 0 Regrets */}
                  <div className="bg-[#3a86ff] rounded-[16px] p-2 border-[3px] border-black shadow-[3px_3px_0_#000] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform delay-150">
                    <span className="text-lg mb-1">😎</span>
                    <span className="text-white font-bangers text-xl leading-none">
                      0
                    </span>
                    <span className="text-white/80 font-fredoka text-[8px] uppercase font-bold">Regrets</span>
                  </div>
                </div>

                {/* Running Soul - Footer */}
                {cardData.animal && (
                  <div className="mt-4 w-full bg-white/10 rounded-2xl p-3 flex items-center gap-4 border border-white/20 backdrop-blur-sm">
                    <div className={`w-14 h-14 rounded-full ${cardData.animal.color} flex items-center justify-center shrink-0 border-[3px] border-white shadow-md overflow-hidden relative`}>
                       <div className={`absolute inset-0 ${cardData.animal.color} opacity-50`}></div>
                       <img 
                          src={cardData.animal.image} 
                          alt={cardData.animal.animal}
                          className="w-full h-full object-contain relative z-10 p-1.5"
                          crossOrigin="anonymous"
                        />
                    </div>
                    <div className="text-left leading-none">
                      <p className="text-[10px] text-white/60 font-fredoka uppercase tracking-wider mb-1">Running Soul</p>
                      <p className="text-white font-bangers text-2xl tracking-wide">{cardData.animal.name}</p>
                    </div>
                  </div>
                )}

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

            {/* Navigation Links - Minimal */}
            <div className="flex gap-6 pt-4">
              <a href="/dashboard" className="text-white/60 hover:text-white font-bangers tracking-widest transition-colors">
                ← BACK TO DASHBOARD
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
