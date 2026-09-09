import { useReducedMotion } from "../../lib/motion";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AnimatedCounter } from "./AnimatedCounter";
import { spring } from "./AnimatedButtons";
export function Stat({
  icon: Icon,
  label,
  value,
  meta,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  meta: string;
  tone?: string;
}) {
  const reduce = useReducedMotion();
  const role = useLocation().pathname.split("/")[1];
  const href =
    role === "admin"
      ? label.includes("approvals") || label.includes("users")
        ? "/admin/users"
        : "/admin/competency-mapping"
      : "/" +
        role +
        "/" +
        (label === "Assessments"
          ? "assessments"
          : label === "Certificates"
            ? "certificates"
            : role === "trainer" &&
                [
                  "Learners reached",
                  "Learner rating",
                  "Participation",
                  "Average score",
                  "Pass rate",
                ].includes(label)
              ? "performance"
              : "courses");
  return (
    <motion.div
      className="stat-card group relative"
      whileHover={reduce ? undefined : { y: -3 }}
      transition={spring}
    >
      <div className={"stat-icon " + tone}>
        <Icon size={19} />
      </div>
      <div>
        <span>{label}</span>
        <strong>
          <AnimatedCounter value={value} />
        </strong>
        <small>{meta}</small>
      </div>
      <Link to={href} className="stat-quick" aria-label={"Explore " + label}>
        Explore ↗
      </Link>
    </motion.div>
  );
}
