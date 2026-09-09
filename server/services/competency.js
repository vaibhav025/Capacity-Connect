export const WEIGHTS = {
  skills: 0.35,
  experience: 0.2,
  qualification: 0.15,
  performance: 0.15,
  availability: 0.1,
  certifications: 0.05,
};
const clamp = (value) =>
  Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : 0));
export function rankTrainers(topic, trainers) {
  const required = [
    ...new Set(
      (topic.skills || [])
        .filter((s) => typeof s === "string")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  if (!required.length) return [];
  return trainers
    .filter((t) => t.status === "APPROVED")
    .map((t) => {
      const skills = (t.skills || [])
        .filter((s) => typeof s === "string")
        .map((s) => s.trim().toLowerCase());
      const matched = required.filter((skill) => skills.includes(skill));
      const missing = required.filter((skill) => !skills.includes(skill));
      const breakdown = {
        skills: matched.length / required.length,
        experience: clamp((t.relevant_years || 0) / 10),
        qualification: clamp(t.qualification_match),
        performance: clamp(t.performance),
        availability: clamp(t.availability),
        certifications: clamp(t.certifications),
      };
      const score =
        Object.entries(WEIGHTS).reduce(
          (sum, [key, weight]) => sum + breakdown[key] * weight,
          0,
        ) * 100;
      return {
        trainer_id: t.id,
        name: t.name,
        score: Math.round(score * 10) / 10,
        breakdown,
        matched,
        missing,
        explanation: `Matches ${matched.length} of ${required.length} required competencies: ${matched.join(", ") || "none"}. ${missing.length ? "Evidence gap: " + missing.join(", ") + ". " : ""}${t.relevant_years || 0} years of experience; learner rating ${Number(t.rating || 0).toFixed(1)}/5. Weighted decision support, not a probability of teaching success.`,
      };
    })
    .filter((t) => t.matched.length > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 3);
}
