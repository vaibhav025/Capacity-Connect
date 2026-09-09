import { motion, useReducedMotion } from "framer-motion";
export function AnimatedProgressRing({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const value = Math.round(
    Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0)),
  );
  return (
    <div
      role="progressbar"
      aria-label="Course completion"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="progress-ring"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="4"
        />
        <motion.circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span aria-hidden="true">{value}%</span>
    </div>
  );
}
