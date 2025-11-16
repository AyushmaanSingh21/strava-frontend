import { useEffect, useState, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50 h-[60px]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="/" className="text-white font-display text-xl font-bold bg-gradient-to-r from-[#2F71FF] to-[#FF006E] bg-clip-text text-transparent">
            STRAVAWRAPPED
          </a>
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-gray-400 uppercase text-sm font-bold hover:text-white transition-colors">Dashboard</a>
            <a href="/cards" className="text-white uppercase text-sm font-bold">Cards</a>
            <a href="/roast" className="text-gray-400 uppercase text-sm font-bold hover:text-white transition-colors">Roast</a>
          </div>
        </div>
      </nav>

      {/* Spotify Wrapped Style Card */}
      <div ref={cardRef} className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Layer - Decorative triangular rays extending outside */}
        <div className="absolute inset-0 z-0">
          {/* Left Triangle Rays */}
          <div className="absolute left-0 top-1/4 -translate-x-1/2">
            <div className="w-0 h-0 border-t-[60px] border-t-transparent border-r-[100px] border-r-yellow-500 border-b-[60px] border-b-transparent"></div>
          </div>
          <div className="absolute left-0 top-1/3 -translate-x-1/3">
            <div className="w-0 h-0 border-t-[50px] border-t-transparent border-r-[80px] border-r-orange-600 border-b-[50px] border-b-transparent"></div>
          </div>
          
          {/* Right Triangle Rays */}
          <div className="absolute right-0 top-1/4 translate-x-1/2">
            <div className="w-0 h-0 border-t-[60px] border-t-transparent border-l-[100px] border-l-yellow-500 border-b-[60px] border-b-transparent"></div>
          </div>
          <div className="absolute right-0 top-1/3 translate-x-1/3">
            <div className="w-0 h-0 border-t-[50px] border-t-transparent border-l-[80px] border-l-orange-600 border-b-[50px] border-b-transparent"></div>
          </div>

          {/* Bottom Left Triangle Rays */}
          <div className="absolute left-0 bottom-1/4 -translate-x-1/2">
            <div className="w-0 h-0 border-t-[60px] border-t-transparent border-r-[100px] border-r-yellow-500 border-b-[60px] border-b-transparent"></div>
          </div>
          <div className="absolute left-0 bottom-1/3 -translate-x-1/3">
            <div className="w-0 h-0 border-t-[50px] border-t-transparent border-r-[80px] border-r-orange-600 border-b-[50px] border-b-transparent"></div>
          </div>

          {/* Bottom Right Triangle Rays */}
          <div className="absolute right-0 bottom-1/4 translate-x-1/2">
            <div className="w-0 h-0 border-t-[60px] border-t-transparent border-l-[100px] border-l-yellow-500 border-b-[60px] border-b-transparent"></div>
          </div>
          <div className="absolute right-0 bottom-1/3 translate-x-1/3">
            <div className="w-0 h-0 border-t-[50px] border-t-transparent border-l-[80px] border-l-orange-600 border-b-[50px] border-b-transparent"></div>
          </div>

          {/* Purple side circles */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600 rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-purple-600 rounded-full"></div>
        </div>

        {/* Main Card Content */}
        <div className="absolute inset-0 m-6 bg-black rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
          {/* Top Section - Profile Photo and Name */}
          <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4">
            {/* Profile Photo */}
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gray-800 mb-6">
              {cardData.profilePhoto ? (
                <img src={cardData.profilePhoto} alt={cardData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-gray-700 to-gray-900">
                  {cardData.name.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Name and Category */}
            <h1 className="text-white font-display text-2xl font-bold">{cardData.name.toUpperCase()}</h1>
            <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider mt-2">{cardData.topGenre} Runner</p>
          </div>

          {/* Bottom Stats Section */}
          <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-black/50">
            <div className="grid grid-cols-2 gap-4">
              {/* Total Distance */}
              <div>
                <h3 className="text-yellow-400 font-bold mb-1 text-xs uppercase tracking-wider">Total Distance</h3>
                <div className="text-white font-bold text-xl">{cardData.totalDistance.toFixed(1)} km</div>
              </div>

              {/* Total Runs */}
              <div>
                <h3 className="text-yellow-400 font-bold mb-1 text-xs uppercase tracking-wider">Total Runs</h3>
                <div className="text-white font-bold text-xl">{cardData.totalRuns}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total Time */}
              <div>
                <h3 className="text-yellow-400 font-bold mb-1 text-xs uppercase tracking-wider">Total Time</h3>
                <div className="text-white font-bold text-lg">{Math.floor(cardData.totalTime / 60)}h {cardData.totalTime % 60}m</div>
              </div>

              {/* Avg Pace */}
              <div>
                <h3 className="text-yellow-400 font-bold mb-1 text-xs uppercase tracking-wider">Avg Pace</h3>
                <div className="text-white font-bold text-lg">{cardData.avgPace}/km</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button
          onClick={handleDownload}
          className="bg-white hover:bg-gray-100 text-black font-bold px-8 py-6 rounded-full flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> Download
        </Button>
        <Button
          onClick={handleShare}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-6 rounded-full flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" /> Share
        </Button>
      </div>
    </div>
  );
};

export default Cards;
