import { BrainCircuit, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { CompetencyMatchModal } from "../components/admin/CompetencyMatchModal";
import { AnimatedButtons } from "../components/ui/AnimatedButtons";
import { PageTitle } from "../components/ui/PageTitle";
const topics = [
  {
    name: "Doppler Weather Radar Operations",
    skills: ["Doppler Radar", "Nowcasting", "Data Interpretation"],
  },
  {
    name: "Satellite Image Interpretation",
    skills: ["Remote Sensing", "Satellite Interpretation"],
  },
  {
    name: "Tropical Cyclone Forecasting",
    skills: ["Cyclone Forecasting", "Severe Weather"],
  },
  { name: "Python for Climate Data", skills: ["Python", "Climate Data"] },
];
export function Competency() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const topic = useMemo(() => topics[index], [index]);
  return (
    <>
      <PageTitle
        kicker="ADMIN CONSOLE · INTELLIGENCE"
        title="Competency mapping"
        desc="Connect the right expertise to your next learning programme."
      />
      <div className="mapping-layout">
        <section className="panel mapping-form">
          <div className="mapping-intro">
            <div className="feature-icon">
              <BrainCircuit />
            </div>
            <div>
              <h3>Define the requirement</h3>
              <p>Six explainable signals. One informed decision.</p>
            </div>
          </div>
          <label>
            Subject or topic
            <select
              value={index}
              onChange={(event) => setIndex(Number(event.target.value))}
            >
              {topics.map((item, i) => (
                <option value={i} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-slate-500">Required competencies</p>
          <div className="tag-input">
            {topic.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <div className="weights">
            <span>
              Scoring model <b>v1.0</b>
            </span>
            <small>
              Skills 35% · Experience 20% · Performance 15% · Qualification 15%
              · Availability 10% · Certifications 5%
            </small>
          </div>
          <AnimatedButtons
            className="primary wide mt-6"
            onClick={() => setOpen(true)}
          >
            <Sparkles size={17} /> Find best trainers
          </AnimatedButtons>
        </section>
        <section className="panel mapping-empty">
          <p className="eyebrow">CAPABILITY → OPERATIONAL READINESS</p>
          <h2>
            Make expertise
            <br />
            actionable.
          </h2>
          <div className="capability-flow">
            <div>
              <b>01</b>
              <section>
                <strong>Current capability</strong>
                <p>
                  Approved trainer profiles, experience and learning evidence.
                </p>
              </section>
            </div>
            <div>
              <b>02</b>
              <section>
                <strong>Required skills</strong>
                <p>{topic.skills.join(" · ")}</p>
              </section>
            </div>
            <div>
              <b>03</b>
              <section>
                <strong>Recommended training expertise</strong>
                <p>
                  Compare matches across six weighted signals. Inspect evidence
                  gaps before assigning a trainer.
                </p>
              </section>
            </div>
            <div>
              <b>04</b>
              <section>
                <strong>Target capability</strong>
                <p>
                  {topic.name}: supported by guided learning and demonstrated
                  understanding.
                </p>
              </section>
            </div>
          </div>
        </section>
      </div>
      <CompetencyMatchModal
        open={open}
        topic={topic}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
