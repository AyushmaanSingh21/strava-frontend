import { useRef } from "react";
import { useReveal } from "@/lib/gsap";

const TESTIMONIALS = [
  {
    quote: "Cool, well done, and much better than Strava's official one.",
    name: "JapanskElorgel",
    source: "Reddit",
    accent: "#FF7847",
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
    accent: "#FF7847",
  },
];

const Reviews = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <section ref={container} className="relative bg-[#0B0910] py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 md:mb-20">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF7847]"
          >
            / The receipts
          </span>
          <h2
            data-reveal
            className="mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            You ran.{" "}
            <span className="font-condiment lowercase tracking-normal text-[#FFB84D]">
              they talked.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              data-reveal
              className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors duration-300 hover:border-white/25 md:p-10"
            >
              <span
                aria-hidden
                className="font-grotesk text-6xl leading-none"
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
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
