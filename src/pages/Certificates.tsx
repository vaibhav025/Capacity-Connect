import { Award, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/ui/PageTitle";
import { courses } from "../data/demo";
import { useDemo } from "../lib/demoStore";
function downloadRecord(
  title: string,
  name: string,
  id: string,
  date: string,
  score: number,
) {
  const text = [
    "CAPACITY CONNECT",
    "DEMONSTRATION CERTIFICATE OF COMPLETION",
    "",
    "Presented to: " + name,
    "Course: " + title,
    "Record: " + id,
    "Completed: " + date,
    "Assessment score: " + score + "%",
    "",
    "This is a local prototype record, not an official IMD credential.",
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = id + ".txt";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Certificates() {
  const { learning, profiles } = useDemo();
  const earned = courses.filter(
    (course) =>
      learning[course.id]?.completed.length === 3 &&
      (learning[course.id]?.score || 0) >= 70 &&
      learning[course.id]?.issuedAt,
  );
  return (
    <>
      <PageTitle
        title="Certificates"
        desc="Earned by completing a learning path and passing its knowledge check."
      />
      {!earned.length && (
        <section className="panel empty-state">
          <Award size={40} />
          <h2>Your next achievement starts here</h2>
          <p>
            Complete three notes and pass a course assessment with at least 70%
            to earn a demo certificate.
          </p>
          <Link className="primary" to="/trainee/courses">
            Explore learning paths
          </Link>
        </section>
      )}
      <div className="certificate-grid">
        {earned.map((course) => {
          const record = learning[course.id];
          const date = new Date(record.issuedAt!).toLocaleDateString("en-IN");
          const id =
            "CC-DEMO-" +
            course.id.toUpperCase() +
            "-" +
            record.issuedAt!.slice(0, 10).replaceAll("-", "");
          const name = profiles.trainee?.name || "Vikram Kumar";
          return (
            <article className="certificate panel" key={course.id}>
              <div className="cert-seal">
                <Award size={29} />
              </div>
              <p className="eyebrow">DEMONSTRATION CERTIFICATE</p>
              <h2>{course.title}</h2>
              <p>
                Presented to <strong>{name}</strong>
              </p>
              <p>
                All notes completed · Score {record.score}% · {date}
              </p>
              <div className="cert-footer">
                <span>{id}</span>
                <button
                  className="secondary"
                  onClick={() =>
                    downloadRecord(course.title, name, id, date, record.score!)
                  }
                >
                  <Download size={15} />
                  Download record
                </button>
              </div>
              <p className="support-copy">
                Local prototype evidence. Not an official IMD credential.
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}
