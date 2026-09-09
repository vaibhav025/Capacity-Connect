import { useState } from "react";
import { courses } from "../data/demo";
import { progressOf } from "../lib/demoStore";
import { Link } from "react-router-dom";
import { PageTitle } from "../components/ui/PageTitle";
import { updateDemo, useDemo, type ProfileRecord } from "../lib/demoStore";
import type { Role } from "../types/domain";
const fields: [keyof ProfileRecord, string][] = [
  ["name", "Full name"],
  ["unit", "Department / unit"],
  ["designation", "Designation"],
  ["location", "Location / station"],
  ["qualifications", "Qualifications"],
  ["experience", "Work experience"],
  ["interests", "Professional interests"],
  ["skills", "Skills (comma separated)"],
  ["certificates", "Certificates and issuing organisations"],
];
export function Profile({ role }: { role: Role }) {
  const { profiles, learning } = useDemo();
  const defaults: ProfileRecord = {
    name:
      role === "admin"
        ? "Anil Sharma"
        : role === "trainer"
          ? "Dr. Ananya Rao"
          : "Vikram Kumar",
    unit: "Regional Meteorological Centre",
    designation: role === "trainer" ? "Senior Scientist" : "Scientist B",
    location: "New Delhi",
    qualifications: "",
    experience: "",
    interests: "",
    skills: "Doppler Radar, Weather Forecasting",
    certificates: "",
  };
  const [draft, setDraft] = useState(profiles[role] || defaults);
  const [status, setStatus] = useState("");
  const completion = Math.round(
    (fields.filter(([key]) => draft[key].trim()).length / fields.length) * 100,
  );
  return (
    <>
      <PageTitle
        title="Professional profile"
        desc="Build a record of your skills, experience and interests."
      />
      <section className="profile-identity" aria-label="Professional identity">
        <div className="avatar large" aria-hidden="true">
          {draft.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </div>
        <div>
          <p className="eyebrow">{role.toUpperCase()} · IMD LEARNING NETWORK</p>
          <h2>{draft.name}</h2>
          <p>
            {draft.designation} · {draft.unit}
            <br />
            {draft.location}
          </p>
          <div className="skill-summary" aria-label="Self-reported skills">
            {draft.skills
              .split(",")
              .filter((skill) => skill.trim())
              .map((skill, index) => (
                <span key={index}>{skill.trim()}</span>
              ))}
          </div>
        </div>
      </section>
      <section className="profile-learning" aria-label="Learning evidence">
        <div>
          <small>
            {role === "trainee"
              ? "Your enrolled paths"
              : "Observed demo enrollments"}
          </small>
          <strong>
            {Object.values(learning).filter((record) => record.enrolled).length}
          </strong>
        </div>
        <div>
          <small>Completed paths</small>
          <strong>
            {
              courses.filter(
                (course) => progressOf(learning[course.id]) === 100,
              ).length
            }
          </strong>
        </div>
        <div>
          <small>Demonstrated learning</small>
          <Link
            to={`/${role}/${role === "trainee" ? "certificates" : "performance"}`}
          >
            {role === "trainee" ? "View certificates" : "View learner evidence"}
          </Link>
        </div>
      </section>
      <form
        className="panel profile-panel"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            updateDemo((previous) => ({
              ...previous,
              profiles: { ...previous.profiles, [role]: draft },
            }));
            setStatus("Profile saved in this browser.");
          } catch {
            setStatus("Unable to save profile. Check browser storage.");
          }
        }}
      >
        <div className="panel-head">
          <div>
            <h3>{draft.name || "Your professional profile"}</h3>
            <p>Self-reported evidence · awaiting organisational verification</p>
          </div>
          <span className="pill">{completion}% complete</span>
        </div>
        <div className="progress mb-6">
          <i style={{ width: completion + "%" }} />
        </div>
        <div className="form-grid">
          {fields.map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                required={key === "name"}
                maxLength={500}
                value={draft[key]}
                onChange={(event) => {
                  setDraft({ ...draft, [key]: event.target.value });
                  setStatus("");
                }}
              />
            </label>
          ))}
        </div>
        <button className="primary">Save changes</button>
        <p role="status" className="support-copy">
          {status}
        </p>
      </form>
    </>
  );
}
