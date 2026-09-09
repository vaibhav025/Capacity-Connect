import { test } from "node:test";
import assert from "node:assert/strict";
import { rankTrainers } from "./competency.js";
import { demoTrainers } from "./demoTrainers.js";
test("recommendations respond to evidence rather than returning fixed names", () => {
  assert.equal(
    rankTrainers({ skills: ["Doppler Radar", "Nowcasting"] }, demoTrainers)[0]
      .name,
    "Dr. Ananya Rao",
  );
  assert.equal(
    rankTrainers(
      { skills: ["Remote Sensing", "Satellite Interpretation"] },
      demoTrainers,
    )[0].name,
    "Dr. Meera Iyer",
  );
  assert.equal(
    rankTrainers({ skills: ["Python", "Climate Data"] }, demoTrainers)[0].name,
    "Arjun Sen",
  );
  assert.deepEqual(
    rankTrainers({ skills: ["Unrepresented topic"] }, demoTrainers),
    [],
  );
});
test("unapproved trainers and empty requirements cannot produce recommendations", () => {
  assert.deepEqual(rankTrainers({ skills: [] }, demoTrainers), []);
  assert.deepEqual(
    rankTrainers(
      { skills: ["Doppler Radar"] },
      demoTrainers.map((t) => ({ ...t, status: "PENDING" })),
    ),
    [],
  );
  const result = rankTrainers(
    { skills: ["Doppler Radar", "Nowcasting"] },
    demoTrainers,
  );
  assert.ok(result.every((t) => t.score >= 0 && t.score <= 100));
  assert.ok(
    result.find((t) => t.name === "Rajiv Menon").missing.includes("nowcasting"),
  );
});
