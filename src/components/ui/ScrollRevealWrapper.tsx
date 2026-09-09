import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type PropsWithChildren } from "react";

export function ScrollRevealWrapper({
  children,
  className = "",
  distance = 32,
}: PropsWithChildren<{ className?: string; distance?: number }>) {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [distance, 0, -distance / 3],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.15, 1, 1]);
  return (
    <div ref={target} className={className}>
      <motion.div style={reduce ? undefined : { y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
