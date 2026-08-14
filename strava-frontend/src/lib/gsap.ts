import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

/**
 * Reveals any `[data-reveal]` descendant of `scope` as it scrolls into view.
 * The attribute value is an optional per-element delay in seconds.
 * Respects `prefers-reduced-motion` (elements simply stay visible).
 */
export function useReveal(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = Array.from(
          root.querySelectorAll<HTMLElement>("[data-reveal]")
        );

        items.forEach((el) => {
          gsap.set(el, { autoAlpha: 0, y: 48 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(el, {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
                delay: Number(el.dataset.reveal) || 0,
              }),
          });
        });
      });

      return () => mm.revert();
    },
    { scope }
  );
}
