import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import RoastCard from "@/components/RoastCard";
import ChatInterface from "@/components/ChatInterface";
import { Check, Flame, Sparkles, Download, Share2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRoast, chatWithAI } from "../services/roastAPI";
import { getStoredToken } from "../services/stravaAuth";

type PageState = "pricing" | "analyzing" | "roast" | "chat" | "summary";

const Roast = () => {
  const [pageState, setPageState] = useState<PageState>("pricing");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [roastText, setRoastText] = useState<string>("");
  const [analysisStats, setAnalysisStats] = useState<any>(null);
  const [rawStats, setRawStats] = useState<any>(null);
  const [athlete, setAthlete] = useState<any>(null);
  const { toast } = useToast();

  const loadingMessages = [
    "Analyzing 247.3 km of data...",
    "Calculating pace inconsistencies...",
    "Detecting lazy Sundays...",
    "Finding excuses in your calendar...",
    "Preparing roast... 🔥",
  ];

  // Check for stored roast on mount
  useEffect(() => {
    const storedRoast = localStorage.getItem("strava_roast_data");
    if (storedRoast) {
      try {
        const parsed = JSON.parse(storedRoast);
        if (parsed.roastText && parsed.athlete) {
          setRoastText(parsed.roastText);
          setRawStats(parsed.rawStats);
          setAnalysisStats(parsed.analysisStats);
          setAthlete(parsed.athlete);
          setPageState("roast");
        }
      } catch (e) {
        console.error("Failed to parse stored roast", e);
        localStorage.removeItem("strava_roast_data");
      }
    }
  }, []);

  useEffect(() => {
    if (pageState !== "analyzing") return;
    let messageIndex = 0;
    let progressValue = 0;

    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setLoadingMessage(loadingMessages[messageIndex]);
        messageIndex++;
      }
    }, 1200);

    const progressInterval = setInterval(() => {
      progressValue += 2;
      setProgress(progressValue);
    }, 100);

    // Kick off backend roast generation
    (async () => {
      try {
        const token = getStoredToken();
        console.log("Token:", token);
        if (!token?.access_token) {
          console.error("No access token found");
          throw new Error("Please login with Strava first");
        }
        console.log("Calling generateRoast API...");
        const result = await generateRoast(token.access_token);
        console.log("Roast result:", result);
        
        const roastContent = result.roast || "No roast generated";
        const statsData = result.stats || null;
        
        // Build simple stats list for display
        const s = result.stats || {};
        const statsList = [
          s.longestRun ? { label: "Longest run", value: `${s.longestRun} km` } : null,
          s.shortestRun ? { label: "Shortest run", value: `${s.shortestRun} km` } : null,
          s.avgPace ? { label: "Avg pace", value: `${s.avgPace} /km` } : null,
          s.totalDistance ? { label: "Total distance", value: `${s.totalDistance} km` } : null,
          s.consistencyScore ? { label: "Consistency score", value: `${s.consistencyScore}/10` } : null,
        ].filter(Boolean) as Array<{ label: string; value: string; comment?: string }>;

        setRoastText(roastContent);
        setRawStats(statsData);
        setAthlete(result.athlete);
        setAnalysisStats(statsList);
        
        // Save to localStorage
        localStorage.setItem("strava_roast_data", JSON.stringify({
          roastText: roastContent,
          rawStats: statsData,
          analysisStats: statsList,
          athlete: result.athlete
        }));
        
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        setTimeout(() => setPageState("roast"), 300);
      } catch (e: any) {
        console.error("Roast generation error:", e);
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        toast({ title: "Roast failed", description: e?.response?.data?.error || e?.message || "Try again later", variant: "destructive" });
        setPageState("pricing");
      }
    })();

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [pageState, toast]);

  const handleStartRoast = () => {
    setPageState("analyzing");
  };

  const handleDownload = () => {
    toast({
      title: "Downloading...",
      description: "Your roast report is being prepared",
    });
  };

  const handleShare = () => {
    toast({
      title: "Copied!",
      description: "Roast card copied to clipboard 📸",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-lime-500/30">
      <Navigation />
      
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[80vh]">
          {/* Left Column: Content */}
          <div className="space-y-8 animate-fade-in-up sticky top-24">
            <div className="space-y-4">
              <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                GET <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">ROASTED</span> 🔥
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed">
                AI will analyze your runs and serve the truth. Can you handle it?
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg font-fredoka">Full AI roast of your training data</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg font-fredoka">Personalized insights & analysis</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg font-fredoka">Brutally honest feedback</span>
              </div>

              {/* Generate Button Moved Here */}
              <div className="pt-8">
                <Button
                  onClick={handleStartRoast}
                  className="w-full md:w-auto px-12 bg-[#ccff00] text-black hover:bg-[#b3e600] font-bangers tracking-widest text-2xl py-8 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] transition-all duration-300 transform hover:scale-105"
                >
                  GENERATE ROAST 🔥
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content */}
          <div className="flex justify-center lg:justify-end w-full animate-fade-in-up delay-200">
            {pageState === "pricing" && (
              <Card className="w-full max-w-[500px] bg-black border-4 border-[#ccff00] p-8 relative overflow-hidden rounded-[40px] shadow-[0_0_40px_rgba(204,255,0,0.2)] group">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00] rounded-full blur-[100px] opacity-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8338ec] rounded-full blur-[100px] opacity-10 animate-pulse delay-700"></div>
                
                <div className="text-center space-y-8 py-12 relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-32 h-32 bg-black border-4 border-[#ccff00] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.4)] animate-bounce-slow">
                    <span className="text-6xl">🔒</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bangers text-white tracking-wide">
                      YOUR ROAST AWAITS
                    </h3>
                    <p className="text-white/60 text-xl font-fredoka max-w-xs mx-auto">
                      Click the button on the left to unlock your personalized RunWrapped roast.
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#ccff00] animate-ping"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ff006e] animate-ping delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-[#8338ec] animate-ping delay-200"></div>
                  </div>
                </div>
              </Card>
            )}

            {pageState === "analyzing" && (
              <Card className="w-full max-w-[500px] bg-white/5 backdrop-blur-xl border-white/10 p-12 relative overflow-hidden rounded-[32px]">
                <div className="text-center space-y-8 py-8">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-ping" />
                    <div className="relative bg-black border-2 border-pink-500 rounded-full w-full h-full flex items-center justify-center">
                      <Flame className="w-10 h-10 text-pink-500 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white animate-pulse">
                      {loadingMessage}
                    </h3>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-white/40 text-sm font-mono">
                      {progress}% Complete
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {pageState === "roast" && (
              <div className="w-full max-w-[600px] animate-fade-in">
                <Card className="bg-black border-4 border-[#ccff00] p-8 relative overflow-hidden rounded-[40px] shadow-[0_0_50px_rgba(204,255,0,0.3)]">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ccff00] to-transparent opacity-20 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#8338ec] to-transparent opacity-20 blur-2xl"></div>
                  
                  {/* Content */}
                  <div className="mb-8 min-h-[300px] relative z-10">
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                      <Flame className="w-5 h-5 text-[#ff006e]" />
                      <span className="text-[#ff006e] font-bangers tracking-widest text-sm">AI ROAST GENERATED</span>
                    </div>
                    <p className="text-xl md:text-2xl leading-relaxed font-fredoka text-white/90 whitespace-pre-wrap drop-shadow-lg">
                      {roastText || "No roast generated. Please try again."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t-2 border-white/10 pt-6 relative z-10">
                    <div className="flex items-center gap-4">
                      {athlete?.photo && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#ccff00] rounded-full blur-md opacity-50"></div>
                          <img 
                            src={athlete.photo} 
                            alt={athlete.name} 
                            className="w-14 h-14 rounded-full border-2 border-[#ccff00] relative z-10"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-bangers text-xl tracking-wide leading-none mb-1">{athlete?.name || "Athlete"}</p>
                        {athlete?.location && (
                          <p className="text-[#ccff00] text-sm font-fredoka uppercase tracking-wider">{athlete.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-[10px] text-white/60 font-bold uppercase">Powered by</span>
                          <span className="text-[#FF5722] font-black text-sm tracking-tighter">STRAVA</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={handleDownload}
                    className="flex-1 bg-black border-2 border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wide py-6 px-6 rounded-2xl transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={handleShare}
                    className="flex-1 bg-black border-2 border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wide py-6 px-6 rounded-2xl transition-all"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {pageState === "chat" && (
        <div className="fixed inset-0 z-50 bg-black animate-in slide-in-from-bottom duration-300">
          <ChatInterface onEndSession={() => setPageState("summary")} userData={rawStats} />
        </div>
      )}

      {pageState === "summary" && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center px-6 animate-in fade-in duration-300">
          <Card className="bg-black border-4 border-lime-500 p-12 max-w-xl w-full text-center rounded-[32px] shadow-[0_0_50px_rgba(204,255,0,0.3)]">
            <div className="w-20 h-20 mx-auto bg-lime-500/10 rounded-full flex items-center justify-center mb-8">
              <Sparkles className="w-10 h-10 text-lime-500" />
            </div>
            <h2 className="font-heading text-4xl font-black mb-4 uppercase text-white">
              Session Complete
            </h2>
            <p className="text-lg mb-8 text-white/60">
              You exchanged 12 messages with your AI coach
            </p>
            <div className="space-y-4">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wide py-6 rounded-xl">
                Download Report
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wide py-6 rounded-xl"
                onClick={() => setPageState("pricing")}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Roast;
