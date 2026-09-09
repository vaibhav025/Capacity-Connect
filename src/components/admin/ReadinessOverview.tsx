import { useReducedMotion } from "../../lib/motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDemo, progressOf } from "../../lib/demoStore";
import { courses } from "../../data/demo";
import type { Role } from "../../types/domain";
import { TrainerSceneFallback } from "../3d/TrainerSceneFallback";
import { SceneBoundary } from "../3d/SceneBoundary";
const TrainerScene = lazy(() => import("../3d/TrainerScene"));
const stages = ["Learn", "Practice", "Assess", "Certify", "Grow"];
export function ReadinessOverview({ role }: { role: Role }) {
  const { learning } = useDemo();
  const target = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.15]);
  const nodeY = useTransform(scrollYProgress, [0, 0.35, 1], [0, -18, -40]);
  const boardOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.45, 0.8, 1],
    [0, 0, 1, 1, 0],
  );
  const radarOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.65, 1],
    [0.1, 0.1, 0.65, 0],
  );
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(
    () =>
      scrollYProgress.on("change", (value) =>
        setStage(Math.min(4, Math.floor(value * 5))),
      ),
    [scrollYProgress],
  );
  const enrolled = courses.filter((course) => learning[course.id]?.enrolled);
  const completed = enrolled.filter(
    (course) => progressOf(learning[course.id]) === 100,
  );
  const headline =
    role === "admin"
      ? "Build the expertise behind every forecast."
      : role === "trainer"
        ? "Turn expertise into field readiness."
        : "Your next skill. A stronger forecast.";
  return (
    <section
      ref={target}
      className="readiness-hero"
      aria-label="IMD learning mission"
    >
      <motion.div
        className="mission-grid"
        aria-hidden="true"
        style={reduce ? undefined : { y: gridY }}
      />
      <div className="readiness-copy">
        <motion.p
          className="eyebrow"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          IMD · MINISTRY OF EARTH SCIENCES
        </motion.p>
        <h2>
          {headline.split(/(?<=\.) /).map((line, i) => (
            <motion.span
              key={line}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {line}{" "}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {role === "admin"
            ? "Connect people, knowledge and demonstrated capability. Build a workforce ready for the next critical forecast."
            : role === "trainer"
              ? "Shape learning paths, guide your learners and turn specialist knowledge into measurable operational capability."
              : "Build practical expertise through guided learning, meaningful assessments and a visible record of your progress."}
        </motion.p>
        <motion.div
          className="mission-actions"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <Link className="primary" to={`/${role}/courses`}>
            Explore Learning <ArrowRight size={17} />
          </Link>
          <Link
            className="mission-link"
            to={
              role === "admin"
                ? "/admin/competency-mapping"
                : `/${role}/${role === "trainer" ? "performance" : "profile"}`
            }
          >
            {role === "admin"
              ? "View Competency Map"
              : role === "trainer"
                ? "View learner outcomes"
                : "View my skills"}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
        <div className="mission-trust">
          <span>
            <BookOpen />
            Structured learning
          </span>
          <span>
            <ShieldCheck />
            Verified assessments
          </span>
          <span>
            <Target />
            Competency tracking
          </span>
          <span>
            <Award />
            Digital certifications
          </span>
        </div>
      </div>
      <motion.div
        className="mission-visual"
        style={reduce ? undefined : { y, opacity }}
      >
        <div className="scene-coordinate">
          LEARNING SYSTEM / 28.61° N · 77.21° E
        </div>
        {desktop && !reduce ? (
          <SceneBoundary>
            <Suspense fallback={<TrainerSceneFallback />}>
              <TrainerScene progress={scrollYProgress} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <TrainerSceneFallback />
        )}
        <motion.div
          className="story-radar"
          aria-hidden="true"
          style={reduce ? { opacity: 0.15 } : { opacity: radarOpacity }}
        />
        <motion.div
          className="knowledge-node node-learn"
          style={reduce ? undefined : { y: nodeY }}
        >
          <BookOpen size={15} />
          <span>Courses & skills</span>
        </motion.div>
        <motion.div
          className="knowledge-node node-certify"
          style={reduce ? undefined : { y: nodeY }}
        >
          <ShieldCheck size={15} />
          <span>Assess & certify</span>
        </motion.div>
        {!reduce && (
          <motion.div
            className="story-board"
            aria-hidden="true"
            style={{ opacity: boardOpacity }}
          >
            <small>VIRTUAL LEARNING BOARD</small>
            <strong>Learn → Practice → Assess → Certify → Grow</strong>
          </motion.div>
        )}
        <div className="scene-evidence">
          <span className="status-dot" />
          <div>
            <small>Learning Readiness</small>
            <strong>
              {enrolled.length} paths enrolled{" "}
              <span> / {completed.length} complete</span>
            </strong>
          </div>
        </div>
        <div className="scene-caption">
          COMPETENCY GROWTH <span>Knowledge → operational readiness</span>
        </div>
      </motion.div>
      <div className="mission-journey" aria-label="Learning journey">
        <span>FROM LEARNING TO IMPACT</span>
        <ol>
          {stages.map((name, i) => (
            <li key={name} className={stage === i && !reduce ? "current" : ""}>
              <span>0{i + 1}</span>
              {name}
              {i < 4 && <ArrowRight size={13} />}
            </li>
          ))}
        </ol>
        <span className="journey-note">Your learning, connected.</span>
      </div>
    </section>
  );
}
