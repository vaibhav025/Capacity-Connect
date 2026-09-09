import { useReducedMotion } from "../../lib/motion";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
export function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    const match = value.match(/^([\d,.]+)(.*)$/);
    if (!element || !match || !visible || reduce) return;
    const target = Number(match[1].replaceAll(",", ""));
    const decimals = match[1].split(".")[1]?.length || 0;
    const control = animate(0, target, {
      duration: 0.85,
      ease: "easeOut",
      onUpdate: (number) => {
        element.textContent =
          number.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) + match[2];
      },
      onComplete: () => {
        element.textContent = value;
      },
    });
    return () => control.stop();
  }, [value, visible, reduce]);
  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" className="counter-value">
        {value}
      </span>
    </>
  );
}
