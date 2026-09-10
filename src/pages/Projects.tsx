import { useState } from "react";
import {
  Code2,
  ExternalLink,
  Github,
  Globe,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { PageTitle } from "../components/ui/PageTitle";
import { type Role } from "../types/domain";
import {
  useDemo,
  updateDemo,
  type ProjectSuggestion,
  type ProjectSubmission,
} from "../lib/demoStore";

const difficultyColor = {
  Beginner: "green-pill",
  Intermediate: "amber-pill",
  Advanced: "pill purple-pill",
};

export function Projects({ role }: { role: Role }) {
  const { projects, submissions } = useDemo();
  const [tab, setTab] = useState<"browse" | "submissions">("browse");
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.difficulty === filter);

  return (
    <>
      <PageTitle
        title={role === "trainer" ? "Project Hub" : "Projects & Submissions"}
        desc={
          role === "trainer"
            ? "Suggest industry-relevant projects for trainees to build real-world skills."
            : "Explore projects suggested by trainers and submit your work."
        }
        action={
          role === "trainer" ? (
            <button className="primary" onClick={() => setShowForm(!showForm)}>
              <Plus size={16} />
              {showForm ? "Close" : "Suggest project"}
            </button>
          ) : undefined
        }
      />

      {showForm && role === "trainer" && (
        <ProjectSuggestionForm
          onClose={() => setShowForm(false)}
        />
      )}

      {role === "trainee" && (
        <div className="filters mb-5">
          <button
            className={`filter ${tab === "browse" ? "active" : ""}`}
            onClick={() => setTab("browse")}
          >
            Browse Projects
          </button>
          <button
            className={`filter ${tab === "submissions" ? "active" : ""}`}
            onClick={() => setTab("submissions")}
          >
            My Submissions ({submissions.length})
          </button>
        </div>
      )}

      {(role === "trainer" || tab === "browse") && (
        <>
          <div className="filters mb-5">
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
              <button
                key={d}
                className={`filter ${filter === d ? "active" : ""}`}
                onClick={() => setFilter(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                role={role}
                submissions={submissions.filter(
                  (s) => s.projectId === project.id,
                )}
                onSelect={() => setSelectedProject(project.id)}
                isSelected={selectedProject === project.id}
              />
            ))}
            {!filtered.length && (
              <section className="panel empty-state">
                <Code2 size={40} />
                <h2>No projects yet</h2>
                <p>Trainers can suggest projects for trainees to work on.</p>
              </section>
            )}
          </div>
        </>
      )}

      {role === "trainer" && tab === "submissions" && (
        <SubmissionReviewList submissions={submissions} projects={projects} />
      )}

      {role === "trainee" && tab === "submissions" && (
        <SubmissionReviewList
          submissions={submissions}
          projects={projects}
          traineeOnly
        />
      )}

      {selectedProject && role === "trainee" && (
        <SubmitProjectModal
          projectId={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

function ProjectCard({
  project,
  role,
  submissions,
  onSelect,
  isSelected,
}: {
  project: ProjectSuggestion;
  role: Role;
  submissions: ProjectSubmission[];
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="panel project-card">
      <div className="project-card-header">
        <span className={`pill ${difficultyColor[project.difficulty]}`}>
          {project.difficulty.toUpperCase()}
        </span>
        <small>by {project.createdBy}</small>
      </div>
      <h3>{project.title}</h3>
      <p>
        {expanded
          ? project.description
          : project.description.slice(0, 140) + "..."}
      </p>
      {project.description.length > 140 && (
        <button
          className="text-link"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      <div className="project-tags">
        {project.techStack.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>

      <div className="project-skills">
        <small>Skills gained:</small>
        <div className="skill-pills">
          {project.skillsGained.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {project.resources.length > 0 && (
        <div className="project-resources">
          {project.resources.map((r) => (
            <a
              key={r.label}
              href={r.url}
              className="resource-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={13} />
              {r.label}
            </a>
          ))}
        </div>
      )}

      {role === "trainee" && (
        <div className="project-card-footer">
          <button className="primary" onClick={onSelect}>
            <Send size={14} />
            Submit your work
          </button>
        </div>
      )}

      {role === "trainer" && submissions.length > 0 && (
        <div className="project-card-footer">
          <span className="submission-count">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </article>
  );
}

function ProjectSuggestionForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState("");
  return (
    <form
      className="panel feedback-form project-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = String(data.get("title")).trim();
        const description = String(data.get("description")).trim();
        if (!title || !description) {
          setStatus("Please fill in all required fields.");
          return;
        }
        updateDemo((prev) => ({
          ...prev,
          projects: [
            {
              id: crypto.randomUUID(),
              title,
              description,
              difficulty: String(data.get("difficulty")) as
                | "Beginner"
                | "Intermediate"
                | "Advanced",
              techStack: String(data.get("techStack"))
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              skillsGained: String(data.get("skillsGained"))
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              resources: [],
              createdBy: "Dr. Ananya Rao",
              createdAt: new Date().toISOString(),
            },
            ...prev.projects,
          ],
        }));
        setStatus("Project suggestion published!");
        setTimeout(() => {
          onClose();
          setStatus("");
        }, 1200);
      }}
    >
      <h3>Suggest a new project</h3>
      <label>
        Project Title *
        <input name="title" required maxLength={120} />
      </label>
      <label>
        Description *
        <textarea name="description" required rows={3} maxLength={1000} />
      </label>
      <div className="form-grid">
        <label>
          Difficulty
          <select name="difficulty">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Recommended Tech Stack (comma-separated)
          <input
            name="techStack"
            placeholder="React, Python, TensorFlow..."
          />
        </label>
      </div>
      <label>
        Skills Gained (comma-separated)
        <input
          name="skillsGained"
          placeholder="API Integration, Data Analysis..."
        />
      </label>
      <div className="form-actions">
        <button className="primary">Publish suggestion</button>
        <button className="secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
      {status && <p role="status">{status}</p>}
    </form>
  );
}

function SubmitProjectModal({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState("");
  const { projects } = useDemo();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="panel modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Submit your project</h3>
          <button className="icon-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <p className="modal-subtitle">{project.title}</p>
        <form
          className="feedback-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const githubLink = String(data.get("githubLink")).trim();
            if (!githubLink) {
              setStatus("GitHub link is required.");
              return;
            }
            updateDemo((prev) => ({
              ...prev,
              submissions: [
                {
                  id: crypto.randomUUID(),
                  projectId,
                  traineeName: "Vikram Kumar",
                  githubLink,
                  deployedLink: String(data.get("deployedLink")).trim(),
                  documentation: String(data.get("documentation")).trim(),
                  notes: String(data.get("notes")).trim(),
                  status: "pending",
                  feedback: "",
                  submittedAt: new Date().toISOString(),
                },
                ...prev.submissions,
              ],
            }));
            setStatus("Project submitted successfully!");
            setTimeout(onClose, 1500);
          }}
        >
          <label>
            GitHub Repository Link *
            <input
              name="githubLink"
              required
              placeholder="https://github.com/..."
            />
          </label>
          <label>
            Deployed Project Link
            <input
              name="deployedLink"
              placeholder="https://your-project.vercel.app"
            />
          </label>
          <label>
            Project Documentation
            <input
              name="documentation"
              placeholder="Link to docs or README"
            />
          </label>
          <label>
            Additional Notes
            <textarea name="notes" rows={3} maxLength={1000} />
          </label>
          <button className="primary wide">
            <Send size={14} />
            Submit Project
          </button>
          {status && <p role="status">{status}</p>}
        </form>
      </div>
    </div>
  );
}

function SubmissionReviewList({
  submissions,
  projects,
  traineeOnly = false,
}: {
  submissions: ProjectSubmission[];
  projects: ProjectSuggestion[];
  traineeOnly?: boolean;
}) {
  const filtered = traineeOnly
    ? submissions.filter((s) => s.traineeName === "Vikram Kumar")
    : submissions;

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle2 size={16} color="#2d966c" />;
    if (s === "needs-revision")
      return <AlertCircle size={16} color="#c27b27" />;
    return <Clock size={16} color="#7d9099" />;
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>
            {traineeOnly ? "My Submissions" : "All Submissions"}
          </h3>
          <p>Review and manage project submissions</p>
        </div>
      </div>
      {!filtered.length ? (
        <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>
          No submissions yet.
        </p>
      ) : (
        <div className="submission-list">
          {filtered.map((sub) => {
            const project = projects.find((p) => p.id === sub.projectId);
            return (
              <SubmissionItem
                key={sub.id}
                submission={sub}
                project={project}
                statusIcon={statusIcon}
                showReview={!traineeOnly}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SubmissionItem({
  submission,
  project,
  statusIcon,
  showReview,
}: {
  submission: ProjectSubmission;
  project?: ProjectSuggestion;
  statusIcon: (s: string) => React.ReactNode;
  showReview: boolean;
}) {
  const [feedbackText, setFeedbackText] = useState(submission.feedback);
  return (
    <div className="submission-item">
      <div className="submission-info">
        <div className="submission-header">
          <strong>{project?.title || "Unknown Project"}</strong>
          <span className="submission-status">
            {statusIcon(submission.status)}
            {submission.status.replace("-", " ").toUpperCase()}
          </span>
        </div>
        <small>
          Submitted by {submission.traineeName} ·{" "}
          {new Date(submission.submittedAt).toLocaleDateString("en-IN")}
        </small>
        <div className="submission-links">
          {submission.githubLink && (
            <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" className="resource-link">
              <Github size={13} /> GitHub
            </a>
          )}
          {submission.deployedLink && (
            <a href={submission.deployedLink} target="_blank" rel="noopener noreferrer" className="resource-link">
              <Globe size={13} /> Live Demo
            </a>
          )}
          {submission.documentation && (
            <a href={submission.documentation} target="_blank" rel="noopener noreferrer" className="resource-link">
              <FileText size={13} /> Docs
            </a>
          )}
        </div>
        {submission.notes && (
          <p className="submission-notes">{submission.notes}</p>
        )}
      </div>

      {showReview && (
        <div className="submission-review">
          <textarea
            placeholder="Add feedback..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={2}
          />
          <div className="review-actions">
            <button
              className="approve"
              onClick={() => {
                updateDemo((prev) => ({
                  ...prev,
                  submissions: prev.submissions.map((s) =>
                    s.id === submission.id
                      ? {
                          ...s,
                          status: "approved" as const,
                          feedback: feedbackText,
                          reviewedAt: new Date().toISOString(),
                        }
                      : s,
                  ),
                }));
              }}
            >
              <CheckCircle2 size={13} /> Approve
            </button>
            <button
              className="reject"
              onClick={() => {
                updateDemo((prev) => ({
                  ...prev,
                  submissions: prev.submissions.map((s) =>
                    s.id === submission.id
                      ? {
                          ...s,
                          status: "needs-revision" as const,
                          feedback: feedbackText,
                          reviewedAt: new Date().toISOString(),
                        }
                      : s,
                  ),
                }));
              }}
            >
              Needs Revision
            </button>
          </div>
        </div>
      )}

      {!showReview && submission.feedback && (
        <div className="submission-feedback">
          <strong>Trainer Feedback:</strong>
          <p>{submission.feedback}</p>
        </div>
      )}
    </div>
  );
}
