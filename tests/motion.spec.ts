import { test, expect } from "@playwright/test";
test("hero owns one canvas and cleans up across role navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/login");
  await expect(page.locator(".hero-canvas canvas")).toHaveCount(1);
  await page.screenshot({
    path: "artifacts/login-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Trainee", exact: true }).click();
  await page.evaluate(() => {
    const scope = window as unknown as {
      VANTA: {
        current: {
          renderer: { dispose: () => void; forceContextLoss: () => void };
        };
      };
      cleanup: { dispose: number; loss: number };
    };
    scope.cleanup = { dispose: 0, loss: 0 };
    const renderer = scope.VANTA.current.renderer;
    const dispose = renderer.dispose.bind(renderer);
    const loss = renderer.forceContextLoss.bind(renderer);
    renderer.dispose = () => {
      scope.cleanup.dispose++;
      dispose();
    };
    renderer.forceContextLoss = () => {
      scope.cleanup.loss++;
      loss();
    };
  });
  await page.getByRole("button", { name: "Enter demo workspace" }).click();
  await expect(page.locator(".hero-canvas canvas")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as { cleanup: unknown }).cleanup,
    ),
  ).toEqual({ dispose: 1, loss: 1 });
  await page
    .getByRole("link", { name: "Course catalogue", exact: true })
    .click();
  await expect(page.locator(".course-card")).toHaveCount(4);
  await page.locator(".course-card").first().hover();
  await page
    .getByRole("button", { name: "Bookmark course", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Remove bookmark", exact: true }).first(),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("textbox", { name: "Search courses" }).fill("satellite");
  await expect(page.locator(".course-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search courses" }).fill("");
  await page.screenshot({
    path: "artifacts/catalog-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.locator(".hero-canvas canvas")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-canvas canvas")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  expect(errors).toEqual([]);
});
test("trainer can stage, reorder and validate content", async ({ page }) => {
  await page.goto("/trainer/courses");
  await page.getByRole("button", { name: "Create course" }).click();
  await page.locator("input[type=file]").setInputFiles([
    {
      name: "first.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 demo"),
    },
    {
      name: "second.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 demo"),
    },
  ]);
  await expect(page.locator(".asset-row")).toHaveCount(2);
  await page.getByRole("button", { name: "Move second.pdf up" }).click();
  await expect(page.locator(".asset-row").first()).toContainText("second.pdf");
  await page.getByRole("button", { name: "Remove second.pdf" }).click();
  await expect(page.locator(".asset-row")).toHaveCount(1);
  await page.screenshot({
    path: "artifacts/trainer-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Assessments", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Question text" })
    .fill("Which product measures motion?");
  await page.getByRole("textbox", { name: "Choice 1" }).fill("Velocity");
  await page.getByRole("textbox", { name: "Choice 2" }).fill("Reflectivity");
  await page.getByRole("button", { name: "Validate draft" }).click();
  await expect(page.getByRole("status")).toContainText("Validated 1 questions");
});
test("admin scan exposes API results, handles failure and restores focus", async ({
  page,
}) => {
  await page.route("**/api/competency/recommendations", async (route) => {
    expect(route.request().postDataJSON().topic.skills).toContain(
      "Doppler Radar",
    );
    await route.fulfill({
      json: {
        model_version: "test",
        results: [
          {
            trainer_id: "test",
            name: "Test Trainer",
            score: 96,
            explanation: "Matches required skills.",
          },
        ],
      },
    });
  });
  await page.goto("/admin/competency-mapping");
  await page.getByRole("button", { name: "Find best trainers" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("status").first()).toContainText("Scanning");
  await expect(
    page.getByRole("heading", { name: "Test Trainer" }),
  ).toBeVisible();
  await expect(page.locator('.scan-surface')).toHaveCount(0);
  await page.screenshot({
    path: "artifacts/competency-desktop.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Find best trainers" }),
  ).toBeFocused();
  await page.unroute("**/api/competency/recommendations");
  await page.route("**/api/competency/recommendations", (route) =>
    route.fulfill({ status: 500, body: "{}" }),
  );
  await page.getByRole("button", { name: "Find best trainers" }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
});
test("mobile routes fit the viewport and practice can be completed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/login",
    "/admin/dashboard",
    "/trainee/courses",
    "/trainer/library",
    "/admin/competency-mapping",
  ]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `artifacts/mobile-${path.split("/").filter(Boolean).join("-")}.png`,
      fullPage: true,
    });
  }
  await page.goto("/trainee/assessments");
  await page.getByRole("radio", { name: "Radial velocity" }).check();
  await page.getByRole("button", { name: "Next question" }).click();
  await page
    .getByRole("radio", { name: "Larger or more numerous hydrometeors" })
    .check();
  await page.getByRole("button", { name: "Check answers" }).click();
  await expect(page.getByRole("status")).toContainText("2 of 2 correct");
});
