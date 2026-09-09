import { useReducedMotion } from "../../lib/motion";

import { useId, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartData, courses } from "../../data/demo";
export function InteractiveKPICharts({
  variant = "activity",
}: {
  variant?: "activity" | "courses";
}) {
  const reduce = useReducedMotion();
  const gradient = useId().replaceAll(":", "");
  const [months, setMonths] = useState(6);
  const [active, setActive] = useState<string | null>(null);
  if (variant === "courses")
    return (
      <div role="group" aria-label="Sample course completion chart">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={courses} layout="vertical" margin={{ right: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#e8eef2"
            />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="code"
              width={105}
              tick={{ fontSize: 10 }}
            />
            <Tooltip cursor={{ fill: "#eef6f7" }} />
            <Bar
              dataKey="progress"
              name="Completion %"
              fill="var(--brand-primary)"
              radius={[0, 5, 5, 0]}
              isAnimationActive={!reduce}
              animationBegin={0}
              animationDuration={1000}
              onMouseLeave={() => setActive(null)}
              onMouseEnter={(_, index) => setActive(courses[index].id)}
            >
              {courses.map((course) => (
                <Cell
                  key={course.id}
                  fill="var(--brand-primary)"
                  fillOpacity={!active || active === course.id ? 1 : 0.25}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="chart-controls" aria-label="Highlight course">
          {courses.map((course) => (
            <button
              key={course.id}
              aria-pressed={active === course.id}
              onFocus={() => setActive(course.id)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(active === course.id ? null : course.id)}
            >
              {course.code}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div role="group" aria-label="Sample learning activity chart">
      <label className="chart-period">
        Time period{" "}
        <select
          aria-label="Learning activity time period"
          value={months}
          onChange={(event) => setMonths(Number(event.target.value))}
        >
          <option value={6}>Last 6 months</option>
          <option value={3}>Last 3 months</option>
        </select>
      </label>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData.slice(-months)} accessibilityLayer>
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--brand-primary)"
                stopOpacity={0.2}
              />
              <stop
                offset="100%"
                stopColor="var(--brand-primary)"
                stopOpacity={0.01}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e8eef2"
          />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          {["enrollments", "completion"].map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={index ? "var(--brand-secondary)" : "var(--brand-primary)"}
              fill={index ? "transparent" : `url(#${gradient})`}
              strokeWidth={3}
              strokeOpacity={!active || active === key ? 1 : 0.2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={!reduce}
              animationDuration={750}
              onMouseEnter={() => setActive(key)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <details className="chart-data">
        <summary>View chart data</summary>
        <table>
          <caption className="sr-only">Learning activity sample data</caption>
          <thead>
            <tr>
              <th>Month</th>
              <th>Enrollments</th>
              <th>Completions</th>
            </tr>
          </thead>
          <tbody>
            {chartData.slice(-months).map((row) => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{row.enrollments}</td>
                <td>{row.completion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <div className="chart-controls">
        {["enrollments", "completion"].map((key) => (
          <button
            key={key}
            aria-pressed={active === key}
            onMouseEnter={() => setActive(key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(key)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === key ? null : key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
