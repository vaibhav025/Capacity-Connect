import { useReducedMotion } from "../../lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { type PropsWithChildren } from "react";
export function AnimatedPageTransition({
  children,
  pageKey,
}: PropsWithChildren<{ pageKey: string }>) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -6 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
