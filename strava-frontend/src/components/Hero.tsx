import { initiateStravaLogin } from "@/services/stravaAuth";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import PixelShoe from "./PixelShoe";
import PixelField from "./PixelField";

const Hero = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 0.6 }, 0.1)
          .from(
            ".hero-line-inner",
            { yPercent: 115, stagger: 0.12, duration: 1, ease: "power4.out" },
            "-=0.3"
          )
          .from(".hero-sub", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.4")
          .from(".hero-cta", { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.3");
      });
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#1C1730]"
    >
      <PixelField />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-32 md:grid-cols-2 md:gap-10 md:pt-24">
        {/* Left — bold headline */}
        <div>
          <span className="hero-eyebrow font-mono text-xs uppercase tracking-[0.25em] text-white/50">
            The #1 storyteller for runners
          </span>

          <h1 className="mt-5 font-grotesk uppercase leading-[0.82] tracking-tight text-[#F2ECE1]">
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-6xl sm:text-7xl md:text-[7rem]">
                <span className="mr-3 align-middle text-4xl text-[#FFB84D] md:text-6xl">•</span>
                Unwrap
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-6xl sm:text-7xl md:text-[7rem]">
                Your Run
              </span>
            </span>
          </h1>

          <p className="hero-sub mt-7 max-w-md font-mono text-sm leading-relaxed text-white/60 md:text-base">
            Connect Strava. Get your run wrap, shareable cards, and a friendly roast — in seconds.
          </p>

          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button
              onClick={initiateStravaLogin}
              className="hero-cta font-grotesk text-lg uppercase tracking-widest text-[#FC4C02] transition-colors hover:text-[#FF7847]"
            >
              [ Connect Strava ]
            </button>
            <button className="hero-cta font-grotesk text-lg uppercase tracking-widest text-white/70 transition-colors hover:text-white">
              [ Join Our Club ]
            </button>
          </div>
        </div>

        {/* Right — pixel-art running shoe */}
        <div className="mx-auto w-full max-w-lg">
          <PixelShoe />
        </div>
      </div>
    </section>
  );
};

export default Hero;
