import { useState, useRef, useEffect } from "react";
import { Music, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  autoPlay?: boolean;
}

const MusicPlayer = ({ autoPlay = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Auto-play prevented:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
            console.log("Audio play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center">
      <audio ref={audioRef} src="/run-wrapped-song.mp3" loop />
      <Button
        onClick={togglePlay}
        className={`
            gap-2 rounded-full border-[3px] border-black shadow-[4px_4px_0_#000] 
            hover:translate-y-1 hover:shadow-none transition-all font-bangers tracking-wider uppercase h-auto py-2 px-4
            ${isPlaying ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]" : "bg-white text-black hover:bg-gray-100"}
        `}
      >
        {isPlaying ? (
            <>
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">Pause</span>
            </>
        ) : (
            <>
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Play Music</span>
            </>
        )}
      </Button>
    </div>
  );
};

export default MusicPlayer;
