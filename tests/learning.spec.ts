import { test, expect } from "@playwright/test";

test("enrollment, completion, assessment and certificate form a persistent journey", async ({
  page,
}) => {
  await page.goto("/trainee/certificates");
  await expect(
    page.getByText("Your next achievement starts here"),
  ).toBeVisible();
  await page.goto("/trainee/courses/radar");
  await page.getByRole("button", { name: "Enroll in course" }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Mark note complete" }).click();
    if (i < 2) await page.getByRole("button", { name: "Next note" }).click();
  }
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Enrolled", exact: true }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Knowledge check" }).click();
  await page.getByRole("radio", { name: "Radial velocity" }).check();
  await page.getByRole("button", { name: "Next question" }).click();
  await page
    .getByRole("radio", { name: "Larger or more numerous hydrometeors" })
    .check();
  await page.getByRole("button", { name: "Check answers" }).click();
  await page.getByRole("link", { name: "View earned certificate" }).click();
  await expect(page.getByText("Score 100%", { exact: false })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download record" }).click();
  expect((await download).suggestedFilename()).toMatch(/^CC-DEMO-RADAR-/);
  await page.screenshot({
    path: "artifacts/earned-certificate.png",
    fullPage: true,
  });
});

test("announcements reach their audience and profiles survive reload", async ({
  page,
}) => {
  await page.goto("/admin/announcements");
  await page.getByRole("button", { name: "New announcement" }).click();
  await page
    .getByLabel("Title", { exact: true })
    .fill("Radar workshop registration");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Complete the introductory learning path before attending.");
  await page.getByLabel("Audience").selectOption("trainee");
  await page.getByRole("button", { name: "Publish announcement" }).click();
  await page.getByLabel("Switch demo role").selectOption("trainee");
  await expect(
    page.getByRole("heading", { name: "Radar workshop registration" }),
  ).toBeVisible();
  await page.goto("/trainer/announcements");
  await expect(
    page.getByRole("heading", { name: "Radar workshop registration" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New announcement" }),
  ).toHaveCount(0);
  await page.goto("/trainee/profile");
  await page
    .getByLabel("Qualifications", { exact: true })
    .fill("MSc Atmospheric Science");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await expect(page.getByLabel("Qualifications", { exact: true })).toHaveValue(
    "MSc Atmospheric Science",
  );
});

test("new layouts remain accessible on narrow screens and checks are gated", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/trainee/dashboard",
    "/trainee/courses/radar",
    "/admin/announcements",
    "/trainer/profile",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    path: "artifacts/profile-mobile.png",
    fullPage: true,
  });
  await page.goto("/trainee/assessments?course=radar");
  await expect(
    page.getByText("Complete your learning notes first"),
  ).toBeVisible();
  await page.goto("/admin/dashboard");
  await page.screenshot({
    path: "artifacts/mission-mobile.png",
    fullPage: true,
  });
});
