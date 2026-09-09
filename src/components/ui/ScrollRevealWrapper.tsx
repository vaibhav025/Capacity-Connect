import { useReducedMotion } from "../../lib/motion";
import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
/** Shared viewport observers replace per-card scroll subscriptions. */
export function ScrollRevealWrapper({
  children,
  className = "",
  distance = 18,
  variant = "fade-up",
  delay = 0,
}: PropsWithChildren<{
  className?: string;
  distance?: number;
  delay?: number;
  variant?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-soft";
}>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              y: variant === "fade-up" ? distance : 0,
              x:
                variant === "slide-left"
                  ? distance
                  : variant === "slide-right"
                    ? -distance
                    : 0,
              scale: variant === "scale-soft" ? 0.98 : 1,
            }
      }
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduce ? 0 : 0.42,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
