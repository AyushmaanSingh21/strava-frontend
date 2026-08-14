import { Check } from "lucide-react";
import { useRef } from "react";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { useReveal } from "@/lib/gsap";

const TIERS = [
  {
    name: "Cheapskate",
    badge: "Popular",
    price: "$0",
    period: "/forever",
    note: null,
    cta: "Start Free",
    highlight: false,
    features: [
      "Full Story Mode (7 Acts)",
      "Generate shareable cards",
      "All data analytics",
      "Get Roasted (It's free now)",
      "Export to social media",
    ],
  },
  {
    name: "High Roller",
    badge: "💸 For rich people",
    price: "$0",
    period: "/also forever",
    note: "Exactly the same, but pink.",
    cta: "Feel Expensive",
    highlight: true,
    features: [
      "Everything in Free",
      "You feel superior",
      "Pink background (fancy)",
      "Still $0 (we are bad at business)",
      "Unlimited bragging rights",
      "Priority support (we reply faster)",
    ],
  },
];

const Pricing = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <section ref={container} id="pricing" className="relative bg-black py-24 md:py-36">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <span
            data-reveal
            className="font-mono text-xs uppercase tracking-[0.3em] text-[#CCFF00]"
          >
            / Pricing
          </span>
          <h2
            data-reveal
            className="mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Simple pricing
          </h2>
          <p
            data-reveal
            className="mt-4 font-condiment text-2xl text-white/70 md:text-3xl"
          >
            because we're bad at capitalism
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              data-reveal
              className={`relative flex flex-col rounded-3xl border p-8 md:p-10 transition-transform duration-300 hover:-translate-y-2 ${
                tier.highlight
                  ? "border-[#FF0066] bg-[#FF0066]/10"
                  : "border-white/15 bg-white/[0.03]"
              }`}
            >
              <div className="mb-8 flex items-start justify-between">
                <h3 className="font-grotesk text-3xl uppercase tracking-tight text-white md:text-4xl">
                  {tier.name}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    tier.highlight ? "bg-[#FF0066] text-white" : "bg-[#CCFF00] text-black"
                  }`}
                >
                  {tier.badge}
                </span>
              </div>

              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-grotesk text-7xl text-white md:text-8xl">{tier.price}</span>
                <span className="font-mono text-sm uppercase tracking-widest text-white/50">
                  {tier.period}
                </span>
              </div>
              {tier.note && (
                <p className="mb-6 font-condiment text-xl text-white/70">{tier.note}</p>
              )}

              <ul className="my-8 flex-1 space-y-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        tier.highlight ? "bg-[#FF0066]" : "bg-[#CCFF00]"
                      }`}
                    >
                      <Check className="h-3 w-3 text-black" strokeWidth={4} />
                    </span>
                    <span className="font-mono text-sm text-white/80">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={initiateStravaLogin}
                className={`w-full rounded-full py-4 font-grotesk text-lg uppercase tracking-widest transition-all hover:-translate-y-0.5 ${
                  tier.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        <p
          data-reveal
          className="mt-14 text-center font-mono text-sm uppercase tracking-[0.2em] text-white/40"
        >
          No credit card required. We don't even know how to process payments.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
