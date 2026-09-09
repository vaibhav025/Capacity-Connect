# Capacity Connect frontend redesign

Implemented in the existing React/TypeScript/Vite application. No packages were installed; role URLs, demo learning state, Supabase files, Express routes, assessment grading and certificate downloads remain intact.

## Architecture audit

- App.tsx defines login and admin/trainer/trainee route prefixes. Shell owns the existing role-specific page routes.
- Learning content and course metadata live in src/data; the external React store in src/lib/demoStore.ts persists enrollments, completed notes, scores, certificates, notices, profiles and bookmarks in the existing browser storage key.
- Login is an explicit demo role entry point. It was not replaced with a different authentication system.
- Express exposes competency recommendations, courses, approvals and assessment submission; Supabase configuration and migrations remain unchanged. Live authenticated Supabase services were not exercised.
- Existing motion used Lenis, Framer Motion, Recharts and Vanta. The former per-card scroll subscriptions are now shared viewport reveals. The installed Motion reduced-motion hook snapshots its initial setting, so a reactive useSyncExternalStore hook handles live preference changes.
- Existing tests exercise login/canvas cleanup, trainer content staging, question drafts, competency service errors and focus, persistent learning/certificates, profiles and announcements.

## UI and interaction changes

- Navy workspace with collapsible desktop sidebar, animated active navigation, sticky compacting header, role switcher and profile navigation.
- Keyboard-searchable course command dialog (Ctrl/Cmd K), native modal focus containment, Escape dismissal, mobile navigation focus trap and restoration, skip-to-content link.
- Role-aware learning mission, real local enrollment/completion counts, atmospheric illustration and learning-stage sequence.
- Semantic colour tokens, refined typography, opaque data surfaces, consistent controls and scientific course visuals. New styles are split into foundation, workspace, mission, surfaces, learning, login and responsive files. Existing functional layout rules were preserved; obsolete readiness hero rules were removed from mission.css.
- Animated KPI numbers; chart metric highlighting, real 3/6-month controls, gradient areas and accessible data table.
- Course-specific outcomes, persistent bookmarks, progress rings, animated collapsible module outline, focused assessment questions and question navigator. Existing grading and certificate eligibility are preserved.
- Competency matching now presents returned scoring breakdowns, matched competencies and evidence gaps when the API supplies them. No fictional employee proficiency is introduced.
- Announcement category filters and expansion for long messages; professional identity and self-reported skills; observed learning evidence; refined certificate cards and original record downloads.

## 3D, motion and performance

- TrainerScene is lazy-loaded only on fine-pointer desktop layouts at least 1024px wide, outside the critical render path.
- The supplied visual is a procedural Three.js learning instrument: shaded globe, wireframe, three radar rings, ten small knowledge nodes and a dimensional learning board. It is not a human instructor model.
- Scroll drives orientation, depth, learning board and radar emergence, HTML-overlay parallax and scene fade. Pointer camera response is bounded. The hero is a contained dashboard chapter, not a long scroll-locked marketing page.
- Render rate is approximately 30fps, DPR capped at 1.5. Offscreen and hidden-document loops pause; geometry, materials, textures and renderer are disposed on teardown. The small drawing buffer is retained so a paused scene remains visible.
- Coarse-pointer/mobile and reduced-motion users receive a CSS/SVG illustration. WebGL creation failure, context loss and lazy component failure leave the workspace usable.
- Route components are split. Shared React code is separate from chart code so chart and Three.js chunks are not preloaded by index.html.
- The existing Three.js dependency still produces a 613.48 kB minified chunk (156.63 kB gzip) and Vite's 500 kB advisory. It is deferred; no warning limit was raised.

## Asset handoff

Supply a licensed professional instructor model at public/models/trainer.glb and restart Vite/rebuild. The loader discovers only files that exist, normalises scale/centre and keeps the procedural scene on model failure. No missing asset is requested. See public/models/README.md for model guidance. No real instructor model was available, so its appearance cannot be verified yet. No dark-mode toggle was added; semantic tokens provide a foundation.

## Verification

- npm run typecheck: passed.
- npm run build: passed, with the deferred Three.js chunk-size advisory above.
- npm run test:e2e: 19 passed (1.8 minutes), including all seven original tests.
- node --test server/services/competency.test.js: 2 passed.
- git diff --check: passed.
- New checks cover search/navigation, live reduced-motion changes, WebGL context-loss fallback, no absent model requests, chart filters, bookmark persistence and module collapse.
- Fourteen route/layout combinations checked at each of 320, 375, 430, 768, 1024, 1280, 1440 and 1920px: no document overflow or page errors in those checks.
- Visually reviewed Edge/Playwright captures of desktop 3D dashboard, desktop catalogue/login/certificate and mobile/tablet dashboards, course reader and profile. The connected Browser tool reported no browser; repository-configured Edge was used for captures.
- Screenshots are generated under artifacts/ (ignored by Git), including redesign-dashboard-3d.png and redesign-{width}--{role}-{page}.png.

## Files created

- `docs/FRONTEND-REDESIGN.md`
- `public/models/README.md`
- `src/components/3d/AtmosphereScene.ts`
- `src/components/3d/SceneBoundary.tsx`
- `src/components/3d/TrainerModel.ts`
- `src/components/3d/TrainerScene.tsx`
- `src/components/3d/TrainerSceneFallback.tsx`
- `src/components/ui/AnimatedCounter.tsx`
- `src/components/ui/SearchCommand.tsx`
- `src/experience.css`
- `src/lib/motion.ts`
- `src/styles/foundation.css`
- `src/styles/learning.css`
- `src/styles/login.css`
- `src/styles/mission-scene.css`
- `src/styles/responsive.css`
- `src/styles/surfaces.css`
- `src/styles/workspace.css`
- `tests/workspace.spec.ts`

## Files modified

- `index.html`
- `src/components/admin/CompetencyMatchModal.tsx`
- `src/components/admin/InteractiveKPICharts.tsx`
- `src/components/admin/ReadinessOverview.tsx`
- `src/components/layout/AnimatedPageTransition.tsx`
- `src/components/layout/InteractiveHero.tsx`
- `src/components/layout/LenisSmoothScroll.tsx`
- `src/components/layout/Shell.tsx`
- `src/components/trainee/AnimatedProgressRing.tsx`
- `src/components/trainee/AssessmentPlayer.tsx`
- `src/components/trainee/CourseCatalogCard.tsx`
- `src/components/trainer/DragDropContentUploader.tsx`
- `src/components/ui/AnimatedButtons.tsx`
- `src/components/ui/ScrollRevealWrapper.tsx`
- `src/components/ui/Stat.tsx`
- `src/components/ui/Tooltips.tsx`
- `src/main.tsx`
- `src/mission.css`
- `src/pages/Announcements.tsx`
- `src/pages/Competency.tsx`
- `src/pages/CourseDetail.tsx`
- `src/pages/Courses.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Login.tsx`
- `src/pages/Performance.tsx`
- `src/pages/Profile.tsx`
- `src/styles.css`
- `vite.config.ts`
