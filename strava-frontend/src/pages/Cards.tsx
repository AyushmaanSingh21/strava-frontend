import { useEffect, useState, useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import DashboardNav from "@/components/DashboardNav";
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20 animate-gradient-shift"></div>
      
      {/* Navbar */}
      <DashboardNav currentPage="cards" />

      {/* Main Content */}
      <div className="pt-20 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-white font-display text-5xl md:text-7xl font-black mb-4 uppercase tracking-tight">
              YOUR <span className="bg-gradient-to-r from-[#CCFF00] to-[#00F0FF] bg-clip-text text-transparent">WRAPPED</span> CARD
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-2">
              Spotify Wrapped Style • Powered by Your Strava Data
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              Share your running story with the world. Download or share directly to social media.
            </p>
          </div>

          {/* Card Container */}
          <div className="flex flex-col items-center gap-8">
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
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-[#CCFF00] hover:bg-white text-black font-bold uppercase tracking-wide px-8 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> DOWNLOAD
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-[#FF0066] hover:bg-[#00F0FF] text-white font-bold uppercase tracking-wide px-8 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" /> SHARE
              </Button>
            </div>

            {/* Info Section */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-black border-4 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
                <h2 className="text-white font-display text-2xl font-black mb-4 uppercase text-center">
                  💡 PRO TIPS
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#CCFF00] font-bold">→</span>
                    <span><strong className="text-white">Download</strong> the card to save it locally or share on any platform</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#CCFF00] font-bold">→</span>
                    <span><strong className="text-white">Share</strong> directly to Instagram, Twitter, or WhatsApp with one tap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#CCFF00] font-bold">→</span>
                    <span><strong className="text-white">Runner Type</strong> is determined by your most active time of day</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#CCFF00] font-bold">→</span>
                    <span><strong className="text-white">Stats Update</strong> automatically each time you visit this page</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-bold">
                Want more insights?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/dashboard" 
                  className="inline-block bg-transparent hover:bg-white/10 text-white font-bold uppercase tracking-wide px-6 py-3 border-4 border-white transition-all"
                >
                  VIEW FULL STORY MODE
                </a>
                <a 
                  href="/roast" 
                  className="inline-block bg-transparent hover:bg-[#FF0066]/10 text-[#FF0066] font-bold uppercase tracking-wide px-6 py-3 border-4 border-[#FF0066] transition-all"
                >
                  GET ROASTED 🔥
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
