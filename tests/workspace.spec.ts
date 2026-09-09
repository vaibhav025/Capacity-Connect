import { expect, test } from "@playwright/test";

test("workspace search, collapsed sidebar and mobile focus remain usable", async ({
  page,
}) => {
  await page.goto("/trainee/dashboard");
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.locator(".app-shell")).toHaveClass(/sidebar-collapsed/);
  await page
    .getByRole("link", { name: "Course catalogue", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Course catalogue");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search learning paths" })
    .fill("satellite");
  await expect(page.locator(".command-results a")).toHaveCount(1);
  await page.locator(".command-results a").click();
  await expect(page.locator("h1")).toHaveText("Satellite Meteorology");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Sign out" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await expect(page.locator("main")).not.toHaveAttribute("inert");
});

test("3D scene loads once, falls back on context loss and respects reduced motion", async ({
  page,
}) => {
  const missingModels: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (/trainer\.(glb|gltf)/.test(request.url()))
      missingModels.push(request.url());
  });
  await page.goto("/admin/dashboard");
  await expect(page.locator(".trainer-canvas.is-ready canvas")).toHaveCount(1);
  await expect(page.locator(".trainer-canvas")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "artifacts/redesign-dashboard-3d.png",
    fullPage: true,
  });
  await page
    .locator(".trainer-canvas canvas")
    .dispatchEvent("webglcontextlost");
  await expect(page.locator(".trainer-fallback")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore Learning", exact: true }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".trainer-canvas canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  expect(missingModels).toEqual([]);
  expect(errors).toEqual([]);
});

test("chart time filters expose the same accessible data", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await page.getByLabel("Learning activity time period").selectOption("3");
  await page.getByText("View chart data", { exact: true }).click();
  await expect(page.locator(".chart-data tbody tr")).toHaveCount(3);
  await expect(page.locator(".chart-data tbody")).toContainText("Jul");
  await expect(page.locator(".chart-data tbody")).not.toContainText("Apr");
});

test("bookmarks persist and the learning outline can be collapsed", async ({ page }) => {
  await page.goto("/trainee/courses");
  await page.getByRole("button", { name: "Bookmark course", exact: true }).first().click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Remove bookmark", exact: true })).toHaveCount(1);
  await page.goto("/trainee/courses/radar");
  await page.getByRole("button", { name: "Hide modules" }).click();
  await expect(page.locator("#course-module-list")).toHaveCount(0);
  await page.getByRole("button", { name: "Show modules" }).click();
  await expect(page.locator(".lesson-step")).toHaveCount(3);
});

for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) {
  test(`major workspaces fit ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [
      "/login",
      "/admin/dashboard",
      "/trainer/dashboard",
      "/trainee/dashboard",
      "/trainee/courses",
      "/trainee/courses/radar",
      "/trainee/assessments",
      "/admin/competency-mapping",
      "/admin/announcements",
      "/trainer/performance",
      "/trainee/certificates",
      "/trainer/profile",
      "/admin/users",
      "/trainer/library",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      if (
        [320, 768, 1440, 1920].includes(width) &&
        [
          "/admin/dashboard",
          "/trainee/courses",
          "/trainee/courses/radar",
          "/trainer/profile",
        ].includes(path)
      ) {
        await page.screenshot({
          path: `artifacts/redesign-${width}-${path.replaceAll("/", "-")}.png`,
          fullPage: true,
        });
      }
    }
    expect(errors).toEqual([]);
  });
}
