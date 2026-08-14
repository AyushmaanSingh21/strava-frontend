import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Decorative "tetris" pixel scatter for the hero background:
 * sparse blocks top-right, a protected empty zone under the headline,
 * and a dense dissolve toward the bottom that melts into the black page.
 */
const R = 20;
const C = 40;

const rand = (r: number, c: number) => {
  const s = Math.sin((r + 1) * 12.9898 + (c + 1) * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

const density = (r: number, c: number) => {
  const rf = r / (R - 1);
  const cf = c / (C - 1);
  let d = 0;
  d += Math.max(0, rf - 0.5) * 1.5; // bottom dissolve
  d += cf > 0.55 ? (cf - 0.55) * 0.8 : 0; // right-side scatter
  if (rf < 0.4) d += Math.max(0, cf - 0.62) * 1.0; // top-right cluster
  if (cf < 0.52 && rf > 0.12 && rf < 0.62) d = 0; // keep headline clear
  return d;
};

type Block = { top: number; left: number; color: string; opacity: number };

const BLOCKS: Block[] = [];
for (let r = 0; r < R; r++) {
  for (let c = 0; c < C; c++) {
    if (rand(r, c) < density(r, c)) {
      const rf = r / (R - 1);
      const dark = rf > 0.6;
      const gold = !dark && (r + c) % 9 === 0;
      BLOCKS.push({
        top: (r / R) * 100,
        left: (c / C) * 100,
        color: dark ? "#0B0912" : gold ? "#FFB84D" : "#F2ECE1",
        opacity: dark ? 0.92 : gold ? 0.7 : 0.38,
      });
    }
  }
}

const PixelField = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tetris-pix", {
          autoAlpha: 0,
          scale: 0,
          transformOrigin: "center",
          duration: 0.5,
          ease: "power2.out",
          stagger: { each: 0.006, from: "random" },
          delay: 0.2,
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    >
      {BLOCKS.map((b, i) => (
        <div
          key={i}
          className="tetris-pix absolute h-3.5 w-3.5 rounded-[2px] lg:h-4 lg:w-4"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            backgroundColor: b.color,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default PixelField;
