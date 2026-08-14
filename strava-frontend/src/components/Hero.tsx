import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const IMG = "/new-bg-runners.png";

// Fractal-noise film grain (data URI, no network).
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Hero = () => {
  const container = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".nb-img", { scale: 1.1, duration: 2.4, ease: "power2.out" })
          .from(
            ".nb-line-inner",
            { yPercent: 120, autoAlpha: 0, stagger: 0.14, duration: 1.1 },
            0.35
          )
          .from(".nb-cue", { autoAlpha: 0, y: -8, duration: 0.6 }, "-=0.25");

        gsap.to(bgRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".nb-cue-line", {
          scaleY: 0.35,
          transformOrigin: "top",
          repeat: -1,
          yoyo: true,
          duration: 1.1,
          ease: "sine.inOut",
        });
      });
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[#1a1030]"
    >
      {/* Full-bleed, high-res painterly background */}
      <div ref={bgRef} className="absolute inset-x-0 -top-[5%] h-[110%] will-change-transform">
        <img
          src={IMG}
          alt="Two runners at sunset on the city waterfront"
          className="nb-img h-full w-full object-cover object-center"
          decoding="async"
        />
        {/* Whisper of film grain for texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: NOISE, backgroundSize: "160px 160px" }}
        />
      </div>

      {/* Legibility */}
      <div className="pointer-events-none absolute inset-0 bg-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.4))]" />

      {/* Headline */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="font-bruno uppercase leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.5)]">
          <span className="block overflow-hidden pb-1">
            <span className="nb-line-inner block text-[clamp(1.9rem,6.5vw,5.5rem)]">
              Your Strava<span className="text-[#FFB84D]">.</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="nb-line-inner block text-[clamp(1.9rem,6.5vw,5.5rem)]">
              Smarter<span className="text-[#FFB84D]">.</span>
            </span>
          </span>
        </h1>
      </div>

      {/* Scroll cue */}
      <div className="nb-cue absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-bruno text-[10px] uppercase tracking-[0.4em] text-white/70">
          Scroll
        </span>
        <span className="nb-cue-line h-9 w-px bg-white/50" />
      </div>
    </section>
  );
};

export default Hero;
