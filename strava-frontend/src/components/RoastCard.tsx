import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, MessageSquare, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RoastCardProps {
  onStartChat: () => void;
  roastText?: string;
  stats?: Array<{ label: string; value: string; comment?: string }>;
}

const RoastCard = ({ onStartChat, roastText, stats }: RoastCardProps) => {
  const { toast } = useToast();

  console.log("RoastCard received roastText:", roastText);
  console.log("RoastCard received stats:", stats);

  const displayRoast = roastText || "No roast generated. Please try again.";
  const displayStats = stats && stats.length > 0 ? stats : [
    { label: "No stats available", value: "Please try again", comment: "" }
  ];

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
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black border-4 border-pink-500 p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(255,0,102,0.5)] animate-fade-in">
          {/* Fire emoji decorations */}
          <div className="absolute top-4 left-4 text-4xl animate-pulse">🔥</div>
          <div className="absolute top-4 right-4 text-4xl animate-pulse delay-100">
            🔥
          </div>
          <div className="absolute bottom-4 left-4 text-4xl animate-pulse delay-200">
            🔥
          </div>
          <div className="absolute bottom-4 right-4 text-4xl animate-pulse delay-300">
            🔥
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-2 uppercase tracking-tighter">
              🔥 YOUR ROAST 🔥
            </h1>
            <div className="w-full h-1 bg-white mb-8" />
          </div>

          {/* Main Roast Text */}
          <div className="bg-white/10 border-2 border-white/30 rounded-lg p-10 mb-8 min-h-[400px] flex items-center">
            <p className="text-xl md:text-2xl leading-relaxed font-mono whitespace-pre-wrap text-white">
              {displayRoast}
            </p>
          </div>

          <div className="w-full h-1 bg-white mb-8" />

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={handleDownload}
              className="bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wide py-6"
            >
              <Download className="w-5 h-5 mr-2" />
              DOWNLOAD
            </Button>
            <Button
              onClick={onStartChat}
              className="bg-lime-500 text-black hover:bg-lime-600 font-bold uppercase tracking-wide py-6 md:col-span-1"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              START CHAT
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide py-6"
            >
              <Share2 className="w-5 h-5 mr-2" />
              SHARE
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoastCard;
