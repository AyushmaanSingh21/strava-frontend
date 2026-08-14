import { initiateStravaLogin } from "@/services/stravaAuth";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const Hero = () => {
  const container = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Slow cinematic push-in on the photo.
        gsap.from(".hero-bg-img", { scale: 1.15, duration: 2.4, ease: "power2.out" });

        // Minimal content rises in.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-line-inner", { yPercent: 115, stagger: 0.12, duration: 1, ease: "power4.out" }, 0.5)
          .from(".hero-cta", { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.3")
          .from(".hero-cue", { autoAlpha: 0, duration: 0.6 }, "-=0.2");

        // Parallax drift.
        gsap.to(bgRef.current, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-cue-arrow", {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
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
      className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black"
    >
      {/* Full-bleed, full-vividness photo */}
      <div ref={bgRef} className="absolute inset-x-0 -top-[6%] h-[118%] will-change-transform">
        <img
          src="/landing-page-bg.png"
          alt="RunWrapped crew at dusk over the city skyline"
          className="hero-bg-img h-full w-full object-cover object-center"
        />
      </div>

      {/* Just enough scrim for legibility — image stays bright */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Minimal content, anchored bottom-left */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-14 md:pb-20">
        <div>
          <h1 className="font-grotesk uppercase leading-[0.82] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
            <span className="block overflow-hidden">
              <span className="hero-line-inner block text-6xl sm:text-8xl md:text-[9rem]">
                Unwrap
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block bg-gradient-to-r from-[#FF7847] via-[#FFB84D] to-[#FFD9A0] bg-clip-text text-6xl text-transparent sm:text-8xl md:text-[9rem]">
                Your Run
              </span>
            </span>
          </h1>

          <button
            onClick={initiateStravaLogin}
            className="hero-cta mt-8 inline-flex items-center rounded-full bg-[#FC4C02] px-9 py-4 font-grotesk text-lg uppercase tracking-widest text-white transition-all hover:-translate-y-1 hover:bg-[#E34402]"
          >
            Connect Strava
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
          Scroll
        </span>
        <ArrowDown className="hero-cue-arrow h-4 w-4 text-white/60" />
      </div>
    </section>
  );
};

export default Hero;
