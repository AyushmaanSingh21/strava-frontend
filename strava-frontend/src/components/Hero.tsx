import { initiateStravaLogin } from "@/services/stravaAuth";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const Hero = () => {
  const container = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-img", { autoAlpha: 0, duration: 1.2, ease: "power2.out" })
          .from(".hero-eyebrow", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.6")
          .from(
            ".hero-line-inner",
            { yPercent: 115, stagger: 0.12, duration: 1, ease: "power4.out" },
            "-=0.3"
          )
          .from(".hero-sub", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.4")
          .from(".hero-cta", { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.3");

        // Gentle scroll parallax (translate only — keeps the photo crisp).
        gsap.to(bgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative min-h-screen w-full overflow-hidden bg-[#0B0910]"
    >
      {/* Full-bleed photo background */}
      <div ref={bgRef} className="absolute inset-x-0 -top-[6%] h-[112%] will-change-transform">
        <img
          src="/hero-runners.png"
          alt="Two runners in motion at dusk"
          className="hero-img h-full w-full object-cover object-center"
          decoding="async"
        />
      </div>

      {/* Scrims: dark on the left for legibility, subtle fade into the page below */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0910] via-[#0B0910]/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0910] to-transparent" />

      {/* Content overlaid on the dark side */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-24">
        <div className="max-w-xl">
          <span className="hero-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-[#FFB84D]">
            Make every step count
          </span>

          <h1 className="mt-5 font-grotesk uppercase leading-[0.82] tracking-tight text-[#F2ECE1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
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

          <p className="hero-sub mt-6 max-w-md font-mono text-sm leading-relaxed text-[#F2ECE1]/70 md:text-base">
            Connect Strava. Get your run wrap, shareable cards, and a friendly roast — in seconds.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={initiateStravaLogin}
              className="hero-cta inline-flex items-center justify-center rounded-full bg-[#FC4C02] px-8 py-4 font-grotesk text-lg uppercase tracking-widest text-white transition-all hover:-translate-y-1 hover:bg-[#E34402]"
            >
              Connect Strava
            </button>
            <button className="hero-cta inline-flex items-center justify-center rounded-full border border-[#F2ECE1]/30 bg-black/20 px-8 py-4 font-grotesk text-lg uppercase tracking-widest text-[#F2ECE1] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#FFB84D] hover:text-[#FFB84D]">
              Join Our Club
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
