import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock3,
  FileText,
  Plus,
  Users,
  Code2,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { InteractiveKPICharts } from "../components/admin/InteractiveKPICharts";
import { PageTitle } from "../components/ui/PageTitle";
import { ScrollRevealWrapper } from "../components/ui/ScrollRevealWrapper";
import { Stat } from "../components/ui/Stat";
import { courses } from "../data/demo";
import type { Role } from "../types/domain";
import { ReadinessOverview } from "../components/admin/ReadinessOverview";
import { AnnouncementFeed } from "./Announcements";
import { progressOf, useDemo } from "../lib/demoStore";
export function Dashboard({ role }: { role: Role }) {
  const { learning, calendarEvents } = useDemo();
  const nav = useNavigate();
  const today = "2026-09-09";
  const upcomingEvents = calendarEvents
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  if (role === "admin")
    return (
      <>
        <ReadinessOverview role={role} />
        <PageTitle
          kicker="ADMIN CONSOLE · 05 SEP 2026"
          title="Good morning, Anil"
          desc="A clear view of learning capacity across IMD."
          action={
            <button
              className="primary"
              onClick={() => nav("/admin/announcements")}
            >
              <Plus size={17} /> New announcement
            </button>
          }
        />
        <ScrollRevealWrapper>
          <div className="stat-grid">
            <Stat
              icon={Users}
              label="Active users"
              value="1,284"
              meta="↑ 12.4% this month"
            />
            <Stat
              icon={Clock3}
              label="Pending approvals"
              value="8"
              meta="Needs your review"
              tone="amber"
            />
            <Stat
              icon={BookOpen}
              label="Active courses"
              value="36"
              meta="4 in review"
              tone="purple"
            />
            <Stat
              icon={Award}
              label="Completion rate"
              value="78.6%"
              meta="↑ 4.2% vs last month"
              tone="green"
            />
          </div>
        </ScrollRevealWrapper>
        <div className="dashboard-grid">
          <section className="panel chart-panel">
            <div className="panel-head">
              <div>
                <h3>Learning activity</h3>
                <p>Enrollments and completions · last 6 months</p>
              </div>
              <span className="pill">Sample data</span>
            </div>
            <InteractiveKPICharts />
            <div className="legend">
              <span>
                <i className="dot blue" />
                Enrollments
              </span>
              <span>
                <i className="dot cyan" />
                Completions
              </span>
            </div>
          </section>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Needs attention</h3>
                <p>Review queue for today</p>
              </div>
              <Link to="/admin/users" className="text-link">
                View all
              </Link>
            </div>
            <div className="attention">
              <div className="attention-item">
                <div className="round amber">!</div>
                <div>
                  <strong>8 users awaiting approval</strong>
                  <small>Oldest request · 2 days ago</small>
                </div>
                <ChevronRight size={17} />
              </div>
              <div className="attention-item">
                <div className="round purple">
                  <FileText size={16} />
                </div>
                <div>
                  <strong>Radar assessment closes soon</strong>
                  <small>42 enrolled · deadline 12 Sep</small>
                </div>
                <ChevronRight size={17} />
              </div>
              <div className="attention-item">
                <div className="round green">
                  <Award size={16} />
                </div>
                <div>
                  <strong>18 certificates issued</strong>
                  <small>Across 4 courses this month</small>
                </div>
                <ChevronRight size={17} />
              </div>
            </div>
          </section>
        </div>
        <div className="dashboard-grid lower">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Course performance</h3>
                <p>Completion by active course</p>
              </div>
              <Link to="/admin/competency-mapping" className="text-link">
                Explore mapping
              </Link>
            </div>
            <InteractiveKPICharts variant="courses" />
          </section>
          <section className="panel announcement">
            <div className="panel-head">
              <div>
                <h3>Latest announcements</h3>
                <p>Visible to the IMD network</p>
              </div>
              <Link to="/admin/announcements" className="text-link">
                Manage
              </Link>
            </div>
            <AnnouncementFeed role={role} />
          </section>
        </div>
      </>
    );
  return (
    <>
      <ReadinessOverview role={role} />
      <PageTitle
        kicker={
          role === "trainer"
            ? "TRAINER WORKSPACE · SEPTEMBER 2026"
            : "TRAINEE WORKSPACE · SEPTEMBER 2026"
        }
        title={
          role === "trainer"
            ? "Your teaching cockpit"
            : "Keep building your forecast edge"
        }
        desc={
          role === "trainer"
            ? "Manage content, assessments and learner outcomes from one place."
            : "You are on track. Two learning activities need your attention this week."
        }
      />
      <ScrollRevealWrapper>
        <div className="stat-grid">
          <Stat
            icon={BookOpen}
            label={role === "trainer" ? "Managed courses" : "Enrolled courses"}
            value={
              role === "trainer"
                ? "06"
                : String(
                    Object.values(learning).filter((item) => item.enrolled)
                      .length,
                  )
            }
            meta={
              role === "trainer"
                ? "2 drafts · 4 published"
                : "Recorded in this browser"
            }
          />
          <Stat
            icon={Activity}
            label={
              role === "trainer" ? "Learners reached" : "Learning progress"
            }
            value={
              role === "trainer"
                ? "186"
                : Math.round(
                    courses.reduce(
                      (sum, course) => sum + progressOf(learning[course.id]),
                      0,
                    ) / courses.length,
                  ) + "%"
            }
            meta={
              role === "trainer"
                ? "+18 this month"
                : "Across four learning paths"
            }
            tone="purple"
          />
          <Stat
            icon={FileText}
            label="Assessments"
            value={
              role === "trainer"
                ? "12"
                : String(
                    Object.values(learning).filter(
                      (item) => item.score !== undefined,
                    ).length,
                  )
            }
            meta={
              role === "trainer" ? "4 upcoming" : "Recorded knowledge checks"
            }
            tone="amber"
          />
          <Stat
            icon={Award}
            label={role === "trainer" ? "Learner rating" : "Certificates"}
            value={
              role === "trainer"
                ? "4.8/5"
                : String(
                    Object.values(learning).filter(
                      (item) => item.issuedAt && progressOf(item) === 100,
                    ).length,
                  )
            }
            meta={role === "trainer" ? "Learner rating" : "Keep going!"}
            tone="green"
          />
        </div>
      </ScrollRevealWrapper>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>
                {role === "trainer" ? "Course engagement" : "Continue learning"}
              </h3>
              <p>
                {role === "trainer"
                  ? "A pulse check across your active courses."
                  : "Pick up where you left off."}
              </p>
            </div>
            <Link to={`/${role}/courses`} className="text-link">
              View all
            </Link>
          </div>
          {courses.slice(0, 3).map((c) => (
            <Link
              to={`/${role}/courses/${c.id}`}
              className="course-row"
              key={c.id}
            >
              <div className="course-thumb" style={{ background: c.accent }}>
                <BookOpen size={20} />
              </div>
              <div className="course-row-main">
                <strong>{c.title}</strong>
                <small>
                  {c.code} · {c.duration}
                </small>
                <div className="progress">
                  <i
                    style={{
                      width:
                        (role === "trainer"
                          ? Math.min(100, c.learners * 2)
                          : progressOf(learning[c.id])) + "%",
                    }}
                  />
                </div>
              </div>
              <span className="percent">
                {role === "trainer"
                  ? c.learners + " learners"
                  : progressOf(learning[c.id]) + "%"}
              </span>
              <ChevronRight size={17} />
            </Link>
          ))}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Upcoming assessment</h3>
              <p>Your next checkpoint</p>
            </div>
            <Clock3 size={18} color="#d18a32" />
          </div>
          <div className="assessment-card">
            <div className="assessment-icon">
              <FileText size={22} />
            </div>
            <span className="pill amber-pill">DUE IN 3 DAYS</span>
            <h3>Doppler Radar · Module 3</h3>
            <p>15 questions · 20 minutes · 70% to pass</p>
            <button
              className="secondary"
              onClick={() => nav("/" + role + "/assessments")}
            >
              Start assessment <ChevronRight size={16} />
            </button>
          </div>
          <div className="mini-notice">
            <Bell size={16} />
            <span>
              <strong>Monsoon review session</strong>
              <small>18 Sep · National Meteorological Centre</small>
            </span>
          </div>
        </section>
      </div>
      <section className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">From the training office</h2>
        <AnnouncementFeed role={role} />
      </section>
      <UpcomingScheduleWidget events={upcomingEvents} role={role} />
    </>
  );
}

function UpcomingScheduleWidget({
  events,
  role,
}: {
  events: ReturnType<typeof useDemo>["calendarEvents"];
  role: Role;
}) {
  const nav = useNavigate();
  if (!events.length) return null;

  const typeIcon = (type: string) => {
    switch (type) {
      case "class":
        return <BookOpen size={14} />;
      case "assessment":
        return <FileText size={14} />;
      case "project":
        return <Code2 size={14} />;
      case "meeting":
        return <Users size={14} />;
      case "event":
        return <Calendar size={14} />;
      case "deadline":
        return <Bell size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  return (
    <section className="dashboard-grid mt-6">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Upcoming schedule</h3>
            <p>Your next events and deadlines</p>
          </div>
          <button
            className="text-link"
            onClick={() => nav("/" + role + "/calendar")}
          >
            View calendar
          </button>
        </div>
        <div className="schedule-widget-list">
          {events.map((event) => (
            <div key={event.id} className="schedule-widget-item">
              <div
                className="schedule-color"
                style={{ background: event.color }}
              />
              <div className="schedule-info">
                <strong>{event.title}</strong>
                <small>
                  {new Date(event.date + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    { weekday: "short", day: "numeric", month: "short" },
                  )}{" "}
                  · {event.time}
                </small>
              </div>
              {typeIcon(event.type)}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
