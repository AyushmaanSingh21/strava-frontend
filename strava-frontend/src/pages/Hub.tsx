import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Sparkles, Trophy, Flame, CreditCard, ArrowUpRight, Lock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Starfield from "@/components/Starfield";
import { gsap, useGSAP } from "@/lib/gsap";

type Section = {
  title: string;
  blurb: string;
  to?: string;
  Icon: typeof CalendarDays;
  bg: string;
  ink: string;
  sub: string;
  panel: string;
  wide?: boolean;
  soon?: boolean;
};

const SECTIONS: Section[] = [
  {
    title: "Monthly Recap",
    blurb: "Your last 30 days, wrapped. Distance, streaks and the month's best run.",
    Icon: CalendarDays,
    bg: "#1C2A72", ink: "#EAF0FF", sub: "#A9B6E8", panel: "rgba(255,255,255,0.10)",
    wide: true,
    soon: true,
  },
  {
    title: "Yearly Wrap",
    blurb: "The full story of your running year — 20 cards, start to finish.",
    to: "/wrap",
    Icon: Sparkles,
    bg: "#BEE1FF", ink: "#0E2338", sub: "#2C4E70", panel: "rgba(0,0,0,0.06)",
    wide: true,
  },
  {
    title: "Leaderboard",
    blurb: "Race your friends. Monthly standings inside your circle.",
    Icon: Trophy,
    bg: "#5E1B2E", ink: "#F6E3E9", sub: "#CE8FA3", panel: "rgba(255,255,255,0.10)",
    soon: true,
  },
  {
    title: "Roast Me",
    blurb: "We read your data and say the quiet part out loud.",
    to: "/roast",
    Icon: Flame,
    bg: "#FFD3B6", ink: "#3A1A0E", sub: "#7A3A22", panel: "rgba(0,0,0,0.06)",
  },
  {
    title: "My Card",
    blurb: "One clean, shareable card. Built for your feed.",
    to: "/cards",
    Icon: CreditCard,
    bg: "#B8EAD6", ink: "#0E2A22", sub: "#2C5E4E", panel: "rgba(0,0,0,0.06)",
  },
];

const Tile = ({ s }: { s: Section }) => {
  const body = (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 55% at 50% -10%, rgba(255,255,255,0.22), transparent 60%)" }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: s.panel }}
          >
            <s.Icon className="h-6 w-6" style={{ color: s.ink }} strokeWidth={2} />
          </span>

          {s.soon ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ background: s.panel, color: s.sub }}
            >
              <Lock className="h-3 w-3" /> Soon
            </span>
          ) : (
            <ArrowUpRight
              className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ color: s.sub }}
            />
          )}
        </div>

        <div className="mt-auto pt-10">
          <h2
            className="font-grotesk text-3xl uppercase leading-none tracking-tight md:text-4xl"
            style={{ color: s.ink }}
          >
            {s.title}
          </h2>
          <p className="mt-3 max-w-sm font-mono text-sm leading-relaxed" style={{ color: s.sub }}>
            {s.blurb}
          </p>
        </div>
      </div>
    </>
  );

  const cls =
    `hub-tile group relative flex min-h-[240px] flex-col overflow-hidden rounded-[24px] border p-7 md:min-h-[260px] md:p-8 ` +
    (s.wide ? "md:col-span-2 " : "") +
    (s.soon ? "cursor-default" : "transition-transform duration-300 hover:-translate-y-1.5");

  const style = { background: s.bg, borderColor: "rgba(255,255,255,0.10)" } as React.CSSProperties;

  return s.to ? (
    <Link to={s.to} className={cls} style={style}>
      {body}
    </Link>
  ) : (
    <div className={cls} style={style} aria-disabled>
      {body}
    </div>
  );
};

const Hub = () => {
  const root = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = localStorage.getItem("strava_profile");
    if (p) {
      try {
        setProfile(JSON.parse(p));
      } catch {
        /* ignore malformed cache */
      }
    }
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hub-head", { autoAlpha: 0, y: 24, stagger: 0.1, duration: 0.7 })
          .from(
            ".hub-tile",
            { autoAlpha: 0, y: 40, scale: 0.97, stagger: 0.09, duration: 0.7, clearProps: "transform" },
            "-=0.35"
          );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const name = profile?.firstname ? String(profile.firstname).toUpperCase() : "ATHLETE";

  return (
    <main ref={root} className="relative min-h-screen overflow-hidden bg-[#05040a] text-white">
      <Starfield className="pointer-events-none absolute inset-0 h-full w-full" density={2.4} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(142,123,232,0.12),transparent_60%)]" />

      <Navigation />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-36">
        <span className="hub-head font-mono text-[11px] uppercase tracking-[0.35em] text-[#FFB84D]">
          / your dashboard
        </span>
        <h1 className="hub-head mt-4 font-grotesk text-5xl uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
          Hey {name},
          <br />
          <span className="font-condiment lowercase tracking-normal text-[#FFB84D]">where to?</span>
        </h1>
        <p className="hub-head mt-5 max-w-xl font-mono text-sm leading-relaxed text-white/60">
          Every part of your running story, in one place.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <Tile key={s.title} s={s} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Hub;
