import { useState } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Users,
  Code2,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { PageTitle } from "../components/ui/PageTitle";
import { type Role } from "../types/domain";
import { useDemo } from "../lib/demoStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarPage({ role }: { role: Role }) {
  const { calendarEvents } = useDemo();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = "2026-09-09";

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const eventsForDate = (dateStr: string) =>
    calendarEvents.filter((e) => e.date === dateStr);

  const selectedEvents = selectedDate
    ? eventsForDate(selectedDate)
    : [];

  const upcomingEvents = calendarEvents
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

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
        return <Briefcase size={14} />;
      case "deadline":
        return <AlertCircle size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  return (
    <>
      <PageTitle
        title="Calendar & Schedule"
        desc="View classes, assessments, deadlines, and upcoming events."
      />

      <div className="calendar-layout">
        <section className="panel calendar-panel">
          <div className="calendar-header">
            <button className="icon-btn" onClick={prevMonth}>
              <ChevronLeft size={18} />
            </button>
            <h3>
              {MONTHS[month]} {year}
            </h3>
            <button className="icon-btn" onClick={nextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="calendar-grid">
            {DAYS.map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventsForDate(dateStr);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const isPast = dateStr < today;

              return (
                <button
                  key={day}
                  className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isPast ? "past" : ""} ${dayEvents.length ? "has-events" : ""}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="day-dots">
                      {dayEvents.slice(0, 3).map((e) => (
                        <i key={e.id} style={{ background: e.color }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <div className="calendar-sidebar">
          {selectedDate && (
            <section className="panel">
              <div className="panel-head">
                <div>
                  <h3>
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      },
                    )}
                  </h3>
                  <p>
                    {selectedEvents.length} event
                    {selectedEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              {!selectedEvents.length ? (
                <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                  No events on this day.
                </p>
              ) : (
                <div className="event-list">
                  {selectedEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div
                        className="event-color"
                        style={{ background: event.color }}
                      />
                      <div className="event-info">
                        <strong>{event.title}</strong>
                        <small>
                          <Clock size={11} /> {event.time}
                        </small>
                        <p>{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="panel">
            <div className="panel-head">
              <div>
                <h3>Upcoming</h3>
                <p>Next scheduled events</p>
              </div>
            </div>
            <div className="upcoming-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="upcoming-item">
                  <div
                    className="upcoming-color"
                    style={{ background: event.color }}
                  />
                  <div className="upcoming-info">
                    <strong>{event.title}</strong>
                    <small>
                      {new Date(event.date + "T00:00:00").toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" },
                      )}{" "}
                      · {event.time}
                    </small>
                  </div>
                  {typeIcon(event.type)}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
