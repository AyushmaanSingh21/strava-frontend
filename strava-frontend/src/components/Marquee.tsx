import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface MarqueeProps {
  items: string[];
  /** seconds per full loop; lower = faster */
  speed?: number;
  reverse?: boolean;
  className?: string;
  accent?: string; // hex for the separator dot
}

/**
 * Seamless infinite ticker powered by GSAP (ease: "none" + xPercent wrap).
 * Renders two identical tracks so the loop never shows a gap.
 */
const Marquee = ({
  items,
  speed = 28,
  reverse = false,
  className = "",
  accent = "#CCFF00",
}: MarqueeProps) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track");
      gsap.set(tracks, { xPercent: reverse ? -100 : 0 });
      gsap.to(tracks, {
        xPercent: reverse ? 0 : -100,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    },
    { scope: container }
  );

  const Track = () => (
    <div className="marquee-track flex shrink-0 items-center whitespace-nowrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-grotesk uppercase tracking-tight px-6">{item}</span>
          <span
            className="inline-block h-3 w-3 rounded-full mx-2"
            style={{ backgroundColor: accent }}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={container} className={`marquee-mask overflow-hidden ${className}`}>
      <div className="flex w-max">
        <Track />
        <Track />
      </div>
    </div>
  );
};

export default Marquee;
