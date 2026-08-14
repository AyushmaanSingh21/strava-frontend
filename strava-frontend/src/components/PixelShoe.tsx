import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A stylised side-profile running shoe drawn on a 24-wide pixel grid.
 * 1 = filled square, 0 = empty. Heel/collar sits left, toe extends right,
 * with a thick sole and a tread row at the bottom.
 */
const SHOE = [
  "000011111000000000000000",
  "000111111101100000000000",
  "000111111111111100000000",
  "001111111111111111100000",
  "001111111111111111111000",
  "011111111111111111111110",
  "011111111111111111111110",
  "111111111111111111111111",
  "111111111111111111111111",
  "110110110110110110110110",
];
const COLS = 24;
const ROWS = SHOE.length;

// Mostly cream squares with a sparse warm-gold accent.
const colorFor = (r: number, c: number) =>
  (r + c) % 6 === 0 ? "#FFB84D" : "#F2ECE1";

const PixelShoe = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Assemble the shoe from scattered pixels.
        gsap.from(".pix", {
          autoAlpha: 0,
          scale: 0.2,
          transformOrigin: "center",
          duration: 0.6,
          ease: "back.out(1.8)",
          stagger: { each: 0.012, from: "random" },
          delay: 0.25,
        });
        // Gentle continuous float of the whole shoe.
        gsap.to(".pixel-shoe-grid", {
          y: -10,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative w-full">
      {/* soft warm glow for depth (solid radial, not a text gradient) */}
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,184,77,0.12),transparent_65%)] blur-2xl" />

      <div
        className="pixel-shoe-grid relative grid gap-[3px] sm:gap-[4px]"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const filled = SHOE[r][c] === "1";
          return (
            <div key={i} className="aspect-square">
              {filled && (
                <div
                  className="pix h-full w-full rounded-[2px]"
                  style={{ backgroundColor: colorFor(r, c) }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PixelShoe;
