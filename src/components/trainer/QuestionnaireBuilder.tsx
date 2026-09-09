import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AnimatedButtons } from "../ui/AnimatedButtons";
export function QuestionnaireBuilder() {
  const [questions, setQuestions] = useState([
    { id: "first", prompt: "", options: ["", ""], correct: 0 },
  ]);
  const [status, setStatus] = useState("");
  return (
    <form
      className="panel space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus(
          `Validated ${questions.length} questions. Draft remains in this session.`,
        );
      }}
    >
      <h3>Questionnaire builder</h3>
      <p className="text-xs text-slate-500">
        Write a question, supply two choices, and select the correct answer.
      </p>
      {questions.map((question, index) => (
        <motion.fieldset layout key={question.id} className="question-fieldset">
          <legend>Question {index + 1}</legend>
          <label>
            Question text
            <input
              required
              value={question.prompt}
              onChange={(event) => {
                setStatus("");
                setQuestions((items) =>
                  items.map((item) =>
                    item.id === question.id
                      ? { ...item, prompt: event.target.value }
                      : item,
                  ),
                );
              }}
            />
          </label>
          {question.options.map((option, choice) => (
            <div key={choice} className="flex items-center gap-3">
              <input
                type="radio"
                aria-label={`Choice ${choice + 1} is correct for question ${index + 1}`}
                name={question.id}
                checked={question.correct === choice}
                onChange={() =>
                  setQuestions((items) =>
                    items.map((item) =>
                      item.id === question.id
                        ? { ...item, correct: choice }
                        : item,
                    ),
                  )
                }
              />
              <label className="flex-1">
                Choice {choice + 1}
                <input
                  required
                  value={option}
                  onChange={(event) =>
                    setQuestions((items) =>
                      items.map((item) =>
                        item.id === question.id
                          ? {
                              ...item,
                              options: item.options.map((text, i) =>
                                i === choice ? event.target.value : text,
                              ),
                            }
                          : item,
                      ),
                    )
                  }
                />
              </label>
            </div>
          ))}
          <AnimatedButtons
            className="reject"
            disabled={questions.length === 1}
            aria-label={`Remove question ${index + 1}`}
            onClick={() =>
              setQuestions((items) =>
                items.filter((item) => item.id !== question.id),
              )
            }
          >
            <Trash2 size={15} /> Remove
          </AnimatedButtons>
        </motion.fieldset>
      ))}
      <div className="flex gap-3">
        <AnimatedButtons
          className="secondary"
          onClick={() => {
            setStatus("");
            setQuestions((items) => [
              ...items,
              {
                id: crypto.randomUUID(),
                prompt: "",
                options: ["", ""],
                correct: 0,
              },
            ]);
          }}
        >
          <Plus size={16} /> Add question
        </AnimatedButtons>
        <AnimatedButtons type="submit" className="primary">
          Validate draft
        </AnimatedButtons>
      </div>
      <p role="status">{status}</p>
    </form>
  );
}
