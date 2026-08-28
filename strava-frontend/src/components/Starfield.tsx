import { useEffect, useRef } from "react";

/**
 * Calm, space-like starfield. Stars drift very slowly and twinkle gently.
 * Canvas-based (one element, cheap), DPR-capped, pauses when the tab is hidden,
 * and renders a single static frame for reduced-motion users.
 */

interface Props {
  className?: string;
  /** star density per 10,000 px² (higher = more stars) */
  density?: number;
}

const Starfield = ({ className = "", density = 0.9 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = {
      x: number;
      y: number;
      r: number;
      base: number; // base brightness
      tw: number; // twinkle speed
      ph: number; // twinkle phase
      dx: number; // drift x
      dy: number; // drift y
      hue: string;
    };

    let stars: Star[] = [];
    let w = 0;
    let h = 0;

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w * h) / 10000 * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.4,
        base: Math.random() * 0.5 + 0.4,
        // wider twinkle range so some stars glimmer noticeably
        tw: Math.random() * 1.6 + 0.4,
        ph: Math.random() * Math.PI * 2,
        // gentle drift, px per second
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        hue: "255,255,255",
      }));
    };
    build();
    window.addEventListener("resize", build);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        // deeper twinkle range (0.2 → 1) so stars visibly glimmer in and out
        const flick = reduce ? 1 : 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tw + s.ph));
        const a = Math.min(1, s.base * flick);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.hue},${a})`;
        ctx.fill();
        // a soft glimmer halo, strongest at the peak of the twinkle
        if (s.r > 0.9) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.hue},${a * 0.12 * flick})`;
          ctx.fill();
        }
      }
    };

    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const s of stars) {
        s.x += s.dx * dt;
        s.y += s.dy * dt;
        // wrap around the edges
        if (s.x < -2) s.x = w + 2;
        else if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        else if (s.y > h + 2) s.y = -2;
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (raf === 0) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};

export default Starfield;
