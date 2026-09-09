import { CheckCircle2, ArrowRight, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../lib/motion";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageTitle } from "../components/ui/PageTitle";
import { AnimatedProgressRing } from "../components/trainee/AnimatedProgressRing";
import { courses } from "../data/demo";
import { learningContent } from "../data/learning";
import {
  emptyLearning,
  progressOf,
  saveLearning,
  useDemo,
} from "../lib/demoStore";
import type { Role } from "../types/domain";
export function CourseDetail({ role = "trainee" }: { role?: Role }) {
  const { id = "radar" } = useParams();
  const state = useDemo();
  const reduce = useReducedMotion();
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("");
  const course = courses.find((item) => item.id === id);
  if (!course)
    return (
      <section className="panel">
        <h1>Course not found</h1>
        <Link to={`/${role}/courses`}>Return to catalogue</Link>
      </section>
    );
  const content = learningContent[id];
  const learning = state.learning[id] || emptyLearning;
  const module = content.modules[selected];
  const save = (patch: Parameters<typeof saveLearning>[1]) => {
    try {
      saveLearning(id, patch);
      setStatus("Saved in this browser.");
    } catch {
      setStatus("Unable to save. Browser storage may be full or disabled.");
    }
  };
  return (
    <>
      <PageTitle
        kicker={course.code + " / GUIDED LEARNING"}
        title={course.title}
        desc={course.category + " · " + course.duration}
        action={
          role === "trainee" ? (
            <button
              className="primary"
              disabled={learning.enrolled}
              onClick={() => save({ enrolled: true })}
            >
              {learning.enrolled ? "Enrolled" : "Enroll in course"}
            </button>
          ) : (
            <span className="pill">Trainer preview</span>
          )
        }
      />
      <section className="learning-summary" aria-label="Learning outcome">
        <Target size={34} />
        <div>
          <h2>YOUR OPERATIONAL OUTCOME</h2>
          <p>{content.outcome}</p>
          <div className="skill-summary">
            <span>{course.tag}</span>
            <span>{course.level}</span>
            <span>3 field notes · 1 knowledge check</span>
          </div>
        </div>
      </section>
      <div className="learning-layout">
        <section className="panel learning-outline">
          <div className="panel-head">
            <div>
              <h3>Your learning path</h3>
              <p>3 field notes + 1 assessment</p>
            </div>
            <AnimatedProgressRing progress={progressOf(learning)} />
          </div>
          <button
            className="outline-toggle"
            aria-expanded={outlineOpen}
            aria-controls="course-module-list"
            onClick={() => setOutlineOpen(!outlineOpen)}
          >
            {outlineOpen ? "Hide modules" : "Show modules"}
            <span aria-hidden="true">{outlineOpen ? "-" : "+"}</span>
          </button>
          <AnimatePresence initial={false}>
            {outlineOpen && (
              <motion.div
                id="course-module-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {content.modules.map((item, index) => (
                  <button
                    key={item.title}
                    className={`lesson-step ${selected === index ? "selected" : ""} ${learning.completed.includes(index) ? "completed" : ""}`}
                    aria-pressed={selected === index}
                    onClick={() => setSelected(index)}
                  >
                    <span>
                      {learning.completed.includes(index) ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        "0" + (index + 1)
                      )}
                    </span>
                    <strong>{item.title}</strong>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {role === "trainee" && (
            <Link
              className="secondary wide mt-5"
              to={`/trainee/assessments?course=${id}`}
            >
              Knowledge check <ArrowRight size={16} />
            </Link>
          )}
          <p className="support-copy">
            Certificate eligibility: complete all three notes and score at least
            70% on this course’s knowledge check.
          </p>
        </section>
        <section className="panel lesson-reader">
          <span className="pill">FIELD NOTE {selected + 1} / 3</span>
          <h2>{module.title}</h2>
          <p>{module.body}</p>
          <div className="takeaway">
            <strong>Apply this in the field</strong>
            <p>{module.takeaway}</p>
          </div>
          <p className="support-copy">
            Illustrative prototype content. Operational training requires
            subject expert review.
          </p>
          {role === "trainee" && (
            <button
              className="primary"
              disabled={
                !learning.enrolled || learning.completed.includes(selected)
              }
              onClick={() =>
                save({
                  completed: [...new Set([...learning.completed, selected])],
                })
              }
            >
              {learning.completed.includes(selected)
                ? "Completed"
                : learning.enrolled
                  ? "Mark note complete"
                  : "Enroll to record progress"}
            </button>
          )}
          {selected < 2 && (
            <button
              className="secondary ml-3"
              onClick={() => setSelected(selected + 1)}
            >
              Next note <ArrowRight size={16} />
            </button>
          )}
          <p role="status" className="support-copy">
            {status}
          </p>
        </section>
      </div>
      {role === "trainee" && learning.enrolled && (
        <form
          className="panel feedback-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            save({
              feedback: {
                rating: Number(data.get("rating")),
                text: String(data.get("feedback")).trim(),
              },
            });
          }}
        >
          <h3>Help improve this training</h3>
          <div className="form-grid">
            <label>
              Course rating
              <select
                name="rating"
                defaultValue={learning.feedback?.rating || 5}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>
            <label>
              What worked, or could be better?
              <textarea
                name="feedback"
                required
                maxLength={1000}
                defaultValue={learning.feedback?.text || ""}
              />
            </label>
          </div>
          <button className="primary">Save feedback</button>
        </form>
      )}
    </>
  );
}
