import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
      : "/" + role + "/courses";
  return (
    <motion.div
      className="stat-card group relative"
      whileHover={
        reduce
          ? undefined
          : { y: -5, scale: 1.02, boxShadow: "0 16px 35px #12344a15" }
      }
      transition={spring}
    >
      <div className={"stat-icon " + tone}>
        <Icon size={19} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
      <Link to={href} className="stat-quick" aria-label={"Explore " + label}>
        Explore ↗
      </Link>
    </motion.div>
  );
}
