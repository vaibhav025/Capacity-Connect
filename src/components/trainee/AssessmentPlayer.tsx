import { useReducedMotion } from "../../lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { emptyLearning, saveLearning, useDemo } from "../../lib/demoStore";
import { AnimatedButtons } from "../ui/AnimatedButtons";
const questions = [
  {
    prompt:
      "Which radar product measures motion towards or away from the radar?",
    options: ["Radial velocity", "Reflectivity"],
    correct: 0,
  },
  {
    prompt: "What does a strong reflectivity return usually indicate?",
    options: ["No precipitation", "Larger or more numerous hydrometeors"],
    correct: 1,
  },
];
export function AssessmentPlayer({ courseId }: { courseId?: string }) {
  const state = useDemo();
  const [error, setError] = useState("");
  const learning = state.learning[courseId || ""] || emptyLearning;
  const courseQuestions =
    courseId && courseId !== "radar"
      ? {
          satellite: [
            {
              prompt: "Which imagery depends on reflected sunlight?",
              options: ["Visible imagery", "Thermal infrared imagery"],
              correct: 0,
            },
            {
              prompt:
                "Can cloud-top temperature alone determine surface rainfall?",
              options: ["Yes, always", "No, additional evidence is needed"],
              correct: 1,
            },
          ],
          nwp: [
            {
              prompt: "What can influence forecast evolution?",
              options: [
                "Errors in initial conditions",
                "Only the display colour",
              ],
              correct: 0,
            },
            {
              prompt: "What does an ensemble explore?",
              options: [
                "One guaranteed outcome",
                "A range of possible evolutions",
              ],
              correct: 1,
            },
          ],
          cyclone: [
            {
              prompt: "Are track and intensity separate forecast dimensions?",
              options: ["Yes", "No"],
              correct: 0,
            },
            {
              prompt: "What should guide operational decisions?",
              options: [
                "An undated screenshot",
                "Current approved official bulletins",
              ],
              correct: 1,
            },
          ],
        }[courseId] || questions
      : questions;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const reduce = useReducedMotion();
  if (courseId && (!learning.enrolled || learning.completed.length < 3))
    return (
      <section className="panel">
        <h3>Complete your learning notes first</h3>
        <p className="support-copy">
          Enroll and complete all three notes to unlock this recorded knowledge
          check.
        </p>
        <Link className="primary" to={`/trainee/courses/${courseId}`}>
          Return to learning path
        </Link>
      </section>
    );
  if (index === courseQuestions.length)
    return (
      <section className="panel assessment-result" role="status">
        <Award size={48} strokeWidth={1.25} />
        <h3>{courseId ? "Knowledge check complete" : "Practice complete"}</h3>
        <p className="my-4">
          {
            answers.filter((answer, i) => answer === courseQuestions[i].correct)
              .length
          }{" "}
          of {courseQuestions.length} correct.{" "}
          {courseId
            ? "Result saved in this browser."
            : "This practice result is not recorded."}
        </p>
        {courseId && learning.score !== undefined && learning.score >= 70 && (
          <Link className="primary mr-3" to="/trainee/certificates">
            View earned certificate
          </Link>
        )}
        {courseId && learning.score !== undefined && learning.score < 70 && (
          <p className="support-copy">
            70% required. Review the notes and try again.
          </p>
        )}
        <AnimatedButtons
          className="secondary"
          onClick={() => {
            setIndex(0);
            setAnswers([]);
          }}
        >
          Try again
        </AnimatedButtons>
      </section>
    );
  return (
    <section className="panel assessment-focus">
      <div className="assessment-meta">
        <span>{courseQuestions.length} questions</span>
        <span>Untimed knowledge check</span>
        <span>70% to pass</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={courseQuestions.length}
        aria-valuenow={answers.filter((answer) => answer !== undefined).length}
      >
        <i
          style={{
            width: `${(answers.filter((answer) => answer !== undefined).length / courseQuestions.length) * 100}%`,
          }}
        />
      </div>
      <div className="question-nav" aria-label="Question navigator">
        {courseQuestions.map((_, question) => (
          <button
            key={question}
            aria-label={`Go to question ${question + 1}`}
            aria-current={index === question ? "step" : undefined}
            onClick={() => setIndex(question)}
          >
            {question + 1}
          </button>
        ))}
      </div>
      <p className="eyebrow mb-4">
        {courseId ? "RECORDED DEMO CHECK" : "PRACTICE"} · {index + 1} /{" "}
        {courseQuestions.length}
      </p>
      <AnimatePresence mode="wait">
        <motion.fieldset
          key={index}
          initial={{ opacity: 0, x: reduce ? 0 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
        >
          <legend className="mb-4 font-semibold">
            {courseQuestions[index].prompt}
          </legend>
          {courseQuestions[index].options.map((option, choice) => (
            <label key={option} className="practice-option">
              <input
                type="radio"
                name={`question-${index}`}
                checked={answers[index] === choice}
                onChange={() =>
                  setAnswers((previous) => {
                    const next = [...previous];
                    next[index] = choice;
                    return next;
                  })
                }
              />
              {option}
            </label>
          ))}
        </motion.fieldset>
      </AnimatePresence>
      <AnimatedButtons
        className="primary mt-5"
        disabled={
          answers[index] === undefined ||
          (index === courseQuestions.length - 1 &&
            answers.filter((answer) => answer !== undefined).length <
              courseQuestions.length)
        }
        onClick={() => {
          if (courseId && index === courseQuestions.length - 1) {
            const score = Math.round(
              (answers.filter(
                (answer, i) => answer === courseQuestions[i].correct,
              ).length /
                courseQuestions.length) *
                100,
            );
            try {
              saveLearning(courseId, {
                score,
                issuedAt:
                  score >= 70
                    ? learning.issuedAt || new Date().toISOString()
                    : undefined,
              });
            } catch {
              setError(
                "Unable to save your result. Check browser storage and try again.",
              );
              return;
            }
          }
          setIndex(index + 1);
        }}
      >
        {index === courseQuestions.length - 1
          ? "Check answers"
          : "Next question"}
      </AnimatedButtons>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
