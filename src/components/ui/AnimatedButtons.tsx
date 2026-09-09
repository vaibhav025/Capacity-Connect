import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
export const spring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 27,
  mass: 0.7,
};
export function AnimatedButtons({
  children,
  disabled,
  ...props
}: HTMLMotionProps<"button">) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      {...props}
      disabled={disabled}
      whileHover={reduce || disabled ? undefined : { y: -2 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
