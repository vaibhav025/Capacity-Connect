import { ArrowUpRight, ShieldCheck, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useDemo, progressOf } from "../../lib/demoStore";
import { courses } from "../../data/demo";
import type { Role } from "../../types/domain";
export function ReadinessOverview({ role }: { role: Role }) {
  const { learning } = useDemo();
  const enrolled = courses.filter((course) => learning[course.id]?.enrolled);
  const completed = enrolled.filter(
    (course) => progressOf(learning[course.id]) === 100,
  );
  return (
    <section className="readiness-hero">
      <div className="readiness-copy">
        <p className="eyebrow">CAPACITY TO CAPABILITY / IMD LEARNING MISSION</p>
        <h2>
          {role === "admin"
            ? "Build the expertise behind every forecast."
            : role === "trainer"
              ? "Turn your expertise into field readiness."
              : "Your next skill. A stronger forecast."}
        </h2>
        <p>
          {role === "admin"
            ? "Close the loop between a skill gap, the right trainer, and demonstrated learning."
            : "Learn the concepts, test your understanding, and build a visible record of progress."}
        </p>
        <Link
          className="mission-link"
          to={
            role === "admin"
              ? "/admin/competency-mapping"
              : "/" + role + "/courses"
          }
        >
          {role === "admin"
            ? "Match expertise to a training need"
            : "Open learning paths"}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="readiness-evidence">
        <span>
          <ShieldCheck size={17} /> DEMO LEARNING EVIDENCE
        </span>
        <div className="evidence-numbers">
          <div>
            <strong>{enrolled.length}</strong>
            <small>Paths enrolled</small>
          </div>
          <div>
            <strong>{completed.length}</strong>
            <small>Checks passed + paths complete</small>
          </div>
        </div>
        <p>
          <Target size={15} /> Evidence from the trainee workflow in this
          browser.
        </p>
      </div>
    </section>
  );
}
