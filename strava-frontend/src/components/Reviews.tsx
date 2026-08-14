import { useRef } from "react";
import { gsap, useGSAP, useReveal } from "@/lib/gsap";

const IMAGES = [
  "/reviews/reddit-1.png",
  "/reviews/twitter-1.png",
  "/reviews/reddit-2.png",
  "/reviews/twitter-2.png",
];

const Row = ({ reverse = false, speed = 34 }: { reverse?: boolean; speed?: number }) => {
  const row = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".review-track");
      gsap.set(tracks, { xPercent: reverse ? -100 : 0 });
      gsap.to(tracks, {
        xPercent: reverse ? 0 : -100,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    },
    { scope: row }
  );

  const Track = () => (
    <div className="review-track flex shrink-0 items-start gap-6 pr-6">
      {IMAGES.map((src, i) => (
        <div
          key={i}
          className="shrink-0 rotate-[-1.5deg] odd:rotate-[1.5deg] transition-transform duration-300 hover:rotate-0"
        >
          <img
            src={src}
            alt="Review"
            className="w-48 rounded-lg border-2 border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)] md:w-60"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div ref={row} className="marquee-mask overflow-hidden">
      <div className="flex w-max">
        <Track />
        <Track />
      </div>
    </div>
  );
};

const Reviews = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <section ref={container} className="relative overflow-hidden bg-black py-24 md:py-32">
      <div className="mb-14 px-6 text-center">
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

      <div data-reveal className="flex flex-col gap-6">
        <Row speed={38} />
        <Row reverse speed={44} />
      </div>
    </section>
  );
};

export default Reviews;
