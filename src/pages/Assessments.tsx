import { AssessmentPlayer } from "../components/trainee/AssessmentPlayer";
import { QuestionnaireBuilder } from "../components/trainer/QuestionnaireBuilder";
import { PageTitle } from "../components/ui/PageTitle";
import type { Role } from "../types/domain";
import { Link, useSearchParams } from "react-router-dom";
import { courses } from "../data/demo";
export function Assessments({ role }: { role: Role }) {
  const [params] = useSearchParams();
  const courseId = courses.find(
    (course) => course.id === params.get("course"),
  )?.id;
  return (
    <>
      <PageTitle
        title={role === "trainer" ? "Assessment studio" : "My assessments"}
        desc={
          role === "trainer"
            ? "Turn knowledge into meaningful checkpoints."
            : "Build confidence with a short radar practice session."
        }
      />
      {role === "trainer" ? (
        <QuestionnaireBuilder />
      ) : (
        <>
          <div className="filters mb-5">
            <Link className="filter" to="/trainee/assessments">
              Practice
            </Link>
            {courses.map((course) => (
              <Link
                className={`filter ${courseId === course.id ? "active" : ""}`}
                key={course.id}
                to={`/trainee/assessments?course=${course.id}`}
              >
                {course.tag}
              </Link>
            ))}
          </div>
          <AssessmentPlayer key={courseId || "practice"} courseId={courseId} />
        </>
      )}
    </>
  );
}
