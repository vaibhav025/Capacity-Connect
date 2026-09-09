import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { CourseCatalogCard } from "../components/trainee/CourseCatalogCard";
import { DragDropContentUploader } from "../components/trainer/DragDropContentUploader";
import { AnimatedButtons } from "../components/ui/AnimatedButtons";
import { PageTitle } from "../components/ui/PageTitle";
import { ScrollRevealWrapper } from "../components/ui/ScrollRevealWrapper";
import { courses } from "../data/demo";
import type { Role } from "../types/domain";
import { progressOf, useDemo } from "../lib/demoStore";
export function Courses({ role }: { role: Role }) {
  const { learning } = useDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All courses");
  const [builder, setBuilder] = useState(false);
  const filtered = courses.filter(
    (course) =>
      `${course.title} ${course.code}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "All courses" ||
        course.category === filter ||
        course.level === filter),
  );
  return (
    <>
      <PageTitle
        title={role === "trainer" ? "My courses" : "Course catalogue"}
        desc="Curated learning paths for operational excellence."
        action={
          role === "trainer" ? (
            <AnimatedButtons
              className="primary"
              aria-expanded={builder}
              onClick={() => setBuilder(!builder)}
            >
              <Plus size={17} />
              {builder ? "Close builder" : "Create course"}
            </AnimatedButtons>
          ) : undefined
        }
      />
      {builder && <DragDropContentUploader />}
      <div className="catalog-toolbar">
        <div className="filters">
          {["All courses", "Forecasting", "Remote Sensing", "Advanced"].map(
            (value) => (
              <AnimatedButtons
                key={value}
                className={`filter ${filter === value ? "active" : ""}`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {value}
              </AnimatedButtons>
            ),
          )}
        </div>
        <label className="search">
          <Search size={17} />
          <span className="sr-only">Search courses</span>
          <input
            placeholder="Search courses…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p role="status" className="mb-5 text-xs text-slate-500">
        {filtered.length} learning paths · Designed for real-world impact
      </p>
      <div className="course-grid">
        {filtered.map((course) => (
          <ScrollRevealWrapper key={course.id}>
            <CourseCatalogCard
              course={
                role === "trainee"
                  ? { ...course, progress: progressOf(learning[course.id]) }
                  : course
              }
              role={role}
            />
          </ScrollRevealWrapper>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel">
          No courses match your search. Try another topic or filter.
        </div>
      )}
    </>
  );
}
