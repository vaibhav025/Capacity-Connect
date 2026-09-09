import { demoTrainers } from "./services/demoTrainers.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { hasSupabase, supabaseAdmin } from "./config/supabase.js";
import { rankTrainers } from "./services/competency.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    service: "capacity-connect-api",
    supabase: hasSupabase,
  }),
);
app.post("/api/competency/recommendations", async (req, res) => {
  const topic = req.body?.topic || {
    skills: ["Doppler Radar", "Nowcasting", "Data Interpretation"],
  };
  if (
    !Array.isArray(topic.skills) ||
    !topic.skills.length ||
    topic.skills.length > 20 ||
    topic.skills.some(
      (s) => typeof s !== "string" || !s.trim() || s.length > 100,
    )
  )
    return res
      .status(400)
      .json({ error: "Provide 1 to 20 valid competency names." });
  if (!hasSupabase)
    return res.json({
      model_version: "1.1-demo",
      results: rankTrainers(topic, demoTrainers),
    });
  try {
    const { data, error } = await supabaseAdmin
      .from("trainer_competency_view")
      .select("*");
    if (error) throw error;
    res.json({
      model_version: "1.0",
      results: rankTrainers(topic, data || []),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get("/api/courses", async (req, res) => {
  if (!hasSupabase) return res.json({ courses: [], demo: true });
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*,course_modules(*)")
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ courses: data });
});
async function requireAdmin(req, res, next) {
  if (!hasSupabase) return next();
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: "Sign in required." });
  const { data: auth, error: authError } =
    await supabaseAdmin.auth.getUser(token);
  if (authError || !auth.user)
    return res.status(401).json({ error: "Invalid session." });
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("status")
    .eq("id", auth.user.id)
    .single();
  const { data: assignment, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id)
    .single();
  if (
    error ||
    roleError ||
    assignment?.role !== "ADMIN" ||
    profile?.status !== "APPROVED"
  )
    return res.status(403).json({ error: "Approved admin access required." });
  next();
}
app.post("/api/admin/users/:id/approve", requireAdmin, async (req, res) => {
  if (!hasSupabase) return res.json({ ok: true, demo: true });
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ status: "APPROVED" })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ profile: data });
});
app.post("/api/assessments/:id/submit", async (req, res) => {
  if (!hasSupabase) return res.json({ score: 82, passed: true, demo: true });
  res
    .status(501)
    .json({
      error:
        "Wire assessment submission to authenticated attempt service before production.",
    });
});
app.listen(process.env.PORT || 4000, () =>
  console.log(`Capacity Connect API listening on ${process.env.PORT || 4000}`),
);
