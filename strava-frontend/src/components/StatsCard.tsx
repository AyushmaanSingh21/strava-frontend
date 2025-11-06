import { Star, Trophy } from "lucide-react";

type CardStyle = "holographic" | "dark" | "retro" | "minimalist";
type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

interface StatsCardProps {
  style: CardStyle;
  data: {
    name: string;
    totalDistance: number;
    totalTime: number;
    activities: number;
    avgPace: string;
    longestRun: number;
    rarity: Rarity;
    cardNumber: string;
    month: string;
  };
  specialMove: string;
  includePhoto: boolean;
  accentColor: string;
}

const rarityConfig = {
  COMMON: { color: "#9CA3AF", glow: false },
  UNCOMMON: { color: "#10B981", glow: false },
  RARE: { color: "#3B82F6", glow: true },
  EPIC: { color: "#A855F7", glow: true },
  LEGENDARY: { color: "#F59E0B", glow: true },
};

const StatsCard = ({ style, data, specialMove, includePhoto, accentColor }: StatsCardProps) => {
  const getBackgroundStyle = () => {
    switch (style) {
      case "holographic":
        return "bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-gradient-shift";
      case "dark":
        return "bg-gradient-to-br from-black to-gray-900";
      case "retro":
        return "bg-gradient-to-br from-amber-600 to-orange-800";
      case "minimalist":
        return "bg-white";
      default:
        return "bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500";
    }
  };

  const getTextColor = () => {
    return style === "minimalist" ? "text-black" : "text-white";
  };

  const getBorderStyle = () => {
    if (style === "retro") return "border-[12px] border-amber-900";
    if (style === "minimalist") return "border-[12px] border-black";
    return "border-[12px] border-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400";
  };

  const rarityData = rarityConfig[data.rarity];

  return (
    <div
      id="stats-card"
      className={`relative w-full max-w-md mx-auto aspect-[2/3] ${getBackgroundStyle()} ${getBorderStyle()} rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}
      style={{
        borderImage: style === "holographic" || style === "dark" 
          ? "linear-gradient(135deg, #FFD700, #FFF, #FFD700) 12" 
          : undefined,
      }}
    >
      {/* Holographic overlay effect */}
      {style === "holographic" && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-50 pointer-events-none"></div>
      )}

      <div className="relative h-full p-6 flex flex-col">
        {/* Profile Photo Section */}
        {includePhoto && (
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 bg-gray-800 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-white text-4xl font-bold">A</span>
            </div>
          </div>
        )}

        {/* Name Banner */}
        <div className={`${style === "minimalist" ? "bg-black" : "bg-white/90"} py-3 px-4 mb-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          <h2 className={`font-display text-2xl font-bold text-center uppercase tracking-wider ${style === "minimalist" ? "text-white" : "text-black"}`}>
            {data.name}
          </h2>
        </div>

        {/* Stats Section */}
        <div className="space-y-3 mb-6">
          <h3 className={`font-display text-lg font-bold uppercase mb-2 ${getTextColor()}`}>📊 STATS:</h3>
          
          {/* Distance */}
          <div>
            <div className="flex justify-between mb-1">
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>DISTANCE</span>
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>{data.totalDistance} KM</span>
            </div>
            <div className="h-3 bg-black/30 border-2 border-black">
              <div className="h-full bg-[#CCFF00]" style={{ width: "90%", backgroundColor: accentColor }}></div>
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="flex justify-between mb-1">
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>TIME</span>
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>{data.totalTime} HRS</span>
            </div>
            <div className="h-3 bg-black/30 border-2 border-black">
              <div className="h-full bg-[#FFD700]" style={{ width: "75%", backgroundColor: accentColor }}></div>
            </div>
          </div>

          {/* Activities */}
          <div>
            <div className="flex justify-between mb-1">
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>ACTIVITIES</span>
              <span className={`font-mono text-sm font-bold ${getTextColor()}`}>{data.activities} RUNS</span>
            </div>
            <div className="h-3 bg-black/30 border-2 border-black">
              <div className="h-full bg-[#FF0066]" style={{ width: "85%", backgroundColor: accentColor }}></div>
            </div>
          </div>
        </div>

        {/* Special Move Section */}
        <div className={`${style === "minimalist" ? "bg-gray-100" : "bg-black/40"} border-4 border-black p-4 mb-4 backdrop-blur-sm`}>
          <h3 className={`font-display text-sm font-bold uppercase mb-1 flex items-center gap-2 ${getTextColor()}`}>
            <Trophy className="w-4 h-4" /> SPECIAL MOVE:
          </h3>
          <p className={`font-mono text-sm font-bold ${getTextColor()}`}>{specialMove}</p>
          <p className={`font-mono text-xs mt-1 ${getTextColor()}`}>"{data.avgPace} /km pace"</p>
        </div>

        {/* Rarity Badge */}
        <div className="flex justify-center mb-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 border-3 border-black ${
              rarityData.glow ? "shadow-[0_0_20px_rgba(245,158,11,0.6)]" : ""
            }`}
            style={{ backgroundColor: rarityData.color }}
          >
            <Star className="w-5 h-5 fill-white text-white" />
            <span className="font-display text-sm font-bold text-white uppercase">{data.rarity}</span>
          </div>
        </div>

        {/* Card Number & Date */}
        <div className={`${style === "minimalist" ? "bg-black" : "bg-white/90"} py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto`}>
          <p className={`font-mono text-center font-bold text-sm ${style === "minimalist" ? "text-white" : "text-black"}`}>
            #{data.cardNumber} | {data.month}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
