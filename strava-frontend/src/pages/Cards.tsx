import { useState } from "react";
import { Download, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";

type TimePeriod = "week" | "month" | "3months" | "alltime";
type CardStyle = "holographic" | "dark" | "retro" | "minimalist";

const Cards = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [cardStyle, setCardStyle] = useState<CardStyle>("holographic");
  const [specialMove, setSpecialMove] = useState("Consistency Champion");
  const [includePhoto, setIncludePhoto] = useState(true);
  const [showLocation, setShowLocation] = useState(false);
  const [accentColor, setAccentColor] = useState("#CCFF00");

  // Placeholder data
  const statsData = {
    name: "ALEX RUNNER",
    totalDistance: 247.3,
    totalTime: 24.5,
    activities: 18,
    avgPace: "5:23",
    longestRun: 21.5,
    rarity: "RARE" as const,
    cardNumber: "001",
    month: "NOV 2024",
  };

  const suggestions = [
    "Lightning fast runner ⚡",
    "Marathon in training 🏃",
    "Consistency champion 👑",
    "Weekend warrior 💪",
    "Speed demon unlocked 🔥",
  ];

  const handleDownload = () => {
    // TODO: Implement download using html2canvas
    console.log("Downloading card...");
  };

  const handleShare = () => {
    // TODO: Implement copy to clipboard
    console.log("Copying to clipboard...");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black border-b border-white z-50 h-[60px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-white font-display text-xl font-bold">STRAVALYTICS</h1>
            <div className="hidden md:flex gap-6">
              <a href="/dashboard" className="text-white uppercase text-sm font-bold hover:text-[#CCFF00] transition-colors">
                Dashboard
              </a>
              <a href="/cards" className="text-[#CCFF00] uppercase text-sm font-bold border-b-2 border-[#CCFF00]">
                Cards
              </a>
              <a href="#" className="text-white uppercase text-sm font-bold hover:text-[#CCFF00] transition-colors">
                Roast
              </a>
              <a href="#" className="text-white uppercase text-sm font-bold hover:text-[#CCFF00] transition-colors">
                Settings
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white text-sm font-bold">ALEX</span>
            <Button variant="destructive" size="sm">Logout</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-[60px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-gradient-shift">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-4 uppercase tracking-tight">
            YOUR STATS, CARDIFIED
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold">
            Turn your runs into collectible cards worth flexing ✨
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT SIDE: Card Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <h2 className="text-white font-display text-2xl font-bold mb-6 uppercase">Card Preview</h2>
              <StatsCard
                style={cardStyle}
                data={statsData}
                specialMove={specialMove}
                includePhoto={includePhoto}
                accentColor={accentColor}
              />
            </div>
          </div>

          {/* RIGHT SIDE: Customization Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Time Period */}
            <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-white font-display text-xl font-bold mb-4 uppercase flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Select Time Period
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "3months", label: "Last 3 Months" },
                  { value: "alltime", label: "All Time" },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setTimePeriod(period.value as TimePeriod)}
                    className={`p-4 border-3 border-white font-bold uppercase text-sm transition-all ${
                      timePeriod === period.value
                        ? "bg-[#CCFF00] text-black"
                        : "bg-black text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style Selector */}
            <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-white font-display text-xl font-bold mb-4 uppercase">Card Style</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "holographic", label: "Holographic", color: "from-purple-500 to-pink-500" },
                  { value: "dark", label: "Dark Mode", color: "from-black to-gray-900" },
                  { value: "retro", label: "Retro", color: "from-amber-600 to-orange-800" },
                  { value: "minimalist", label: "Minimalist", color: "from-white to-gray-100" },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setCardStyle(style.value as CardStyle)}
                    className={`p-6 border-3 transition-all ${
                      cardStyle === style.value
                        ? "border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.5)]"
                        : "border-white hover:border-[#FF0066]"
                    }`}
                  >
                    <div className={`h-24 bg-gradient-to-br ${style.color} mb-3 border-2 border-black`}></div>
                    <p className="text-white font-bold uppercase text-sm">{style.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Customize Message */}
            <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-white font-display text-xl font-bold mb-4 uppercase">Special Move</h3>
              <input
                type="text"
                value={specialMove}
                onChange={(e) => setSpecialMove(e.target.value)}
                className="w-full bg-white border-3 border-black p-3 font-mono text-black font-bold mb-4 focus:outline-none focus:ring-4 focus:ring-[#CCFF00]"
                placeholder="Lightning fast runner"
              />
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setSpecialMove(suggestion)}
                    className="px-3 py-2 bg-[#FF0066] text-white text-xs font-bold uppercase border-2 border-white hover:bg-white hover:text-black transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-black border-4 border-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-white font-display text-xl font-bold mb-4 uppercase">Card Details</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white font-bold uppercase text-sm">Include Profile Photo</span>
                  <input
                    type="checkbox"
                    checked={includePhoto}
                    onChange={(e) => setIncludePhoto(e.target.checked)}
                    className="w-6 h-6 accent-[#CCFF00]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white font-bold uppercase text-sm">Show Location</span>
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="w-6 h-6 accent-[#CCFF00]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white font-bold uppercase text-sm">Accent Color</span>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-12 border-3 border-white cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleDownload}
                className="w-full h-16 bg-[#CCFF00] hover:bg-white text-black font-display text-xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Download className="w-6 h-6 mr-2" /> Download Card
              </Button>
              <Button
                onClick={handleShare}
                className="w-full h-16 bg-[#FF0066] hover:bg-[#00F0FF] text-white font-display text-xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Share2 className="w-6 h-6 mr-2" /> Share to Instagram
              </Button>
              <Button
                variant="outline"
                className="w-full h-16 bg-black hover:bg-white text-white hover:text-black font-bold uppercase border-4 border-white transition-all"
              >
                Generate New
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
