import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const TESTIMONIALS = [
  {
    quote: "Cool, well done, and much better than Strava's official one.",
    name: "JapanskElorgel",
    source: "Reddit",
    accent: "#4C6FFF",
  },
  {
    quote: "Love the analogies u did man, also loved the design .. great work",
    name: "Shauryamaan Singh",
    source: "@ShauryamaanS",
    accent: "#FFB84D",
  },
  {
    quote: "The best one that I found! Thanks a lot. A lonely wolf here! :D",
    name: "One_Technician_8082",
    source: "Reddit",
    accent: "#8E7BE8",
  },
  {
    quote:
      "Good project, although I'm not active on Strava — any plans for next year's wrap? 😅👀",
    name: "Satya",
    source: "@sa7yaaa",
    accent: "#4C6FFF",
  },
];

const Reviews = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header reveal.
        gsap.from(".rev-head", {
          autoAlpha: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: container.current, start: "top 75%" },
        });

        // Cards pop in with an alternating tilt.
        gsap.from(".tcard", {
          autoAlpha: 0,
          y: 70,
          scale: 0.9,
          rotate: (i: number) => (i % 2 === 0 ? -3 : 3),
          transformOrigin: "center",
          duration: 0.8,
          ease: "back.out(1.4)",
          stagger: 0.14,
          clearProps: "transform",
          scrollTrigger: { trigger: ".tcard-grid", start: "top 82%" },
        });

        // Quote marks draw attention as their card lands.
        gsap.from(".tcard-quote", {
          autoAlpha: 0,
          scale: 0.3,
          rotate: -20,
          transformOrigin: "left top",
          duration: 0.6,
          ease: "back.out(2)",
          stagger: 0.14,
          scrollTrigger: { trigger: ".tcard-grid", start: "top 82%" },
        });

        // Gentle continuous float (on inner wrapper so it never fights the entrance).
        gsap.to(".tcard-inner", {
          y: -10,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.5, from: "random" },
        });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative bg-[#0B0910] py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 md:mb-20">
          <span className="rev-head font-mono text-xs uppercase tracking-[0.3em] text-[#4C6FFF]">
            / The receipts
          </span>
          <h2 className="rev-head mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl">
            You ran.{" "}
            <span className="font-condiment lowercase tracking-normal text-[#FFB84D]">
              they talked.
            </span>
          </h2>
        </div>

        <div className="tcard-grid grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="tcard rounded-2xl border border-white/10 bg-white/[0.03] transition-[border-color,transform] duration-300 hover:-translate-y-1.5 hover:border-white/30"
            >
              <div className="tcard-inner flex h-full flex-col p-8 md:p-10">
                <span
                  aria-hidden
                  className="tcard-quote font-grotesk text-6xl leading-none"
                  style={{ color: t.accent }}
                >
                  &ldquo;
                </span>
                <p className="-mt-4 flex-1 font-mono text-lg leading-relaxed text-white/90 md:text-xl">
                  {t.quote}
                </p>
                <footer className="mt-8 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full font-grotesk text-sm text-black"
                    style={{ backgroundColor: t.accent }}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="font-grotesk text-sm uppercase tracking-wide text-white">
                      {t.name}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">
                      {t.source}
                    </span>
                  </span>
                </footer>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
