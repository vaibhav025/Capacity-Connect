import { useState } from "react";
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
  const { profiles } = useDemo();
  const defaults: ProfileRecord = {
    name: role === "trainer" ? "Dr. Ananya Rao" : "Vikram Kumar",
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
