import { Twitter, Users, MessageSquare } from "lucide-react";
import { useRef } from "react";
import { initiateStravaLogin } from "@/services/stravaAuth";
import { useReveal } from "@/lib/gsap";

const SOCIALS = [
  { icon: Twitter, href: "https://x.com/AyuuSure", label: "Twitter" },
  { icon: Users, href: "https://strava.app.link/LtgcoA7NiZb", label: "Join Strava Club" },
  {
    icon: MessageSquare,
    href: "mailto:your-email@example.com?subject=RunWrapped%20Feedback",
    label: "Send Feedback",
  },
];

const Footer = () => {
  const container = useRef<HTMLElement>(null);
  useReveal(container);

  return (
    <footer ref={container} className="relative overflow-hidden bg-black pt-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Closing CTA */}
        <div className="border-t border-white/10 py-16 text-center md:py-24">
          <p
            data-reveal
            className="font-condiment text-3xl text-[#FFB84D] md:text-5xl"
          >
            ready?
          </p>
          <h2
            data-reveal
            className="mt-2 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            Unwrap your run
          </h2>
          <button
            data-reveal
            onClick={initiateStravaLogin}
            className="mt-8 inline-flex items-center rounded-full bg-[#FC4C02] px-10 py-5 font-grotesk text-xl uppercase tracking-widest text-white transition-all hover:-translate-y-1 hover:bg-[#E34402]"
          >
            Connect Strava
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 py-12 md:flex-row">
          <div className="text-center md:text-left">
            <div className="font-grotesk text-3xl uppercase tracking-tight text-white">
              RUNWR<span className="text-[#FFB84D]">▲</span>PPED
            </div>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-white/50">
              You ran. We kept receipts.
            </p>
          </div>

          <div className="flex gap-4">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-[#FFB84D] hover:text-[#FFB84D]"
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div
        data-reveal
        className="pointer-events-none select-none px-6 pb-6 text-center"
      >
        <span className="text-stroke-thin block font-grotesk text-[19vw] leading-[0.8] tracking-tighter">
          RUNWRAPPED
        </span>
      </div>

      <div className="border-t border-white/10 py-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">
          © {new Date().getFullYear()} RunWrapped.me. Not affiliated with Strava (obviously).
        </p>
      </div>
    </footer>
  );
};

export default Footer;
