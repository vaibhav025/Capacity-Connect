import { useReducedMotion } from "../lib/motion";

import { Activity, CheckCircle2, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageTitle } from "../components/ui/PageTitle";
import { Stat } from "../components/ui/Stat";
import { courses } from "../data/demo";
import { progressOf, useDemo } from "../lib/demoStore";
export function Performance() {
  const reduce = useReducedMotion();
  const { learning, profiles } = useDemo();
  return (
    <>
      <PageTitle
        title="Performance analytics"
        desc="Understand learner outcomes across your assessments."
      />
      <div className="stat-grid">
        <section className="panel col-span-full">
          <div className="panel-head">
            <div>
              <h3>Observed demo participation</h3>
              <p>Updates from the trainee learning flow in this browser</p>
            </div>
          </div>
          {courses.filter((course) => learning[course.id]?.enrolled).length ===
          0 ? (
            <p className="support-copy">
              No demo enrollments yet. Complete a trainee learning activity to
              see its evidence here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Learner / course</th>
                    <th>Progress</th>
                    <th>Score</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {courses
                    .filter((course) => learning[course.id]?.enrolled)
                    .map((course) => (
                      <tr key={course.id}>
                        <td>
                          {profiles.trainee?.name || "Vikram Kumar"}
                          <br />
                          {course.title}
                        </td>
                        <td>{progressOf(learning[course.id])}%</td>
                        <td>
                          {learning[course.id].score === undefined
                            ? "Not attempted"
                            : learning[course.id].score + "%"}
                        </td>
                        <td>
                          {learning[course.id].feedback
                            ? learning[course.id].feedback!.rating +
                              "/5 · " +
                              learning[course.id].feedback!.text
                            : "Awaiting feedback"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <Stat
          icon={Users}
          label="Participation"
          value="91%"
          meta="168 of 186 learners"
        />
        <Stat
          icon={Activity}
          label="Average score"
          value="82.4%"
          meta="↑ 3.8% this term"
          tone="purple"
        />
        <Stat
          icon={CheckCircle2}
          label="Pass rate"
          value="76%"
          meta="Across 12 assessments"
          tone="green"
        />
      </div>
      <section className="panel chart-panel">
        <div className="panel-head">
          <div>
            <h3>Assessment score distribution</h3>
            <p>All published assessments · current term</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={[
              { score: "0–40", count: 8 },
              { score: "41–60", count: 18 },
              { score: "61–70", count: 31 },
              { score: "71–80", count: 46 },
              { score: "81–90", count: 38 },
              { score: "91–100", count: 27 },
            ]}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e8eef2"
            />
            <XAxis dataKey="score" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar
              isAnimationActive={!reduce}
              dataKey="count"
              fill="var(--brand-primary)"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
