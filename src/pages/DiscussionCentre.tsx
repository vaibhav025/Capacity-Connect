import { useState } from "react";
import {
  MessageSquare,
  Search,
  BookOpen,
  FileText,
  Upload,
  Calendar,
  Code2,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Plus,
  Reply,
} from "lucide-react";
import { PageTitle } from "../components/ui/PageTitle";
import { type Role } from "../types/domain";
import {
  useDemo,
  updateDemo,
  type Discussion,
  type Resource,
  type Opportunity,
} from "../lib/demoStore";

type CentreTab = "discussions" | "resources" | "opportunities";

export function DiscussionCentre({ role }: { role: Role }) {
  const [tab, setTab] = useState<CentreTab>("discussions");
  return (
    <>
      <PageTitle
        title="Student Discussion & Resource Centre"
        desc="Connect with peers, share resources, and discover opportunities."
      />
      <div className="filters mb-5">
        <button
          className={`filter ${tab === "discussions" ? "active" : ""}`}
          onClick={() => setTab("discussions")}
        >
          <MessageSquare size={13} /> Discussions
        </button>
        <button
          className={`filter ${tab === "resources" ? "active" : ""}`}
          onClick={() => setTab("resources")}
        >
          <BookOpen size={13} /> Resources
        </button>
        <button
          className={`filter ${tab === "opportunities" ? "active" : ""}`}
          onClick={() => setTab("opportunities")}
        >
          <Briefcase size={13} /> Opportunities
        </button>
      </div>

      {tab === "discussions" && <DiscussionsTab role={role} />}
      {tab === "resources" && <ResourcesTab role={role} />}
      {tab === "opportunities" && <OpportunitiesTab />}
    </>
  );
}

function DiscussionsTab({ role }: { role: Role }) {
  const { discussions } = useDemo();
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const categories = [
    "All",
    ...new Set(discussions.map((d) => d.category)),
  ];
  const filtered = discussions.filter(
    (d) =>
      (catFilter === "All" || d.category === catFilter) &&
      (search === "" ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.body.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <div className="discussion-toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          {categories.map((c) => (
            <button
              key={c}
              className={`filter ${catFilter === c ? "active" : ""}`}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button className="primary" onClick={() => setShowNew(!showNew)}>
          <Plus size={14} />
          New Discussion
        </button>
      </div>

      {showNew && (
        <NewDiscussionForm onClose={() => setShowNew(false)} />
      )}

      <div className="discussion-list">
        {filtered.map((disc) => (
          <DiscussionThread key={disc.id} discussion={disc} role={role} />
        ))}
        {!filtered.length && (
          <section className="panel empty-state">
            <MessageSquare size={36} />
            <h2>No discussions yet</h2>
            <p>Start a conversation with your peers.</p>
          </section>
        )}
      </div>
    </>
  );
}

function NewDiscussionForm({ onClose }: { onClose: () => void }) {
  return (
    <form
      className="panel feedback-form mb-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const title = String(data.get("title")).trim();
        const body = String(data.get("body")).trim();
        if (!title || !body) return;
        updateDemo((prev) => ({
          ...prev,
          discussions: [
            {
              id: crypto.randomUUID(),
              title,
              body,
              author: "Vikram Kumar",
              authorRole: "trainee",
              category: String(data.get("category")),
              createdAt: new Date().toISOString(),
              replies: [],
            },
            ...prev.discussions,
          ],
        }));
        onClose();
      }}
    >
      <h3>Start a new discussion</h3>
      <label>
        Title *
        <input name="title" required maxLength={120} />
      </label>
      <label>
        Message *
        <textarea name="body" required rows={3} maxLength={2000} />
      </label>
      <label>
        Category
        <select name="category">
          <option>Academic</option>
          <option>Study Group</option>
          <option>General</option>
          <option>Projects</option>
          <option>Career</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="primary">Post Discussion</button>
        <button className="secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function DiscussionThread({
  discussion,
  role,
}: {
  discussion: Discussion;
  role: Role;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const addReply = () => {
    if (!replyText.trim()) return;
    updateDemo((prev) => ({
      ...prev,
      discussions: prev.discussions.map((d) =>
        d.id === discussion.id
          ? {
              ...d,
              replies: [
                ...d.replies,
                {
                  id: crypto.randomUUID(),
                  body: replyText.trim(),
                  author:
                    role === "admin"
                      ? "Anil Sharma"
                      : role === "trainer"
                        ? "Dr. Ananya Rao"
                        : "Vikram Kumar",
                  authorRole: role,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : d,
      ),
    }));
    setReplyText("");
    setShowReply(false);
  };

  return (
    <article className="panel discussion-thread">
      <div className="discussion-header">
        <div className="avatar small">
          {discussion.author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <strong>{discussion.title}</strong>
          <small>
            {discussion.author} · {discussion.authorRole.toUpperCase()} ·{" "}
            {new Date(discussion.createdAt).toLocaleDateString("en-IN")}
          </small>
        </div>
        <span className="pill">{discussion.category}</span>
      </div>
      <p className="discussion-body">{discussion.body}</p>

      <div className="discussion-footer">
        <button
          className="text-link"
          onClick={() => setExpanded(!expanded)}
        >
          <Reply size={13} />
          {discussion.replies.length} {discussion.replies.length === 1 ? "reply" : "replies"}
          <ChevronRight size={13} />
        </button>
        <button
          className="text-link"
          onClick={() => setShowReply(!showReply)}
        >
          Reply
        </button>
      </div>

      {expanded && discussion.replies.length > 0 && (
        <div className="reply-list">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="reply-item">
              <div className="avatar small">
                {reply.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <strong>{reply.author}</strong>
                <small>{reply.authorRole.toUpperCase()}</small>
                <p>{reply.body}</p>
                <small>
                  {new Date(reply.createdAt).toLocaleDateString("en-IN")}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReply && (
        <div className="reply-form">
          <textarea
            placeholder="Write your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
          />
          <button className="primary" onClick={addReply}>
            Post Reply
          </button>
        </div>
      )}
    </article>
  );
}

function ResourcesTab({ role }: { role: Role }) {
  const { resources } = useDemo();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);

  const types = ["All", "PYQ", "Syllabus", "Notes", "Other"];
  const filtered = resources.filter(
    (r) =>
      (typeFilter === "All" || r.type === typeFilter) &&
      (search === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.subject.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <div className="discussion-toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Search resources by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          {types.map((t) => (
            <button
              key={t}
              className={`filter ${typeFilter === t ? "active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="primary" onClick={() => setShowUpload(!showUpload)}>
          <Upload size={14} />
          Upload Resource
        </button>
      </div>

      {showUpload && (
        <ResourceUploadForm onClose={() => setShowUpload(false)} />
      )}

      <div className="resource-grid">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
        {!filtered.length && (
          <section className="panel empty-state">
            <BookOpen size={36} />
            <h2>No resources found</h2>
            <p>Upload study materials to share with your peers.</p>
          </section>
        )}
      </div>
    </>
  );
}

function ResourceUploadForm({ onClose }: { onClose: () => void }) {
  return (
    <form
      className="panel feedback-form mb-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const title = String(data.get("title")).trim();
        if (!title) return;
        updateDemo((prev) => ({
          ...prev,
          resources: [
            {
              id: crypto.randomUUID(),
              title,
              type: String(data.get("type")) as Resource["type"],
              subject: String(data.get("subject")).trim(),
              category: String(data.get("category")).trim(),
              author: "Vikram Kumar",
              fileUrl: "#",
              description: String(data.get("description")).trim(),
              uploadedAt: new Date().toISOString(),
            },
            ...prev.resources,
          ],
        }));
        onClose();
      }}
    >
      <h3>Upload a resource</h3>
      <div className="form-grid">
        <label>
          Title *
          <input name="title" required maxLength={120} />
        </label>
        <label>
          Type
          <select name="type">
            <option>PYQ</option>
            <option>Syllabus</option>
            <option>Notes</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="form-grid">
        <label>
          Subject *
          <input name="subject" required placeholder="e.g. Radar Meteorology" />
        </label>
        <label>
          Category
          <input name="category" placeholder="e.g. Study Material" />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" rows={2} maxLength={500} />
      </label>
      <div className="form-actions">
        <button className="primary">Upload Resource</button>
        <button className="secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const typeIcon = {
    PYQ: <FileText size={18} />,
    Syllabus: <BookOpen size={18} />,
    Notes: <FileText size={18} />,
    Other: <FileText size={18} />,
  };
  const typeColor = {
    PYQ: "#d18a32",
    Syllabus: "#7155c7",
    Notes: "#2c9a70",
    Other: "#0969da",
  };

  return (
    <article className="panel resource-card">
      <div className="resource-card-icon" style={{ color: typeColor[resource.type] }}>
        {typeIcon[resource.type]}
      </div>
      <span className="pill" style={{ background: typeColor[resource.type] + "15", color: typeColor[resource.type] }}>
        {resource.type}
      </span>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <small>
        {resource.subject} · Uploaded by {resource.author} ·{" "}
        {new Date(resource.uploadedAt).toLocaleDateString("en-IN")}
      </small>
    </article>
  );
}

function OpportunitiesTab() {
  const { opportunities } = useDemo();
  const [filter, setFilter] = useState<"all" | "hackathon" | "internship">("all");
  const [search, setSearch] = useState("");

  const filtered = opportunities.filter(
    (o) =>
      (filter === "all" || o.type === filter) &&
      (search === "" ||
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.organization.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <div className="discussion-toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <button
            className={`filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter ${filter === "hackathon" ? "active" : ""}`}
            onClick={() => setFilter("hackathon")}
          >
            <Code2 size={13} /> Hackathons
          </button>
          <button
            className={`filter ${filter === "internship" ? "active" : ""}`}
            onClick={() => setFilter("internship")}
          >
            <Briefcase size={13} /> Internships
          </button>
        </div>
      </div>

      <div className="opportunity-grid">
        {filtered.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
        {!filtered.length && (
          <section className="panel empty-state">
            <Briefcase size={36} />
            <h2>No opportunities found</h2>
            <p>Check back later for hackathons and internships.</p>
          </section>
        )}
      </div>
    </>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const isHackathon = opportunity.type === "hackathon";
  return (
    <article className={`panel opportunity-card ${isHackathon ? "hackathon" : "internship"}`}>
      <div className="opportunity-header">
        <span className={`pill ${isHackathon ? "amber-pill" : "green-pill"}`}>
          {isHackathon ? "HACKATHON" : "INTERNSHIP"}
        </span>
        <span className="deadline-badge">
          <Calendar size={12} />
          Deadline: {new Date(opportunity.deadline).toLocaleDateString("en-IN")}
        </span>
      </div>
      <h3>{opportunity.title}</h3>
      <p className="opportunity-org">{opportunity.organization}</p>
      <p className="opportunity-desc">{opportunity.description}</p>

      <div className="opportunity-details">
        <div className="opp-detail">
          <strong>Eligibility</strong>
          <span>{opportunity.eligibility}</span>
        </div>
        <div className="opp-detail">
          <strong>Location/Mode</strong>
          <span>{opportunity.location}</span>
        </div>
        <div className="opp-detail">
          <strong>Skills Required</strong>
          <div className="skill-pills">
            {opportunity.skillsRequired.map((s) => (
              <span key={s} className="skill-tag">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a
        href={opportunity.applicationLink}
        className="primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink size={14} />
        Apply / Register
      </a>
    </article>
  );
}
