import Lenis from "@studio-freight/lenis";
import { useEffect, type PropsWithChildren } from "react";

/** One scroll owner; keeps native touch, keyboard and reduced-motion scrolling. */
export function LenisSmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
    };
    const configure = () => {
      stop();
      if (preference.matches) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
      const tick = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      stop();
    };
  }, []);
  return <>{children}</>;
}
