import Lenis from "@studio-freight/lenis";
import { useEffect, useRef, type PropsWithChildren } from "react";

import { useLocation } from "react-router-dom";

/** One scroll owner; keeps native touch, keyboard and reduced-motion scrolling. */
export function LenisSmoothScroll({ children }: PropsWithChildren) {
  const { pathname, hash } = useLocation();
  const instance = useRef<Lenis | undefined>(undefined);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const touch = matchMedia("(pointer: coarse)");
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
      instance.current = undefined;
    };
    const configure = () => {
      stop();
      if (preference.matches || touch.matches) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
      instance.current = lenis;
      const tick = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    configure();
    touch.addEventListener("change", configure);
    preference.addEventListener("change", configure);
    return () => {
      touch.removeEventListener("change", configure);
      preference.removeEventListener("change", configure);
      stop();
    };
  }, []);
  useEffect(() => {
    if (hash) return;
    instance.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return <>{children}</>;
}
