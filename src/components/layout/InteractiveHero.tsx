import { useEffect, useRef, type PropsWithChildren } from "react";

/** Isolated canvas host prevents Vanta from mutating React-owned content. */
export function InteractiveHero({ children }: PropsWithChildren) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let effect: VantaEffect | undefined;
    let generation = 0;
    let disposed = false;
    let visible = true;
    let failed = false;
    const destroy = () => {
      const current = effect;
      effect = undefined;
      if (!current) return;
      const renderer = current.renderer;
      try {
        current.destroy();
      } finally {
        renderer?.dispose();
        renderer?.forceContextLoss();
        element.replaceChildren();
      }
    };
    const reconcile = async () => {
      const request = ++generation;
      destroy();
      if (
        disposed ||
        failed ||
        preference.matches ||
        document.hidden ||
        !visible
      )
        return;
      try {
        const [THREE, { default: NET }] = await Promise.all([
          import("three"),
          import("vanta/dist/vanta.net.min.js"),
        ]);
        if (disposed || request !== generation) return;
        effect = NET({
          el: element,
          THREE,
          mouseControls: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: Math.max(1, window.devicePixelRatio || 1),
          scaleMobile: 2,
          color: 0x55b6bb,
          backgroundColor: 0x0d2c40,
          points: 8,
          maxDistance: 21,
          spacing: 18,
          showDots: true,
        });
      } catch (error) {
        failed = true;
        destroy();
        console.warn(
          "WebGL background unavailable; using the static background.",
          error,
        );
      }
    };
    const sync = () => {
      void reconcile();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      failed = true;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (visible !== entry.isIntersecting) {
        visible = entry.isIntersecting;
        sync();
      }
    });
    observer.observe(element);
    const resize = new ResizeObserver(() => effect?.resize());
    resize.observe(element);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    element.addEventListener("webglcontextlost", lost, true);
    sync();
    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.removeEventListener("webglcontextlost", lost, true);
      destroy();
    };
  }, []);
  return (
    <section className="login-art relative isolate overflow-hidden">
      <div
        ref={host}
        aria-hidden="true"
        className="hero-canvas absolute inset-0 -z-20"
      />
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
      {children}
    </section>
  );
}
