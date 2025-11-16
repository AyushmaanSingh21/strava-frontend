import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import RoastCard from "@/components/RoastCard";
import ChatInterface from "@/components/ChatInterface";
import { Check, Flame, Sparkles } from "lucide-react";
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

  const handlePurchase = (plan: "one-time" | "unlimited") => {
    // TODO: Add Stripe payment integration before production launch
    toast({
      title: "Payment Processing",
      description: "Redirecting to Stripe...",
    });
    // Simulate payment
    setTimeout(() => {
      setPageState("analyzing");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {pageState === "pricing" && (
        <div className="pt-16">
          {/* Hero Section */}
          <div className="relative overflow-hidden border-b-4 border-white py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-black to-lime-500/20 animate-gradient-shift" />
            <div className="container mx-auto px-6 relative z-10 text-center">
              <Badge className="mb-6 bg-pink-500 text-black animate-pulse px-6 py-2 text-sm font-bold uppercase tracking-widest">
                ⚠️ PREMIUM FEATURE
              </Badge>
              <h1 className="font-heading text-7xl md:text-9xl font-black mb-6 tracking-tighter">
                GET ROASTED 🔥
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto uppercase tracking-wider text-white/90">
                AI will analyze your runs and serve the truth. Can you handle it?
              </p>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto">
              {/* One-Time Roast */}
              <Card className="bg-black border-4 border-lime-500 p-12 relative hover:scale-105 transition-all duration-200 shadow-[0_0_40px_rgba(204,255,0,0.4)]">
                <Badge className="absolute -top-3 -right-3 bg-pink-500 text-black font-bold uppercase text-xs px-4 py-2 rotate-12 shadow-lg">
                  🔥 HOT
                </Badge>
                <Badge className="mb-6 bg-lime-500 text-black font-bold uppercase tracking-wide text-lg px-6 py-2">
                  AI ROAST
                </Badge>
                <div className="mb-8">
                  <span className="text-7xl font-black">$2.99</span>
                  <span className="text-2xl text-white/70 ml-2">one-time</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-lime-500 shrink-0 mt-1" />
                    <span className="text-lg">Full AI roast of your training data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-lime-500 shrink-0 mt-1" />
                    <span className="text-lg">10-minute chat session with AI coach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-lime-500 shrink-0 mt-1" />
                    <span className="text-lg">Personalized insights & analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-lime-500 shrink-0 mt-1" />
                    <span className="text-lg">Downloadable roast report</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-lime-500 shrink-0 mt-1" />
                    <span className="text-lg">Brutally honest feedback</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handlePurchase("one-time")}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-black font-bold uppercase tracking-wide py-8 text-xl shadow-lg"
                >
                  GET ROASTED NOW 🔥
                </Button>
                <p className="text-center text-white/60 text-sm mt-6 uppercase tracking-wider">
                  One payment • Instant access • No subscription
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {pageState === "analyzing" && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="max-w-2xl w-full px-6">
            <div className="text-center mb-8">
              <Flame className="w-20 h-20 text-pink-500 mx-auto mb-6 animate-pulse" />
              <p className="text-2xl font-bold uppercase tracking-wide mb-2">
                {loadingMessage}
              </p>
            </div>
            <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden border-2 border-white">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-lime-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-white/60 mt-4 text-sm uppercase tracking-wider">
              {progress}% Complete
            </p>
          </div>
        </div>
      )}

      {pageState === "roast" && (
        <div className="pt-16 min-h-screen">
          <RoastCard onStartChat={() => setPageState("chat")} roastText={roastText} stats={analysisStats || undefined} />
        </div>
      )}

      {pageState === "chat" && (
        <div className="pt-16 min-h-screen">
          <ChatInterface onEndSession={() => setPageState("summary")} userData={rawStats} />
        </div>
      )}

      {pageState === "summary" && (
        <div className="pt-16 min-h-screen flex items-center justify-center px-6">
          <Card className="bg-black border-4 border-lime-500 p-12 max-w-2xl w-full text-center">
            <Sparkles className="w-16 h-16 text-lime-500 mx-auto mb-6" />
            <h2 className="font-heading text-5xl font-black mb-4 uppercase">
              SESSION COMPLETE ✅
            </h2>
            <p className="text-xl mb-8 text-white/80">
              You exchanged 12 messages with your AI coach
            </p>
            <div className="space-y-4 mb-8">
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-black font-bold uppercase tracking-wide py-6">
                DOWNLOAD ROAST REPORT
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-white text-white font-bold uppercase tracking-wide py-6"
                onClick={() => setPageState("pricing")}
              >
                BACK TO DASHBOARD
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Roast;
