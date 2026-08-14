import { initiateStravaLogin } from "@/services/stravaAuth";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const Hero = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const container = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/users/count`);
        if (res.ok) {
          const data = await res.json();
          setUserCount(data.count);
        }
      } catch (e) {
        console.error("Failed to fetch user count", e);
      }
    };
    fetchCount();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero-bg-img", { scale: 1.2, duration: 2, ease: "power2.out" })
          .from(".hero-eyebrow", { autoAlpha: 0, y: 20, stagger: 0.1, duration: 0.6 }, 0.4)
          .from(
            ".hero-line-inner",
            { yPercent: 115, stagger: 0.12, duration: 1, ease: "power4.out" },
            "-=0.2"
          )
          .from(
            ".hero-script",
            { autoAlpha: 0, scale: 0.6, rotate: -14, duration: 0.7, ease: "back.out(2)" },
            "-=0.7"
          )
          .from(".hero-sub", { autoAlpha: 0, y: 24, duration: 0.6 }, "-=0.4")
          .from(
            ".hero-cta",
            { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.6, ease: "back.out(1.6)" },
            "-=0.3"
          )
          .from(".hero-stat", { autoAlpha: 0, x: 24, stagger: 0.1, duration: 0.5 }, "-=0.4")
          .from(".hero-cue", { autoAlpha: 0, y: -10, duration: 0.6 }, "-=0.2");

        // Parallax drift of the background on scroll.
        gsap.to(bgRef.current, {
          yPercent: 22,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Bob the scroll cue.
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
      className="grain relative min-h-screen w-full overflow-hidden bg-black"
    >
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-x-0 -top-[12%] h-[135%] will-change-transform">
        <img
          src="/landing-page-bg.png"
          alt="RunWrapped crew at dusk over the city skyline"
          className="hero-bg-img h-full w-full object-cover object-center"
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 pb-14 pt-28 md:pb-20 md:pt-32">
        {/* Top eyebrow row */}
        <div className="flex flex-wrap items-center gap-3 pt-6">
          <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#CCFF00] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#CCFF00]" />
            </span>
            <span className="font-grotesk text-xs uppercase tracking-[0.2em] text-[#CCFF00]">
              The #1 Storyteller for Runners
            </span>
          </span>
          <span className="hero-eyebrow rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white/80 backdrop-blur-md">
            Trusted by {userCount ? userCount + 100 : "100+"} Athletes
          </span>
        </div>

        {/* Bottom-anchored headline block */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="hero-script mb-1 block font-condiment text-3xl text-[#00F0FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] md:text-5xl">
              unwrapped
            </span>
            <h1 className="font-grotesk uppercase leading-[0.85] tracking-tight text-white">
              <span className="block overflow-hidden">
                <span className="hero-line-inner block text-6xl sm:text-8xl md:text-[8.5rem]">
                  Unwrap
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line-inner block bg-gradient-to-r from-[#00F0FF] via-[#7CF0FF] to-[#CCFF00] bg-clip-text text-6xl text-transparent sm:text-8xl md:text-[8.5rem]">
                  Your Run
                </span>
              </span>
            </h1>
            <p className="hero-sub mt-6 max-w-xl font-mono text-base leading-relaxed text-white/80 md:text-lg">
              Connect Strava. Get your run wrap, shareable cards, and a friendly roast — in seconds.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={initiateStravaLogin}
                className="hero-cta group inline-flex items-center justify-center rounded-full bg-[#FC4C02] px-8 py-4 font-grotesk text-lg uppercase tracking-widest text-white transition-all hover:-translate-y-1 hover:bg-[#E34402]"
              >
                Connect Strava
              </button>
              <button className="hero-cta inline-flex items-center justify-center rounded-full bg-[#CCFF00] px-8 py-4 font-grotesk text-lg uppercase tracking-widest text-black transition-all hover:-translate-y-1 hover:bg-[#b3e600]">
                Join Our Club
              </button>
            </div>
          </div>

          {/* Stats rail */}
          <div className="flex shrink-0 flex-row gap-8 md:flex-col md:gap-6 md:border-l md:border-white/15 md:pl-8">
            {[
              { value: "10K+", label: "Runs", accent: "#CCFF00" },
              { value: "AI", label: "Powered", accent: "#00F0FF" },
              { value: "0s", label: "Instant Recap", accent: "#FF0066" },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <div
                  className="font-grotesk text-4xl leading-none md:text-5xl"
                  style={{ color: s.accent }}
                >
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-xs uppercase tracking-widest text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <ArrowDown className="hero-cue-arrow h-4 w-4 text-white/50" />
      </div>
    </section>
  );
};

export default Hero;
