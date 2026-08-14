import { Sparkles, CreditCard, Flame, Check } from "lucide-react";
import { useRef } from "react";
import { useReveal } from "@/lib/gsap";

const FEATURES = [
  {
    number: "01",
    title: "Run Wrapped",
    shortCopy: "Your running year, boiled down to what matters.",
    items: ["Total distance", "Pace highlights", "Your running personality", "Year-in-review summary"],
    icon: Sparkles,
    accent: "#8338ec",
  },
  {
    number: "02",
    title: "Wrapped Card",
    shortCopy: "One card. All the flex.",
    items: ["One clean, shareable card", "Auto-generated", "Instagram/X ready"],
    icon: CreditCard,
    accent: "#3a86ff",
  },
  {
    number: "03",
    title: "The Roast",
    shortCopy: "We roast your runs. Respectfully.",
    items: ["Playful, not toxic", "Based on your data only"],
    icon: Flame,
    accent: "#ff006e",
  },
];

const Features = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <section ref={container} id="features" className="relative bg-black py-24 md:py-36">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#CCFF00]"
          >
            / What you get
          </span>
          <h2
            data-reveal
            className="mt-4 max-w-4xl font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Everything to level up your <span className="text-stroke-white">running game</span>
          </h2>
        </div>

        {/* Feature rows */}
        <div className="flex flex-col">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.number}
                data-reveal
                className="group grid grid-cols-1 items-start gap-6 border-t border-white/10 py-12 md:grid-cols-12 md:gap-10 md:py-16"
              >
                {/* Big index */}
                <div className="md:col-span-2">
                  <span
                    className="font-grotesk text-6xl leading-none transition-transform duration-500 group-hover:-translate-y-1 md:text-8xl"
                    style={{ color: f.accent }}
                  >
                    {f.number}
                  </span>
                </div>

                {/* Title + short copy */}
                <div className="md:col-span-5">
                  <div className="mb-5 flex items-center gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl border"
                      style={{ borderColor: f.accent }}
                    >
                      <Icon className="h-6 w-6" style={{ color: f.accent }} strokeWidth={2.2} />
                    </span>
                    <h3 className="font-grotesk text-3xl uppercase tracking-tight text-white md:text-4xl">
                      {f.title}
                    </h3>
                  </div>
                  <p className="font-condiment text-2xl text-white/70 md:text-3xl">
                    {f.shortCopy}
                  </p>
                </div>

                {/* Items */}
                <ul className="space-y-3 md:col-span-5">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: f.accent }}
                      >
                        <Check className="h-3 w-3 text-black" strokeWidth={4} />
                      </span>
                      <span className="font-mono text-sm uppercase tracking-wide text-white/80">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="border-t border-white/10" />
        </div>

        <p
          data-reveal
          className="mt-16 font-mono text-sm uppercase tracking-[0.2em] text-white/40"
        >
          Built for athletes who want more than just numbers.
        </p>
      </div>
    </section>
  );
};

export default Features;
