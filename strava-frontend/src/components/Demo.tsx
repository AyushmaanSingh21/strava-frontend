import { Link2, Zap, Download } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP, useReveal } from "@/lib/gsap";

const STEPS = [
  {
    icon: Link2,
    number: "01",
    title: "Connect Strava",
    description:
      "Click the button. We grab your stats faster than you grab water at an aid station. Secure, safe, and judgment-free (until the roast starts).",
    accent: "#CCFF00",
  },
  {
    icon: Zap,
    number: "02",
    title: "We Analyze Your Run Data",
    description:
      "We look at your pace, your distance, and that 3-week break you took in November. We find the story behind your sweat.",
    accent: "#00F0FF",
  },
  {
    icon: Download,
    number: "03",
    title: "You Get Wrapped + Roasted",
    description:
      "Your year in review, served with a side of sass. One beautiful card to rule them all. Share it before you change your mind.",
    accent: "#FF0066",
  },
];

const Demo = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  // Progress line grows as the timeline scrolls through the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".demo-line-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".demo-timeline",
              start: "top 60%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section ref={container} id="demo" className="relative bg-black py-24 md:py-36">
      <div className="relative mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-16 text-center md:mb-24">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF0066]"
          >
            / How it works
          </span>
          <h2
            data-reveal
            className="mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Three steps.
            <br />
            <span className="font-condiment lowercase tracking-normal text-[#FF0066]">
              zero excuses.
            </span>
          </h2>
          <p
            data-reveal
            className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-white/50"
          >
            Takes less time than your warm-up.
          </p>
        </div>

        {/* Timeline */}
        <div className="demo-timeline relative pl-12 md:pl-20">
          {/* Track */}
          <div className="absolute left-[18px] top-2 h-full w-0.5 bg-white/10 md:left-[30px]">
            <div className="demo-line-fill h-full w-full origin-top bg-gradient-to-b from-[#CCFF00] via-[#00F0FF] to-[#FF0066]" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} data-reveal className="relative">
                  {/* Node */}
                  <span
                    className="absolute -left-[46px] top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-black md:-left-[62px] md:h-12 md:w-12"
                    style={{ borderColor: step.accent }}
                  >
                    <Icon
                      className="h-5 w-5 md:h-6 md:w-6"
                      style={{ color: step.accent }}
                      strokeWidth={2.4}
                    />
                  </span>

                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-grotesk text-2xl leading-none md:text-3xl"
                      style={{ color: step.accent }}
                    >
                      {step.number}
                    </span>
                    <h3 className="font-grotesk text-3xl uppercase leading-none tracking-tight text-white md:text-5xl">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-2xl font-mono text-base leading-relaxed text-white/70 md:text-lg">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
