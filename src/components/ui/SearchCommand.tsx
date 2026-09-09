import { Search, ArrowUpRight, X, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { courses } from "../../data/demo";
import type { Role } from "../../types/domain";
export function SearchCommand({ role }: { role: Role }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const close = () => {
    dialog.current?.close();
    trigger.current?.focus();
  };
  const open = () => {
    setQuery("");
    dialog.current?.showModal();
    input.current?.focus();
  };
  useEffect(() => {
    dialog.current?.close();
  }, [location]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const results = courses.filter((course) =>
    `${course.title} ${course.category} ${course.code}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <button
        ref={trigger}
        className="search-trigger"
        aria-label="Search learning workspace"
        onClick={open}
      >
        <Search size={17} />
        <span>Search learning…</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-label="Search learning workspace"
        data-lenis-prevent
        onCancel={close}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="command-input">
          <Search size={20} />
          <input
            ref={input}
            aria-label="Search learning paths"
            placeholder="Find a course, skill or topic…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button aria-label="Close search" onClick={close}>
            <X size={20} />
          </button>
        </div>
        <p className="eyebrow">LEARNING PATHS · {results.length} RESULTS</p>
        <div className="command-results">
          {results.map((course) => (
            <Link
              key={course.id}
              to={`/${role}/courses/${course.id}`}
              onClick={close}
            >
              <BookOpen size={20} />
              <div>
                <strong>{course.title}</strong>
                <small>
                  {course.category} · {course.duration} · {course.level}
                </small>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        {!results.length && (
          <p className="support-copy">
            No learning paths match. Try “radar” or “forecasting”.
          </p>
        )}
        <div className="command-footer">
          Search across the course catalogue <span>Esc to close</span>
        </div>
      </dialog>
    </>
  );
}
