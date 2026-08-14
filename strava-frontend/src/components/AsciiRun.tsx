import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Two stride frames — swapped on an interval to make the runner "run".
const RUNNER_A = [
  "        .-.    ",
  "       (o.o)   ",
  "    »»  /|\\    ",
  "       / >     ",
  "      /  \\_    ",
];
const RUNNER_B = [
  "        .-.    ",
  "       (o.o)   ",
  "    »»  \\|/    ",
  "       < \\     ",
  "     _/   \\    ",
];

// Route / elevation trace — self-draws left→right on load.
const ROUTE = [
  "                     /\\           ",
  "      __            /  \\   /\\     ",
  "     /  \\    /\\    /    \\_/  \\    ",
  "  __/    \\__/  \\__/          \\_o ",
  "START                          END",
];

const AsciiRun = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  // Stride cycle (disabled for reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 210);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ascii-runner", { autoAlpha: 0, x: -24, duration: 0.6, delay: 0.15 });
        gsap.fromTo(
          ".ascii-route",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.7, ease: "none", delay: 0.35 }
        );
        gsap.from(".ascii-label", { autoAlpha: 0, y: 10, stagger: 0.15, duration: 0.5, delay: 1.6 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="w-full font-mono text-[#F2ECE1]">
      <pre className="ascii-runner mb-6 whitespace-pre text-[13px] leading-none text-[#FFB84D] sm:text-base md:text-xl">
        {(frame === 0 ? RUNNER_A : RUNNER_B).join("\n")}
      </pre>

      <span className="ascii-label mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#F2ECE1]/50">
        your year, one route
      </span>

      <pre className="ascii-route whitespace-pre text-[9px] leading-none sm:text-xs md:text-sm">
        {ROUTE.join("\n")}
      </pre>

      <div className="ascii-label mt-4 flex gap-8 font-mono text-[11px] uppercase tracking-widest text-[#F2ECE1]/60">
        <span>
          <span className="text-[#FFB84D]">1,247</span> km
        </span>
        <span>
          <span className="text-[#FFB84D]">183</span> runs
        </span>
        <span>
          <span className="text-[#FFB84D]">12</span> pbs
        </span>
      </div>
    </div>
  );
};

export default AsciiRun;
