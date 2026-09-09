import { useReducedMotion } from "../../lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatedButtons } from "../ui/AnimatedButtons";
import { SkeletonLoaders } from "../ui/SkeletonLoaders";
type Match = {
  trainer_id: string;
  name: string;
  score: number;
  explanation: string;
  breakdown?: Record<string, number>;
  matched?: string[];
  missing?: string[];
};
export function CompetencyMatchModal({
  open,
  topic,
  onClose,
}: {
  open: boolean;
  topic: { name: string; skills: string[] };
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const reduce = useReducedMotion();
  const [state, setState] = useState<{
    loading: boolean;
    error: string;
    results: Match[];
    model: string;
  }>({ loading: true, error: "", results: [], model: "" });
  useEffect(() => {
    if (!open) return;
    const element = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    element.showModal();
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    setState({ loading: true, error: "", results: [], model: "" });
    const scan = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, reduce ? 0 : 900);
    });
    void (async () => {
      try {
        const response = await fetch("/api/competency/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(
            "Matching service is unavailable. Close this dialog and try again.",
          );
        const data = await response.json();
        if (
          typeof data.model_version !== "string" ||
          !Array.isArray(data.results) ||
          !data.results.every(
            (item: Partial<Match> | null) =>
              item &&
              typeof item.trainer_id === "string" &&
              typeof item.name === "string" &&
              typeof item.score === "number" &&
              Number.isFinite(item.score) &&
              typeof item.explanation === "string",
          )
        )
          throw new Error("The matching service returned an invalid result.");
        await scan;
        if (!controller.signal.aborted)
          setState({
            loading: false,
            error: "",
            results: data.results,
            model: data.model_version,
          });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to find matches.",
            results: [],
            model: "",
          });
      }
    })();
    return () => {
      controller.abort();
      clearTimeout(timer);
      element.close();
      previous?.focus();
    };
  }, [open, topic, reduce]);
  return (
    <dialog
      ref={dialog}
      className="match-dialog"
      aria-labelledby={title}
      data-lenis-prevent
      onCancel={onClose}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">COMPETENCY INTELLIGENCE</p>
          <h2 id={title} className="my-2 text-2xl font-semibold">
            Find the right expertise
          </h2>
          <p className="text-sm text-slate-500">{topic.name}</p>
        </div>
        <AnimatedButtons aria-label="Close matches" onClick={onClose}>
          <X />
        </AnimatedButtons>
      </div>
      <AnimatePresence mode="sync" initial={false}>
        {state.loading ? (
          <motion.div key="scan" className="scan-surface" exit={{ opacity: 0 }}>
            <BrainCircuit size={44} />
            <p role="status">Scanning competency evidence…</p>
            <SkeletonLoaders label="Finding trainers" />
            {!reduce && (
              <motion.div
                className="scan-line"
                animate={{ top: ["0%", "100%"] }}
                exit={{ opacity: 0, transition: { duration: 0, repeat: 0 } }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        ) : state.error ? (
          <motion.p
            key="error"
            role="alert"
            className="my-8 text-red-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {state.error}
          </motion.p>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="my-5 text-xs text-slate-500">
              Model {state.model}
              {state.model.includes("demo")
                ? " · Ranked sample evidence; not live personnel records."
                : ""}
            </p>
            {state.results.length === 0 && (
              <p>No approved trainers match this requirement.</p>
            )}
            {state.results.map((match) => (
              <article className="match-result" key={match.trainer_id}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{match.name}</h3>
                  <strong className="text-2xl text-teal-700">
                    {match.score}%
                  </strong>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {match.explanation}
                </p>
                {match.breakdown && (
                  <div
                    className="evidence-matrix"
                    aria-label={`Evidence for ${match.name}`}
                  >
                    {Object.entries(match.breakdown)
                      .filter(
                        ([, value]) =>
                          typeof value === "number" && Number.isFinite(value),
                      )
                      .map(([name, value]) => (
                        <div key={name}>
                          <span>{name}</span>
                          <div
                            className="progress"
                            role="meter"
                            aria-label={name}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(
                              Math.max(0, Math.min(1, value)) * 100,
                            )}
                          >
                            <i
                              style={{
                                width: `${Math.max(0, Math.min(1, value)) * 100}%`,
                              }}
                            />
                          </div>
                          <strong>
                            {Math.round(Math.max(0, Math.min(1, value)) * 100)}%
                          </strong>
                        </div>
                      ))}
                  </div>
                )}
                {Array.isArray(match.matched) && (
                  <div className="evidence-skills">
                    {match.matched
                      .filter((skill) => typeof skill === "string")
                      .map((skill) => (
                        <span key={skill}>Matched · {skill}</span>
                      ))}
                  </div>
                )}
                {Array.isArray(match.missing) && (
                  <div className="evidence-skills gaps">
                    {match.missing
                      .filter((skill) => typeof skill === "string")
                      .map((skill) => (
                        <span key={skill}>Evidence gap · {skill}</span>
                      ))}
                  </div>
                )}
              </article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
