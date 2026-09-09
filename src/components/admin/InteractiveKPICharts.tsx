import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
  const [active, setActive] = useState<string | null>(null);
  if (variant === "courses")
    return (
      <div>
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
              fill="#0c7c9e"
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
                  fill={course.accent}
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
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e8eef2"
          />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          {["enrollments", "completion"].map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={index ? "#83c9d6" : "#0c7c9e"}
              strokeWidth={3}
              strokeOpacity={!active || active === key ? 1 : 0.2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={!reduce}
              animationDuration={1200}
              onMouseEnter={() => setActive(key)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
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
