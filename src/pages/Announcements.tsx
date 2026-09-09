import { useState } from "react";
import { PageTitle } from "../components/ui/PageTitle";
import { updateDemo, useDemo } from "../lib/demoStore";
import type { Role } from "../types/domain";
export function AnnouncementFeed({
  role,
  filter = "All updates",
}: {
  role: Role;
  filter?: string;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const { notices } = useDemo();
  const visible = notices.filter(
    (item) =>
      (role === "admin" || item.audience === "all" || item.audience === role) &&
      (filter === "All updates" || item.kind === filter),
  );
  return (
    <div className="announcement-list">
      {visible.map((item) => (
        <article
          className="panel notice full"
          data-kind={item.kind}
          key={item.id}
        >
          <span className="notice-tag">
            {item.kind.toUpperCase()} ·{" "}
            {item.audience === "all" ? "EVERYONE" : item.audience.toUpperCase()}
          </span>
          <h3>{item.title}</h3>
          <p className="whitespace-pre-wrap">
            {item.body.length > 260 && !expanded.includes(item.id)
              ? item.body.slice(0, 260) + "..."
              : item.body}
          </p>
          {item.body.length > 260 && (
            <button
              className="notice-expand"
              aria-expanded={expanded.includes(item.id)}
              onClick={() =>
                setExpanded((previous) =>
                  previous.includes(item.id)
                    ? previous.filter((id) => id !== item.id)
                    : [...previous, item.id],
                )
              }
            >
              {expanded.includes(item.id)
                ? "Show less"
                : "Read full announcement"}
            </button>
          )}
          <small>
            {new Date(item.date).toLocaleDateString("en-IN")} · Training office
          </small>
        </article>
      ))}
      {!visible.length && <p>No announcements for your role yet.</p>}
    </div>
  );
}
export function Announcements({ role = "admin" }: { role?: Role }) {
  const { notices } = useDemo();
  const [filter, setFilter] = useState("All updates");
  const categories = [
    "All updates",
    ...new Set(notices.map((notice) => notice.kind)),
  ];
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  return (
    <>
      <PageTitle
        title="Announcements"
        desc="Training updates, achievements and new learning resources."
        action={
          role === "admin" ? (
            <button className="primary" onClick={() => setEditing(!editing)}>
              {editing ? "Close editor" : "New announcement"}
            </button>
          ) : undefined
        }
      />
      {editing && role === "admin" && (
        <form
          className="panel feedback-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const title = String(data.get("title")).trim();
            const body = String(data.get("body")).trim();
            if (!title || !body) {
              setStatus("Enter a title and message.");
              return;
            }
            try {
              updateDemo((previous) => ({
                ...previous,
                notices: [
                  {
                    id: crypto.randomUUID(),
                    title,
                    body,
                    kind: String(data.get("kind")),
                    audience: String(data.get("audience")),
                    date: new Date().toISOString(),
                  },
                  ...previous.notices,
                ],
              }));
              setEditing(false);
              setStatus(
                "Announcement published to the selected demo workspaces.",
              );
            } catch {
              setStatus("Unable to save announcement. Check browser storage.");
            }
          }}
        >
          <h3>Publish an update</h3>
          <label>
            Title
            <input name="title" required maxLength={120} />
          </label>
          <label>
            Message
            <textarea name="body" required maxLength={2000} rows={4} />
          </label>
          <div className="form-grid">
            <label>
              Type
              <select name="kind">
                {[
                  "Training",
                  "Announcement",
                  "Achievement",
                  "New content",
                  "Assessment",
                  "Urgent",
                  "Event",
                ].map((kind) => (
                  <option key={kind}>{kind}</option>
                ))}
              </select>
            </label>
            <label>
              Audience
              <select name="audience">
                <option value="all">Everyone</option>
                <option value="trainee">Trainees</option>
                <option value="trainer">Trainers</option>
              </select>
            </label>
          </div>
          <button className="primary">Publish announcement</button>
        </form>
      )}
      <p role="status">{status}</p>
      <div className="filters" aria-label="Filter announcements">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter ${filter === category ? "active" : ""}`}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <AnnouncementFeed role={role} filter={filter} />
    </>
  );
}
