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
  const { toast } = useToast();

  const loadingMessages = [
    "Analyzing 247.3 km of data...",
    "Calculating pace inconsistencies...",
    "Detecting lazy Sundays...",
    "Finding excuses in your calendar...",
    "Preparing roast... 🔥",
  ];

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
        
        setRoastText(roastContent);
        setRawStats(statsData);
        
        // Build simple stats list for display
        const s = result.stats || {};
        const statsList = [
          s.longestRun ? { label: "Longest run", value: `${s.longestRun} km` } : null,
          s.shortestRun ? { label: "Shortest run", value: `${s.shortestRun} km` } : null,
          s.avgPace ? { label: "Avg pace", value: `${s.avgPace} /km` } : null,
          s.totalDistance ? { label: "Total distance", value: `${s.totalDistance} km` } : null,
          s.consistencyScore ? { label: "Consistency score", value: `${s.consistencyScore}/10` } : null,
        ].filter(Boolean) as Array<{ label: string; value: string; comment?: string }>;
        setAnalysisStats(statsList);
        
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
                <span className="text-lg">Full AI roast of your training data</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg">10-minute chat session with AI coach</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg">Personalized insights & analysis</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 rounded-full bg-lime-500/10 text-lime-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg">Brutally honest feedback</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content */}
          <div className="flex justify-center lg:justify-end w-full animate-fade-in-up delay-200">
            {pageState === "pricing" && (
              <Card className="w-full max-w-[500px] bg-white/5 backdrop-blur-xl border-white/10 p-8 relative overflow-hidden rounded-[32px] hover:scale-[1.02] transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="text-center space-y-8 py-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center shadow-lg shadow-lime-500/20 group-hover:rotate-12 transition-transform duration-500">
                    <Flame className="w-12 h-12 text-black" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Ready to get cooked?</h3>
                    <p className="text-white/60 text-lg">Connect your Strava and let the AI do its worst.</p>
                  </div>

                  <Button
                    onClick={handleStartRoast}
                    className="w-full bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wide py-8 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    GENERATE ROAST
                  </Button>
                  
                  <p className="text-white/40 text-sm font-medium">
                    Warning: Emotional damage may occur
                  </p>
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
              <Card className="w-full max-w-[600px] bg-black border-4 border-pink-500 p-8 relative overflow-hidden rounded-[32px] shadow-[0_0_50px_rgba(255,0,102,0.3)] animate-fade-in">
                <div className="absolute top-4 left-4 text-2xl animate-pulse">🔥</div>
                <div className="absolute top-4 right-4 text-2xl animate-pulse delay-100">🔥</div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <h2 className="font-heading text-3xl font-black uppercase tracking-tighter">Your Roast</h2>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={handleDownload} className="hover:bg-white/10 rounded-full">
                        <Download className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={handleShare} className="hover:bg-white/10 rounded-full">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <p className="text-lg leading-relaxed font-mono text-white/90 whitespace-pre-wrap">
                      {roastText || "No roast generated. Please try again."}
                    </p>
                  </div>

                  <Button
                    onClick={() => setPageState("chat")}
                    className="w-full bg-lime-500 text-black hover:bg-lime-600 font-bold uppercase tracking-wide py-6 rounded-xl shadow-lg hover:shadow-lime-500/20 transition-all"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat with AI Coach
                  </Button>
                </div>
              </Card>
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
