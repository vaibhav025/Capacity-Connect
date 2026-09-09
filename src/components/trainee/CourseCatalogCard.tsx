import { useReducedMotion } from "../../lib/motion";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  Clock3,
  Users,
} from "lucide-react";
import { learningContent } from "../../data/learning";
import { useState } from "react";
import { updateDemo, useDemo } from "../../lib/demoStore";
import { Link } from "react-router-dom";
import type { Course, Role } from "../../types/domain";
import { AnimatedButtons, spring } from "../ui/AnimatedButtons";
import { Tooltips } from "../ui/Tooltips";
import { AnimatedProgressRing } from "./AnimatedProgressRing";

export function CourseCatalogCard({
  course,
  role = "trainee",
}: {
  course: Course;
  role?: Role;
}) {
  const reduce = useReducedMotion();
  const { bookmarks } = useDemo();
  const saved = bookmarks.includes(course.id);
  const [status, setStatus] = useState("");
  const href = `/${role}/courses/${course.id}`;
  return (
    <motion.article
      className="course-card group relative h-full"
      whileHover={reduce ? undefined : { y: -3 }}
      transition={spring}
    >
      <div className="course-banner" style={{ backgroundColor: course.accent }}>
        <span>{course.category}</span>
        <BookOpen size={30} aria-hidden="true" />
        <div className="course-banner-grid" aria-hidden="true" />
        <div className="quick-actions">
          <Tooltips label={saved ? "Remove bookmark" : "Bookmark course"}>
            <AnimatedButtons
              className="bookmark-button"
              aria-label={saved ? "Remove bookmark" : "Bookmark course"}
              aria-pressed={saved}
              onClick={() => {
                try {
                  updateDemo((previous) => ({
                    ...previous,
                    bookmarks: saved
                      ? previous.bookmarks.filter((id) => id !== course.id)
                      : [...previous.bookmarks, course.id],
                  }));
                  setStatus(
                    saved
                      ? "Bookmark removed."
                      : "Course bookmarked in this browser.",
                  );
                } catch {
                  setStatus("Unable to save bookmark. Check browser storage.");
                }
              }}
            >
              {saved ? <Check size={17} /> : <Bookmark size={17} />}
            </AnimatedButtons>
          </Tooltips>
          <Link
            className="bookmark-button"
            to={href}
            aria-label={`Preview ${course.title}`}
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="course-card-body">
        <div className="flex items-center justify-between gap-3">
          <small className="course-code">{course.code}</small>
          <span className="pill">{course.level}</span>
        </div>
        <h3>
          <Link to={href}>{course.title}</Link>
        </h3>
        <p>
          {learningContent[course.id]?.outcome ||
            "Build practical capability through guided learning."}
        </p>
        <div className="course-meta">
          <span>
            <Clock3 size={14} /> {course.duration}
          </span>
          <span>
            <Users size={14} /> {course.learners} learners
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <small className="course-code">
              {role === "trainer" ? "LEARNER COMPLETION" : "YOUR LEARNING PATH"}
            </small>
            <div className="mt-1 text-xs text-slate-500">
              {course.progress === 100
                ? "Learning complete"
                : course.progress > 0
                  ? "Keep your momentum"
                  : "Your next opportunity"}
            </div>
          </div>
          <AnimatedProgressRing progress={course.progress} />
        </div>
        <motion.div
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={spring}
          className="mt-5"
        >
          <Link to={href} className="secondary wide">
            {role === "trainer"
              ? "Manage course"
              : course.progress === 100
                ? "Review course"
                : course.progress
                  ? "Continue learning"
                  : "Explore course"}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
        <span role="status" className="sr-only">
          {status}
        </span>
      </div>
    </motion.article>
  );
}
