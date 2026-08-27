import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, RotateCcw, MapPin, Globe, Rocket, Flame, Zap,
  Trophy, Crown, Star, Medal,
} from "lucide-react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { getAthleteProfile, getAllActivities, getAthleteClubs } from "@/services/stravaAPI";
import { isMockMode, getMockProfile, getMockActivities, getMockClubs } from "@/utils/mockData";
import { assignAnimal } from "@/utils/animalPersonality";
import RunMapViz from "@/components/RunMapViz";
import maskImage from "@/assets/paoel.jpg";

const fmtPace = (paceMinPerKm: number) => {
  if (!paceMinPerKm || !isFinite(paceMinPerKm)) return "-";
  const m = Math.floor(paceMinPerKm);
  const s = Math.round((paceMinPerKm - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ---------- data ----------

const useWrapData = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (isMockMode()) {
        setProfile(getMockProfile());
        setActivities(getMockActivities());
        setClubs(getMockClubs());
        setLoading(false);
        return;
      }
      const prof = await getAthleteProfile();
      if (!prof) {
        setLoading(false);
        return;
      }
      setProfile(prof);
      setClubs((await getAthleteClubs()) || []);
      setActivities((await getAllActivities(2025)) || []);
      setLoading(false);
    };
    load();
  }, []);

  return { loading, profile, activities, clubs };
};

const useWrapStats = (activities: any[], profile: any) =>
  useMemo(() => {
    if (!activities.length) return null;

    const totalKm = activities.reduce((s, a) => s + (a.distance || 0), 0) / 1000;
    const totalMinutes = Math.floor(activities.reduce((s, a) => s + (a.moving_time || 0), 0) / 60);
    const calories = Math.round(activities.reduce((acc, c) => {
      if (c.calories) return acc + c.calories;
      if (c.kilojoules) return acc + c.kilojoules * 0.239;
      return acc + (c.distance || 0) / 1000 * 60;
    }, 0));
    const elevation = Math.round(activities.reduce((s, a) => s + (a.total_elevation_gain || 0), 0));

    const runs = activities.filter((a: any) => a.type === "Run");
    const paceOf = (a: any) => (a.moving_time / 60) / (a.distance / 1000);
    const fastest = [...runs].sort((a, b) => (b.average_speed || 0) - (a.average_speed || 0))[0];
    const topLongestRuns = [...runs].sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 3);
    const firstRun = [...runs].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];

    const monthMap: Record<number, number> = {};
    activities.forEach((a) => {
      const m = new Date(a.start_date_local).getMonth();
      monthMap[m] = (monthMap[m] || 0) + 1;
    });
    const bestMonthIdx = Object.entries(monthMap).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
    const bestMonthName = new Date(2025, Number(bestMonthIdx)).toLocaleString("en-US", { month: "long" });
    const bestMonthCount = monthMap[Number(bestMonthIdx)] || 0;

    const runDates = new Set(activities.map((a) => new Date(a.start_date_local).toISOString().split("T")[0]));

    const dates = activities.map((a) => new Date(a.start_date));
    const weeks = Math.max(1, Math.ceil(
      (Math.max(...dates.map((d) => d.getTime())) - Math.min(...dates.map((d) => d.getTime()))) / (1000 * 60 * 60 * 24 * 7)
    ));
    const avgPace = runs.length ? runs.reduce((s, a) => s + paceOf(a), 0) / runs.length : 10;
    const animal = assignAnimal(avgPace, totalKm / weeks);

    let beats = 0, steps = 0;
    activities.forEach((a) => {
      const mins = (a.moving_time || 0) / 60;
      beats += (a.average_heartrate || 150) * mins;
      const cadence = a.average_cadence || 0;
      steps += (cadence < 100 ? (cadence || 80) * 2 : cadence || 160) * mins;
    });

    return {
      totalKm, totalMinutes, calories, elevation, fastest, topLongestRuns, firstRun,
      bestMonthName, bestMonthCount, runDates, animal, weeks,
      beats: Math.round(beats), steps: Math.round(steps),
      city: profile?.city || "YOUR CITY",
    };
  }, [activities, profile]);

const useBadges = (activities: any[]) =>
  useMemo(() => {
    if (!activities.length) return [];
    const totalDistanceKm = activities.reduce((s, a) => s + (a.distance || 0), 0) / 1000;
    const totalRuns = activities.length;
    const longestRunKm = Math.max(...activities.map((a) => a.distance || 0)) / 1000;

    const uniqueDates = [...new Set(activities.map((a) => new Date(a.start_date_local).toISOString().split("T")[0]))].sort();
    let maxStreak = 0, current = 0, prev: string | null = null;
    for (const d of uniqueDates) {
      if (prev) {
        const diff = Math.ceil(Math.abs(new Date(d).getTime() - new Date(prev).getTime()) / 86400000);
        current = diff === 1 ? current + 1 : 1;
      } else current = 1;
      maxStreak = Math.max(maxStreak, current);
      prev = d;
    }

    return [
      { id: "dist_25", title: "25 KM CLUB", desc: "Total Distance", Icon: MapPin, color: "text-cyan-400", glow: "rgba(34,211,238,0.15)", unlocked: totalDistanceKm >= 25, current: totalDistanceKm, required: 25 },
      { id: "dist_50", title: "HALF CENTURY", desc: "50km Total", Icon: Globe, color: "text-blue-400", glow: "rgba(96,165,250,0.15)", unlocked: totalDistanceKm >= 50, current: totalDistanceKm, required: 50 },
      { id: "dist_100", title: "CENTURION", desc: "100km Total", Icon: Rocket, color: "text-purple-400", glow: "rgba(192,132,252,0.15)", unlocked: totalDistanceKm >= 100, current: totalDistanceKm, required: 100 },
      { id: "streak_5", title: "ON FIRE", desc: "5 Day Streak", Icon: Flame, color: "text-orange-400", glow: "rgba(251,146,60,0.15)", unlocked: maxStreak >= 5, current: maxStreak, required: 5 },
      { id: "streak_10", title: "UNSTOPPABLE", desc: "10 Day Streak", Icon: Zap, color: "text-yellow-400", glow: "rgba(250,204,21,0.15)", unlocked: maxStreak >= 10, current: maxStreak, required: 10 },
      { id: "single_5k", title: "5K FINISHER", desc: "Single Run", Icon: Trophy, color: "text-emerald-400", glow: "rgba(52,211,153,0.15)", unlocked: longestRunKm >= 5, current: longestRunKm, required: 5 },
      { id: "single_10k", title: "10K WARRIOR", desc: "Single Run", Icon: Crown, color: "text-indigo-400", glow: "rgba(129,140,248,0.15)", unlocked: longestRunKm >= 10, current: longestRunKm, required: 10 },
      { id: "runs_25", title: "REGULAR", desc: "25 Total Runs", Icon: Star, color: "text-violet-400", glow: "rgba(167,139,250,0.15)", unlocked: totalRuns >= 25, current: totalRuns, required: 25 },
      { id: "runs_50", title: "VETERAN", desc: "50 Total Runs", Icon: Medal, color: "text-rose-400", glow: "rgba(251,113,133,0.15)", unlocked: totalRuns >= 50, current: totalRuns, required: 50 },
    ];
  }, [activities]);

// ---------- card shells ----------

const cardBase =
  "wrap-card relative flex h-[min(82vh,700px)] shrink-0 flex-col overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#141317] will-change-transform";
const cardPad = "p-8 md:p-10";

// Option B (bold) pastel palettes: solid card colour + dark ink for text.
const BOLD_THEMES: Record<string, { bg: string; ink: string; sub: string }> = {
  mint: { bg: "#B8EAD6", ink: "#0E2A22", sub: "#2C5E4E" },
  peach: { bg: "#FFD3B6", ink: "#3A1A0E", sub: "#7A3A22" },
  lavender: { bg: "#D6CCF5", ink: "#221A3A", sub: "#4A3C7A" },
  sky: { bg: "#BEE1FF", ink: "#0E2338", sub: "#2C4E70" },
  butter: { bg: "#FFE9A8", ink: "#332800", sub: "#6E5510" },
};

const Card = ({ index, label, accent = "#FFB84D", children, wide = false, className = "", bold, fill = false }: {
  index: number; label: string; accent?: string; children: React.ReactNode; wide?: boolean; className?: string;
  /** Option B — set to a BOLD_THEMES key for a fully-coloured pastel card */
  bold?: keyof typeof BOLD_THEMES;
  /** fill = content spans the full card top→bottom (child controls distribution) instead of being vertically centred */
  fill?: boolean;
}) => {
  const theme = bold ? BOLD_THEMES[bold] : null;

  return (
    <article
      data-card
      data-bold={bold ? "" : undefined}
      className={`${cardBase} ${cardPad} ${wide ? "w-[min(96vw,1020px)]" : "w-[min(88vw,470px)]"} ${className}`}
      style={theme ? { background: theme.bg, borderColor: "rgba(0,0,0,0.08)", color: theme.ink } : undefined}
    >
      {theme ? (
        /* Option B: subtle paper texture + soft top light, everything else inherits dark ink */
        <>
          <div className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{ background: `radial-gradient(ellipse 90% 55% at 50% -10%, rgba(255,255,255,0.7), transparent 60%)` }} />
          <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.08]" />
        </>
      ) : (
        /* Option A: dark card with a tinted colour wash */
        <>
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${accent}2e 0%, #141317 58%)` }} />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 80% 45% at 50% 0%, ${accent}12, transparent 70%)` }} />
        </>
      )}

      {/* label row */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
        <span style={{ color: theme ? theme.sub : accent }}>/ {String(index).padStart(2, "0")}</span>
        <span style={theme ? { color: theme.sub, opacity: 0.75 } : undefined} className={theme ? "" : "text-white/35"}>{label}</span>
      </div>
      <div className={`relative z-10 mt-6 flex flex-1 flex-col ${fill ? "" : "justify-center"}`}>{children}</div>
    </article>
  );
};

// Stat card body: big number pinned to the top, a larger refined comparison
// panel pinned to the bottom — so the vertical space actually gets used.
const StatBody = ({ bold, eyebrow, value, unit, children }: {
  bold: keyof typeof BOLD_THEMES; eyebrow: string; value: React.ReactNode; unit: string; children: React.ReactNode;
}) => {
  const t = BOLD_THEMES[bold];
  return (
    <div className="flex h-full flex-col">
      <div className="pt-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: t.sub }}>{eyebrow}</p>
        <p className="mt-3 font-grotesk leading-[0.78] text-[clamp(5rem,15vh,9.5rem)]" style={{ color: t.ink }}>{value}</p>
        <p className="mt-1 font-condiment text-4xl md:text-5xl" style={{ color: t.sub }}>{unit}</p>
      </div>
      <div className="mt-auto rounded-3xl border border-black/10 bg-black/[0.06] p-6 md:p-7">
        {children}
      </div>
    </div>
  );
};

const Script = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-condiment text-[#FFB84D] ${className}`}>{children}</span>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">{children}</p>
);

// ---------- page ----------

const Wrap = () => {
  const { loading, profile, activities, clubs } = useWrapData();
  const stats = useWrapStats(activities, profile);
  const badges = useBadges(activities);
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapPointsRef = useRef<number[]>([]);
  const [active, setActive] = useState(0);

  const userName = profile?.firstname ? String(profile.firstname).toUpperCase() : "ATHLETE";
  const handle = profile?.username ? `@${profile.username}` : "@athlete";
  const cardCount = stats ? 20 : 0;

  const goTo = (i: number) => {
    const st = ScrollTrigger.getAll().find((t) => t.vars?.id === "wrapPin");
    if (!st || cardCount < 2) return;
    const clamped = Math.max(0, Math.min(cardCount - 1, i));
    const p = snapPointsRef.current[clamped] ?? clamped / (cardCount - 1);
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, cardCount]);

  // focus effect: one card at a time
  useEffect(() => {
    if (loading || !trackRef.current) return;
    const cards = trackRef.current.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((c, i) => {
      const d = Math.abs(i - active);
      gsap.to(c, {
        scale: d === 0 ? 1 : 0.85,
        autoAlpha: d === 0 ? 1 : d === 1 ? 0.25 : 0.08,
        filter: d === 0 ? "blur(0px)" : "blur(4px)",
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [active, loading, stats]);

  useGSAP(
    () => {
      if (loading || !stats || !trackRef.current) return;
      const track = trackRef.current;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const vw = () => window.innerWidth;
        const centerOf = (c: HTMLElement) => c.offsetLeft + c.offsetWidth / 2;
        const first = () => centerOf(cards[0]);
        const last = () => centerOf(cards[cards.length - 1]);
        // Total horizontal travel = distance between first and last card centres.
        const span = () => Math.max(1, last() - first());

        // Each card's snap progress = how far its centre sits between the
        // first and last centres. Evenly spaced, one entry per card.
        const computeSnapPoints = () => {
          const f = first();
          const sp = span();
          snapPointsRef.current = cards.map((c) => (centerOf(c) - f) / sp);
        };
        computeSnapPoints();

        // Start with card 1 centred, end with the last card centred.
        const tween = gsap.fromTo(
          track,
          { x: () => vw() / 2 - first() },
          {
            x: () => vw() / 2 - last(),
            ease: "none",
            scrollTrigger: {
              id: "wrapPin",
              trigger: rootRef.current,
              start: "top top",
              end: () => `+=${span()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onRefresh: computeSnapPoints,
              snap: {
                snapTo: (v: number) =>
                  snapPointsRef.current.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), 0),
                duration: { min: 0.2, max: 0.5 },
                ease: "power1.inOut",
              },
              onUpdate: (self) => {
                const pts = snapPointsRef.current;
                let nearest = 0;
                pts.forEach((p, i) => {
                  if (Math.abs(p - self.progress) < Math.abs(pts[nearest] - self.progress)) nearest = i;
                });
                setActive(nearest);
              },
            },
          }
        );

        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = parseFloat(el.dataset.count || "0");
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          const suffix = el.dataset.suffix || "";
          const obj = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            containerAnimation: tween,
            start: "left 95%",
            once: true,
            onEnter: () =>
              gsap.to(obj, {
                v: target,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent =
                    obj.v.toLocaleString("en-US", {
                      minimumFractionDigits: decimals,
                      maximumFractionDigits: decimals,
                    }) + suffix;
                },
              }),
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: parseFloat(el.dataset.grow || "0") / 100,
              transformOrigin: "left",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 95%", once: true },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [loading, stats] }
  );

  // ---------- render ----------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0d12]">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">/ loading</p>
          <p className="mt-3 font-grotesk text-4xl uppercase text-white">Your 2025 <Script className="text-5xl">receipts</Script></p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0e0d12] text-center text-white">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">/ empty</p>
        <p className="font-grotesk text-4xl uppercase">No 2025 runs found</p>
        <p className="font-mono text-sm text-white/50">Log a run on Strava and come back.</p>
        <Link to="/" className="mt-2 rounded-full bg-[#FFB84D] px-6 py-2 font-mono text-xs uppercase tracking-[0.2em] text-black">
          Back home
        </Link>
      </div>
    );
  }

  const s = stats;
  const longestKm = s.topLongestRuns[0] ? s.topLongestRuns[0].distance / 1000 : 0;
  const isMarathon = longestKm >= 15;
  const animalStats = ({ falcon: { speed: 95, stamina: 70, spirit: 85, habitat: "High Altitude" },
    cheetah: { speed: 100, stamina: 50, spirit: 80, habitat: "The Track" },
    wolf: { speed: 75, stamina: 90, spirit: 95, habitat: "Endless Roads" },
    dog: { speed: 60, stamina: 80, spirit: 100, habitat: "The Park" },
    turtle: { speed: 40, stamina: 100, spirit: 100, habitat: "The Long Haul" },
  } as any)[s.animal.id] || { speed: 50, stamina: 50, spirit: 50, habitat: "Unknown" };

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const year = 2025;

  return (
    <main ref={rootRef} className="relative h-screen w-full overflow-hidden bg-[#0e0d12] text-white">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-[0.3em] md:px-10">
        <div className="flex items-center gap-4">
          <span className="text-white/70">{handle}</span>
          <span className="text-[#FFB84D]">/ 2025 wrapped</span>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {Array.from({ length: cardCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-[#FFB84D]" : "w-1 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </nav>
      </header>

      {/* horizontal track */}
      <div className="flex h-full items-center overflow-hidden">
        <div ref={trackRef} className="flex items-center gap-[6vw] px-[14vw] will-change-transform">

          {/* 1 · INTRO */}
          <Card index={1} label="The intro">
            <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-[0.12] mix-blend-soft-light"
              style={{ backgroundImage: `url(${maskImage})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(60%)" }} />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/50">Hey</p>
              <h1 className="mt-2 font-grotesk text-6xl uppercase leading-[0.95] text-white md:text-7xl">{userName}</h1>
              <p className="mt-4 font-condiment text-4xl text-[#FFB84D] md:text-5xl">let's see how your 2025 ran.</p>
              <div className="mt-10 space-y-2 font-grotesk text-2xl uppercase text-white/80">
                <p>Every mile.</p>
                <p>Every choice.</p>
                <p className="text-[#FFB84D]">Every time you showed up.</p>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              <span className="h-px w-8 bg-white/15" />
              scroll <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
            </div>
          </Card>

          {/* 2 · DISTANCE — Option B (bold: mint) */}
          <Card index={2} label="Distance" bold="mint" fill>
            <StatBody bold="mint" eyebrow="Total distance" unit="kilometers"
              value={<span data-count={s.totalKm} data-decimals="1">0</span>}>
              <div className="flex items-start gap-4">
                <span className="text-4xl md:text-5xl">🏯</span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#2C5E4E]">Great Wall of China</p>
                  <p className="mt-2 font-grotesk text-3xl leading-none text-[#0E2A22] md:text-4xl">
                    {((s.totalKm / 21196) * 100).toFixed(2)}%{" "}
                    <span className="font-condiment text-2xl text-[#2C5E4E] md:text-3xl">conquered</span>
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#0E2A22]/75">
                    {s.totalKm.toFixed(0)} of 21,196 km — only {Math.max(0, 21196 - s.totalKm).toFixed(0)} km to go 🥟
                  </p>
                </div>
              </div>
            </StatBody>
          </Card>

          {/* 3 · TIME — Option B (bold: sky) */}
          <Card index={3} label="Time on feet" bold="sky">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#2C4E70]">Time on feet</p>
            <div className="mt-3 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <p className="font-grotesk text-[100px] leading-none text-[#0E2338] md:text-[120px]">{Math.floor(s.totalMinutes / 60)}</p>
                <span className="font-mono text-xl text-[#0E2338]/40">h</span>
                <p className="font-grotesk text-[100px] leading-none text-[#0E2338] md:text-[120px]">{s.totalMinutes % 60}</p>
                <span className="font-mono text-xl text-[#0E2338]/40">m</span>
              </div>
              <p className="font-condiment text-4xl text-[#2C4E70]">pure grind</p>
            </div>
            <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.04] p-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md border border-black/10">
                  <img src="https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" alt="Inception" className="h-full w-full object-cover" />
                </div>
                <p className="font-mono text-sm text-[#0E2338]/80">
                  Like watching <span className="font-bold text-[#0E2338]">Inception</span>{" "}
                  <span className="font-bold text-[#0E2338]">{(s.totalMinutes / 148).toFixed(1)}×</span>
                </p>
              </div>
              <p className="mt-3 font-mono text-xs italic text-[#0E2338]/55">"You mustn't be afraid to dream a little bigger, darling."</p>
            </div>
          </Card>

          {/* 4 · CALORIES — Option B (bold: peach) */}
          <Card index={4} label="Energy" bold="peach" fill>
            <StatBody bold="peach" eyebrow="Energy burned" unit="calories"
              value={<span data-count={s.calories}>0</span>}>
              <div className="flex items-start gap-4">
                <span className="text-4xl md:text-5xl">🍕</span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#7A3A22]">The pizza index</p>
                  <p className="mt-2 font-grotesk text-3xl leading-none text-[#3A1A0E] md:text-4xl">
                    {Math.floor(s.calories / 285)}{" "}
                    <span className="font-condiment text-2xl text-[#7A3A22] md:text-3xl">slices earned</span>
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#3A1A0E]/75">
                    That's {Math.floor(s.calories / (285 * 8))} whole pizzas. Bon appétit 🇮🇹
                  </p>
                </div>
              </div>
            </StatBody>
          </Card>

          {/* 5 · LONGEST RUN — Option B (bold: butter) */}
          <Card index={5} label="Longest run" bold="butter" fill>
            <StatBody bold="butter" eyebrow="Your longest run" unit="kilometers"
              value={<span data-count={longestKm} data-decimals="1">0</span>}>
              <div className="flex items-start gap-4">
                <span className="text-4xl md:text-5xl">{isMarathon ? "🏅" : "🌉"}</span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#6E5510]">{isMarathon ? "Marathon master" : "Bridge conqueror"}</p>
                  <p className="mt-2 font-grotesk text-3xl leading-none text-[#332800] md:text-4xl">
                    {isMarathon ? (longestKm / 42.2).toFixed(1) : (longestKm / 2.7).toFixed(1)}×{" "}
                    <span className="font-condiment text-2xl text-[#6E5510] md:text-3xl">{isMarathon ? "a marathon" : "the bridge"}</span>
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#332800]/75">
                    {isMarathon ? "A full 42.2 km — Athens is calling 🇬🇷" : "The Golden Gate is 2.7 km 🌁"}
                  </p>
                </div>
              </div>
            </StatBody>
          </Card>

          {/* 6 · FASTEST */}
          <Card index={6} label="Fastest run" accent="#b18cff">
            <Label>Your fastest pace</Label>
            <div className="mt-3 text-center">
              <p className="font-grotesk text-[100px] leading-none text-white md:text-[120px]">
                {s.fastest ? fmtPace(16.666666666667 / s.fastest.average_speed) : "-"}
              </p>
              <p className="font-condiment text-4xl text-[#b18cff]">min/km</p>
            </div>
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🦖</span>
                <p className="font-mono text-sm text-white/70">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#b18cff]">Danger zone</span>
                  At <span className="text-white">{s.fastest ? (s.fastest.average_speed * 3.6).toFixed(1) : "-"} km/h</span> you could outrun a T-Rex 🦕
                </p>
              </div>
            </div>
          </Card>

          {/* 7 · FIRST RUN */}
          <Card index={7} label="Where it began" accent="#4cc9f0" wide>
            <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="relative aspect-square max-h-[420px] w-full overflow-hidden rounded-2xl border border-[#4cc9f0]/25 bg-[#020617]">
                {s.firstRun?.map?.summary_polyline && (
                  <div className="absolute inset-0 opacity-90 mix-blend-screen contrast-125 brightness-110">
                    <RunMapViz activity={s.firstRun} />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#4cc9f0] backdrop-blur">
                  First run map
                </div>
              </div>
              <div className="space-y-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#4cc9f0]">
                  {new Date(s.firstRun.start_date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h3 className="font-grotesk text-4xl uppercase leading-tight text-white md:text-5xl">{s.firstRun.name}</h3>
                <p className="font-condiment text-3xl text-[#FFB84D]">"the journey of a thousand miles begins with a single step."</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                    <Label>Distance</Label>
                    <p className="mt-1 font-grotesk text-3xl text-white">{(s.firstRun.distance / 1000).toFixed(2)} <span className="text-base text-white/40">km</span></p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                    <Label>Time</Label>
                    <p className="mt-1 font-grotesk text-3xl text-white">{(s.firstRun.moving_time / 60).toFixed(0)} <span className="text-base text-white/40">min</span></p>
                  </div>
                </div>
                <p className="font-mono text-xs text-white/50">
                  You didn't know it then, but you were starting something <span className="text-[#4cc9f0]">legendary</span>.
                </p>
              </div>
            </div>
          </Card>

          {/* 8 · BIGGEST MONTH — Option B (bold: lavender) */}
          <Card index={8} label="Peak month" bold="lavender">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#4A3C7A]">Peak performance</p>
            <div className="mt-4 text-center">
              <span className="text-5xl">📅</span>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-[#4A3C7A]">Your biggest month</p>
              <h2 className="mt-2 font-grotesk text-6xl uppercase text-[#221A3A] md:text-7xl">{s.bestMonthName}</h2>
              <p className="mt-3 font-condiment text-4xl text-[#4A3C7A]">{s.bestMonthCount} runs</p>
            </div>
          </Card>

          {/* 9 · YEAR IN PIXELS */}
          <Card index={9} label="Year in pixels" accent="#ccff00" wide>
            <div className="flex items-end justify-between border-b border-white/[0.07] pb-4">
              <div>
                <Label>Level progress</Label>
                <h2 className="mt-1 font-grotesk text-4xl uppercase text-white">Year in pixels <span className="ml-1">👾</span></h2>
              </div>
              <div className="text-right">
                <Label>Active days</Label>
                <p className="font-grotesk text-3xl text-[#ccff00]">{activities.length}</p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-3 gap-2 overflow-y-auto py-4 md:grid-cols-4 lg:grid-cols-6">
              {months.map((month, mIdx) => {
                const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
                const runCount = activities.filter((a) => new Date(a.start_date_local).getMonth() === mIdx).length;
                const hasRuns = runCount > 0;
                return (
                  <div key={month} className={`group rounded-xl border p-2 transition-colors duration-300 ${hasRuns ? "border-[#ccff00]/25 hover:border-[#ccff00]/70" : "border-white/[0.06]"} bg-white/[0.02]`}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className={`font-grotesk text-sm uppercase ${hasRuns ? "text-[#ccff00]" : "text-white/30"}`}>{month}</span>
                      <span className="rounded bg-black/40 px-1 font-mono text-[9px] text-white/50">{runCount}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-[2px]">
                      {[...Array(daysInMonth)].map((_, dIdx) => {
                        const dateStr = `${year}-${String(mIdx + 1).padStart(2, "0")}-${String(dIdx + 1).padStart(2, "0")}`;
                        const isRunDay = s.runDates.has(dateStr);
                        return (
                          <div
                            key={dIdx}
                            className={`aspect-square rounded-[2px] transition-all duration-300 ${
                              isRunDay ? "bg-[#ccff00] shadow-[0_0_4px_#ccff00]" : "bg-white/[0.06] group-hover:bg-white/10"
                            }`}
                            title={dateStr}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mx-auto flex w-fit items-center gap-6 rounded-full border border-white/[0.07] bg-white/[0.02] px-5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-white/10" /> rest day</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-[#ccff00]" /> run day</span>
            </div>
          </Card>

          {/* 10-12 · TOP 3 LONGEST RUNS */}
          {s.topLongestRuns.map((run: any, index: number) => {
            const accents = ["#ff4d8d", "#5b8cff", "#ff9838"];
            const medals = ["👑", "🥈", "🥉"];
            return (
              <Card key={run.id} index={10 + index} label={`Greatest runs · #${index + 1}`} accent={accents[index]}>
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{medals[index]}</span>
                  <span className="font-grotesk text-5xl text-white/10">#{index + 1}</span>
                </div>
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {new Date(run.start_date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                  <h3 className="mt-2 line-clamp-3 font-grotesk text-3xl uppercase leading-tight text-white">"{run.name}"</h3>
                </div>
                <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <p className="font-grotesk text-5xl text-white">
                    {(run.distance / 1000).toFixed(1)} <span className="text-xl text-white/40">km</span>
                  </p>
                  <div className="mt-3 flex justify-between border-t border-white/[0.07] pt-3 font-mono text-xs text-white/50">
                    <span>time <span className="text-white">{(run.moving_time / 60).toFixed(0)} min</span></span>
                    <span>pace <span className="text-white">{fmtPace((run.moving_time / 60) / (run.distance / 1000))} /km</span></span>
                  </div>
                </div>
                <p className="mt-5 font-condiment text-2xl text-white/60">
                  {index === 0 ? "the absolute limit — further than ever before."
                    : index === 1 ? "so close to the top. a massive effort."
                    : "a run to remember. pure endurance."}
                </p>
              </Card>
            );
          })}

          {/* 13 · ELEVATION — Option B (bold: mint) */}
          <Card index={13} label="Vertical limit" bold="mint" fill>
            <StatBody bold="mint" eyebrow="Total elevation gain" unit="meters climbed"
              value={<><span data-count={s.elevation}>0</span><span className="text-[0.45em] text-[#0E2A22]/45">m</span></>}>
              <div className="flex items-start gap-4">
                <span className="text-4xl md:text-5xl">🧗</span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#2C5E4E]">Qutub Minar climbs</p>
                  <p className="mt-2 font-grotesk text-3xl leading-none text-[#0E2A22] md:text-4xl">
                    {(s.elevation / 73).toFixed(1)}×{" "}
                    <span className="font-condiment text-2xl text-[#2C5E4E] md:text-3xl">the tower</span>
                  </p>
                  <p className="mt-2 font-mono text-sm text-[#0E2A22]/75">
                    You gained {s.elevation.toLocaleString()} m of vertical this year.
                  </p>
                </div>
              </div>
            </StatBody>
          </Card>

          {/* 14 · BODY */}
          <Card index={14} label="The engine" accent="#ff4d6d">
            <Label>Your body did this</Label>
            <div className="mt-4 text-center text-6xl">🫀</div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-center">
                <Label>Heart beats</Label>
                <p className="mt-1 font-grotesk text-4xl text-white">~<span data-count={s.beats}>0</span></p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-center">
                <Label>Steps taken</Label>
                <p className="mt-1 font-grotesk text-4xl text-[#ff4d6d]">~<span data-count={s.steps}>0</span></p>
              </div>
            </div>
          </Card>

          {/* 15 · HALL OF FAME */}
          <Card index={15} label="Hall of fame" accent="#4cc9f0" wide>
            <div className="text-center">
              <h2 className="font-grotesk text-4xl uppercase text-white">Hall of Fame</h2>
              <p className="mt-1 font-mono text-xs text-white/40">every drop of sweat, every kilometer, every streak.</p>
            </div>
            <div className="grid flex-1 grid-cols-3 items-center gap-x-4 gap-y-6 py-2 md:grid-cols-5">
              {badges.map((badge) => (
                <div key={badge.id} className={`group flex flex-col items-center transition-all duration-300 ${badge.unlocked ? "" : "opacity-35 grayscale"}`}>
                  <div
                    className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.08] transition-transform duration-300 group-hover:scale-110 md:h-24 md:w-24"
                    style={{ background: badge.unlocked ? `radial-gradient(circle at 50% 30%, ${badge.glow}, rgba(255,255,255,0.02))` : "rgba(255,255,255,0.02)" }}
                  >
                    <badge.Icon className={`h-9 w-9 ${badge.unlocked ? badge.color : "text-white/25"}`} />
                    {!badge.unlocked && (
                      <div className="absolute -bottom-1 left-1/2 h-1 w-14 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-white/40" style={{ width: `${Math.min(100, (badge.current / badge.required) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                  <h3 className={`font-grotesk text-sm uppercase ${badge.unlocked ? "text-white" : "text-white/30"}`}>{badge.title}</h3>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{badge.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 16 · THE NUMBERS */}
          <Card index={16} label="The numbers" accent="#FFB84D" wide>
            <div className="text-center">
              <Label>Not just kilometers. Not just calories.</Label>
              <p className="mt-4 font-grotesk text-[130px] leading-none text-white md:text-[170px]">
                <span data-count={activities.length}>0</span>
              </p>
              <p className="font-condiment text-4xl text-[#FFB84D] md:text-5xl">moments you chose yourself.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: s.totalKm.toFixed(1), l: "Kilometers", c: "#4cc9f0" },
                { v: String(s.totalMinutes), l: "Minutes", c: "#ff4d8d" },
                { v: "0", l: "Regrets", c: "#FFB84D" },
              ].map((tile) => (
                <div key={tile.l} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-center transition-transform hover:-translate-y-1">
                  <p className="font-grotesk text-4xl md:text-5xl" style={{ color: tile.c }}>{tile.v}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{tile.l}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 17 · MOST EPIC RUN */}
          <Card index={17} label="Most epic run" accent="#FFB84D" wide className="!p-0">
            <div className="absolute inset-0">
              {s.topLongestRuns[0]?.map?.summary_polyline && (
                <div className="absolute inset-0 opacity-85 transition-opacity duration-700 hover:opacity-100">
                  <RunMapViz activity={s.topLongestRuns[0]} />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#141317]/90 via-transparent to-[#0e0d12]" />
            </div>
            <div className="relative z-10 px-8 pt-4 md:px-10">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
                <span className="text-[#FFB84D]">/ 17</span>
                <span className="text-white/50">Most epic run · the path where you pushed your limits</span>
              </div>
            </div>
            <div className="relative z-10 mt-auto px-8 pb-8 md:px-10">
              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { l: "Activity", v: s.topLongestRuns[0]?.name || "Run", c: "text-white" },
                  { l: "Distance", v: `${(s.topLongestRuns[0]?.distance / 1000).toFixed(2)} km`, c: "text-[#4cc9f0]" },
                  { l: "Time", v: `${(s.topLongestRuns[0]?.moving_time / 60).toFixed(0)} min`, c: "text-[#ff4d8d]" },
                  { l: "Pace", v: `${fmtPace((s.topLongestRuns[0]?.moving_time / 60) / (s.topLongestRuns[0]?.distance / 1000))} /km`, c: "text-[#ccff00]" },
                  { l: "Elevation", v: `+${s.topLongestRuns[0]?.total_elevation_gain} m`, c: "text-[#c084fc]" },
                ].map((chip) => (
                  <div key={chip.l} className="min-w-[90px] flex-1 rounded-xl border border-white/10 bg-black/50 p-2.5 backdrop-blur-md">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{chip.l}</p>
                    <p className={`truncate font-mono text-sm font-bold ${chip.c}`}>{chip.v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FFB84D] p-2 text-black">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="font-grotesk text-3xl uppercase text-white md:text-5xl">{s.city}</h2>
                <p className="font-condiment text-3xl text-[#FFB84D]">you left your mark.</p>
              </div>
            </div>
          </Card>

          {/* 18 · CLUB */}
          <Card index={18} label="The family" accent="#c084fc">
            {clubs.length > 0 ? (
              <div className="text-center">
                <Crown className="mx-auto h-12 w-12 text-[#FFB84D]" />
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-white/40">The family you found</p>
                <h2 className="mt-3 font-grotesk text-4xl uppercase text-white">'{clubs[0].name}'</h2>
                <p className="mt-4 font-mono text-sm text-white/60">They saw you grind. They witnessed the journey.</p>
                <p className="mt-6 font-condiment text-4xl text-[#c084fc]">you're family.</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/40">No family yet</p>
                <h2 className="mt-3 font-grotesk text-4xl uppercase text-white">Running alone is cool.</h2>
                <p className="mt-2 font-mono text-sm text-white/60">But running with us is better.</p>
                <Link to="/" className="mt-6 inline-block rounded-full border border-[#FFB84D]/50 px-6 py-2 font-mono text-xs uppercase tracking-[0.25em] text-[#FFB84D] transition-colors hover:bg-[#FFB84D] hover:text-black">
                  Join ours
                </Link>
              </div>
            )}
          </Card>

          {/* 19 · ANIMAL PERSONALITY */}
          <Card index={19} label="Running soul" accent="#FFB84D" wide>
            <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="relative mx-auto max-w-[260px]">
                <div className="absolute inset-0 rounded-full bg-[#FFB84D]/10 blur-[70px]" />
                <img
                  src={s.animal.image}
                  alt={s.animal.animal}
                  className="relative w-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/800x800/1a1a1a/ffffff/png?text=${s.animal.animal.replace(/ /g, "+")}`;
                  }}
                />
              </div>
              <div className="space-y-5">
                <div>
                  <Label>Rare species detected</Label>
                  <h3 className="mt-1 font-grotesk text-5xl uppercase leading-none text-white">{s.animal.name}</h3>
                  <p className="mt-2 font-condiment text-2xl text-[#FFB84D]">"{s.animal.desc}"</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                    Habitat: <span className="text-white">{animalStats.habitat}</span>
                  </div>
                  {[
                    { label: "Speed", val: animalStats.speed, col: "#4cc9f0" },
                    { label: "Stamina", val: animalStats.stamina, col: "#f5c518" },
                    { label: "Spirit", val: animalStats.spirit, col: "#ff4d8d" },
                  ].map((b) => (
                    <div key={b.label} className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/50">
                        <span>{b.label}</span><span>{b.val}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full" data-grow={b.val} style={{ width: `${b.val}%`, background: b.col, boxShadow: `0 0 8px ${b.col}66` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { icon: "🦅", name: "FALCON", req: "< 4:30/km" },
                { icon: "🐆", name: "CHEETAH", req: "< 5:30/km" },
                { icon: "🐺", name: "WOLF", req: "< 6:30/km" },
                { icon: "🐕", name: "DOG", req: "< 7:30/km" },
                { icon: "🐢", name: "TURTLE", req: "Any pace" },
              ].map((tier) => (
                <div key={tier.name} className={`rounded-xl border p-2 text-center transition-all ${
                  s.animal.animal.toUpperCase().includes(tier.name)
                    ? "border-[#FFB84D]/60 bg-[#FFB84D]/10"
                    : "border-white/[0.06] bg-white/[0.02] opacity-40 hover:opacity-80"
                }`}>
                  <div className="text-xl">{tier.icon}</div>
                  <h4 className="font-grotesk text-xs uppercase text-white/80">{tier.name}</h4>
                  <p className="font-mono text-[8px] uppercase text-white/40">{tier.req}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 20 · FINALE — Option B (bold: lavender) */}
          <Card index={20} label="The finale" bold="lavender" wide>
            <div className="relative text-center">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#4A3C7A]">2025 was just the beginning</p>
              <h2 className="mt-4 font-grotesk text-8xl uppercase text-[#221A3A] md:text-9xl">2026?</h2>
              <p className="mt-2 font-condiment text-5xl text-[#4A3C7A] md:text-6xl">that's your year.</p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[#221A3A]/60">See you on the road, champion.</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/cards"
                  className="rounded-full bg-[#221A3A] px-8 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#D6CCF5] transition-transform hover:scale-105 active:scale-95"
                >
                  Checkout your card →
                </Link>
                <button
                  onClick={() => goTo(0)}
                  className="flex items-center gap-2 rounded-full border border-[#221A3A]/25 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#221A3A]/70 transition-colors hover:border-[#221A3A] hover:text-[#221A3A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Replay
                </button>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* bottom nav */}
      <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-6 py-4 md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
          {String(active + 1).padStart(2, "0")} / {String(cardCount).padStart(2, "0")} · ← → keys
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous card"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#141317]/80 backdrop-blur transition-all hover:border-[#FFB84D] hover:text-[#FFB84D] disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo(active + 1)}
            disabled={active === cardCount - 1}
            aria-label="Next card"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#141317]/80 backdrop-blur transition-all hover:border-[#FFB84D] hover:text-[#FFB84D] disabled:opacity-25"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </main>
  );
};

export default Wrap;
