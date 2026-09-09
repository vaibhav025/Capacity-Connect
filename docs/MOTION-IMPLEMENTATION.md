# Capacity Connect motion implementation

## Installation commands

Run from the project directory:

```powershell
npm install framer-motion@13.2.0 three@0.134.0 vanta@0.5.24 lucide-react@0.468.0 @studio-freight/lenis@1.0.42 recharts@3.10.1 tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
npm install -D @types/three@0.134.0 @types/node@26.5.0
```

For this checked-out implementation, use `npm ci` to reproduce package-lock.json.
The requested @studio-freight/lenis package is deprecated in favor of lenis; it is retained to match the request. Three r134 matches Vanta's documented integration: [Vanta documentation](https://github.com/tengbao/vanta#readme).

## Directory tree

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── motion.css
├── components/
│   ├── layout/
│   │   ├── LenisSmoothScroll.tsx
│   │   ├── InteractiveHero.tsx
│   │   ├── AnimatedPageTransition.tsx
│   │   └── Shell.tsx
│   ├── ui/
│   │   ├── AnimatedButtons.tsx
│   │   ├── ScrollRevealWrapper.tsx
│   │   ├── Tooltips.tsx
│   │   ├── SkeletonLoaders.tsx
│   │   ├── PageTitle.tsx
│   │   └── Stat.tsx
│   ├── trainee/
│   │   ├── CourseCatalogCard.tsx
│   │   ├── AssessmentPlayer.tsx
│   │   └── AnimatedProgressRing.tsx
│   ├── trainer/
│   │   ├── DragDropContentUploader.tsx
│   │   └── QuestionnaireBuilder.tsx
│   └── admin/
│       ├── InteractiveKPICharts.tsx
│       ├── UserApprovalTable.tsx
│       └── CompetencyMatchModal.tsx
├── data/demo.ts
├── lib/supabase.ts
├── pages/ (role screens and route composition)
└── types/
    ├── domain.ts
    └── vanta.d.ts
```

## Complete critical component code

These are exact copies of the implementation, not abbreviated examples. Supporting imports, global styling, and root integration follow the four components.

### A. Global Lenis wrapper

File: `src/components/layout/LenisSmoothScroll.tsx`

```tsx
import Lenis from "@studio-freight/lenis";
import { useEffect, type PropsWithChildren } from "react";

/** One scroll owner; keeps native touch, keyboard and reduced-motion scrolling. */
export function LenisSmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
    };
    const configure = () => {
      stop();
      if (preference.matches) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
      const tick = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      stop();
    };
  }, []);
  return <>{children}</>;
}
```

### B. Interactive Vanta hero

File: `src/components/layout/InteractiveHero.tsx`

```tsx
import { useEffect, useRef, type PropsWithChildren } from "react";

/** Isolated canvas host prevents Vanta from mutating React-owned content. */
export function InteractiveHero({ children }: PropsWithChildren) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let effect: VantaEffect | undefined;
    let generation = 0;
    let disposed = false;
    let visible = true;
    let failed = false;
    const destroy = () => {
      const current = effect;
      effect = undefined;
      if (!current) return;
      const renderer = current.renderer;
      try {
        current.destroy();
      } finally {
        renderer?.dispose();
        renderer?.forceContextLoss();
        element.replaceChildren();
      }
    };
    const reconcile = async () => {
      const request = ++generation;
      destroy();
      if (
        disposed ||
        failed ||
        preference.matches ||
        document.hidden ||
        !visible
      )
        return;
      try {
        const [THREE, { default: NET }] = await Promise.all([
          import("three"),
          import("vanta/dist/vanta.net.min.js"),
        ]);
        if (disposed || request !== generation) return;
        effect = NET({
          el: element,
          THREE,
          mouseControls: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: Math.max(1, window.devicePixelRatio || 1),
          scaleMobile: 2,
          color: 0x55b6bb,
          backgroundColor: 0x0d2c40,
          points: 8,
          maxDistance: 21,
          spacing: 18,
          showDots: true,
        });
      } catch (error) {
        failed = true;
        destroy();
        console.warn(
          "WebGL background unavailable; using the static background.",
          error,
        );
      }
    };
    const sync = () => {
      void reconcile();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      failed = true;
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (visible !== entry.isIntersecting) {
        visible = entry.isIntersecting;
        sync();
      }
    });
    observer.observe(element);
    const resize = new ResizeObserver(() => effect?.resize());
    resize.observe(element);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    element.addEventListener("webglcontextlost", lost, true);
    sync();
    return () => {
      disposed = true;
      generation++;
      observer.disconnect();
      resize.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.removeEventListener("webglcontextlost", lost, true);
      destroy();
    };
  }, []);
  return (
    <section className="login-art relative isolate overflow-hidden">
      <div
        ref={host}
        aria-hidden="true"
        className="hero-canvas absolute inset-0 -z-20"
      />
      <div aria-hidden="true" className="hero-shade absolute inset-0 -z-10" />
      {children}
    </section>
  );
}
```

### C. Scroll-linked reveal

File: `src/components/ui/ScrollRevealWrapper.tsx`

```tsx
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type PropsWithChildren } from "react";

export function ScrollRevealWrapper({
  children,
  className = "",
  distance = 32,
}: PropsWithChildren<{ className?: string; distance?: number }>) {
  const target = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [distance, 0, -distance / 3],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.15, 1, 1]);
  return (
    <div ref={target} className={className}>
      <motion.div style={reduce ? undefined : { y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
```

### D. Interactive course card

File: `src/components/trainee/CourseCatalogCard.tsx`

```tsx
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  Clock3,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Course, Role } from "../../types/domain";
import { AnimatedButtons, spring } from "../ui/AnimatedButtons";
import { Tooltips } from "../ui/Tooltips";
import { AnimatedProgressRing } from "./AnimatedProgressRing";

export function CourseCatalogCard({
  course,
  role = "trainee",
}: {
  course: Course;
  role?: Role;
}) {
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const href = `/${role}/courses/${course.id}`;
  return (
    <motion.article
      className="course-card group relative h-full"
      whileHover={
        reduce
          ? undefined
          : { y: -6, scale: 1.02, boxShadow: "0 22px 50px -18px #12344a40" }
      }
      transition={spring}
    >
      <div className="course-banner" style={{ backgroundColor: course.accent }}>
        <span>{course.category}</span>
        <BookOpen size={30} aria-hidden="true" />
        <div className="course-banner-grid" aria-hidden="true" />
        <div className="quick-actions">
          <Tooltips label={saved ? "Remove bookmark" : "Bookmark course"}>
            <AnimatedButtons
              className="bookmark-button"
              aria-label={saved ? "Remove bookmark" : "Bookmark course"}
              aria-pressed={saved}
              onClick={() => setSaved(!saved)}
            >
              {saved ? <Check size={17} /> : <Bookmark size={17} />}
            </AnimatedButtons>
          </Tooltips>
          <Link
            className="bookmark-button"
            to={href}
            aria-label={`Preview ${course.title}`}
          >
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="course-card-body">
        <div className="flex items-center justify-between gap-3">
          <small className="course-code">{course.code}</small>
          <span className="pill">{course.level}</span>
        </div>
        <h3>
          <Link to={href}>{course.title}</Link>
        </h3>
        <p>
          Build practical capability through guided modules, field notes and an
          applied assessment.
        </p>
        <div className="course-meta">
          <span>
            <Clock3 size={14} /> {course.duration}
          </span>
          <span>
            <Users size={14} /> {course.learners} learners
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <small className="course-code">
              {role === "trainer" ? "LEARNER COMPLETION" : "YOUR LEARNING PATH"}
            </small>
            <div className="mt-1 text-xs text-slate-500">
              {course.progress === 100
                ? "Learning complete"
                : course.progress > 0
                  ? "Keep your momentum"
                  : "Your next opportunity"}
            </div>
          </div>
          <AnimatedProgressRing progress={course.progress} />
        </div>
        <motion.div
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={spring}
          className="mt-5"
        >
          <Link to={href} className="secondary wide">
            {role === "trainer"
              ? "Manage course"
              : course.progress === 100
                ? "Review course"
                : course.progress
                  ? "Continue learning"
                  : "Explore course"}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
        <span role="status" className="sr-only">
          {saved ? "Bookmarked for this session" : ""}
        </span>
      </div>
    </motion.article>
  );
}
```

### Supporting progress ring

File: `src/components/trainee/AnimatedProgressRing.tsx`

```tsx
import { motion, useReducedMotion } from "framer-motion";
export function AnimatedProgressRing({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const value = Math.round(
    Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0)),
  );
  return (
    <div
      role="progressbar"
      aria-label="Course completion"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="progress-ring"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="4"
        />
        <motion.circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span aria-hidden="true">{value}%</span>
    </div>
  );
}
```

### Supporting animated button

File: `src/components/ui/AnimatedButtons.tsx`

```tsx
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
export const spring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 27,
  mass: 0.7,
};
export function AnimatedButtons({
  children,
  disabled,
  ...props
}: HTMLMotionProps<"button">) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      {...props}
      disabled={disabled}
      whileHover={reduce || disabled ? undefined : { y: -2 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.96 }}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
```

### Supporting tooltip

File: `src/components/ui/Tooltips.tsx`

```tsx
import { useId, type PropsWithChildren } from "react";
export function Tooltips({
  children,
  label,
}: PropsWithChildren<{ label: string }>) {
  const id = useId();
  return (
    <span className="tooltip-host">
      {children}
      <span id={id} role="tooltip" className="tooltip-label">
        {label}
      </span>
    </span>
  );
}
```

### Domain types

File: `src/types/domain.ts`

```tsx
export type Role = "admin" | "trainer" | "trainee";
export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  level: string;
  duration: string;
  progress: number;
  learners: number;
  tag: string;
  accent: string;
}
```

### Vanta declaration

File: `src/types/vanta.d.ts`

```tsx
interface VantaEffect {
  destroy(): void;
  resize(): void;
  renderer?: { dispose(): void; forceContextLoss(): void };
}
declare module "vanta/dist/vanta.net.min.js" {
  export default function NET(options: {
    el: HTMLElement;
    THREE: typeof import("three");
    mouseControls: boolean;
    touchControls: boolean;
    gyroControls: boolean;
    minHeight: number;
    minWidth: number;
    scale: number;
    scaleMobile: number;
    color: number;
    backgroundColor: number;
    points: number;
    maxDistance: number;
    spacing: number;
    showDots: boolean;
  }): VantaEffect;
}
```

### Application root

File: `src/main.tsx`

```tsx
import { MotionConfig } from "framer-motion";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LenisSmoothScroll } from "./components/layout/LenisSmoothScroll";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <LenisSmoothScroll>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LenisSmoothScroll>
    </MotionConfig>
  </React.StrictMode>,
);
```

### Tailwind and API proxy

File: `vite.config.ts`

```tsx
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: { "/api": "http://localhost:4000" } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: { charts: ["recharts"], motion: ["framer-motion"] },
      },
    },
  },
});
```

### Tailwind entry

File: `src/motion.css`

```css
@import "tailwindcss";
```

### Complete global styles

File: `src/styles.css`

```css
@import "./motion.css";

:root {
  font-family: Inter, system-ui, sans-serif;
  color: #172b3a;
  background: #f5f8fa;
  font-size: 14px;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
}
button,
input,
select {
  font: inherit;
}
button {
  cursor: pointer;
  border: 0;
  background: none;
  color: inherit;
}
.app-shell {
  display: flex;
  min-height: 100vh;
}
aside {
  width: 250px;
  background: #0d2638;
  color: #b8cbd4;
  padding: 26px 17px 19px;
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 5;
}
.brand {
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #0d3146;
  font-size: 13px;
  line-height: 1.15;
}
.brand.light {
  color: white;
}
.brand-mark {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border: 1px solid #78c8d5;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  color: #83d1dc;
  margin-right: 7px;
  font-size: 19px;
  vertical-align: middle;
}
.brand-sub {
  padding-left: 38px;
  letter-spacing: 0.25em;
  font-size: 9px;
  color: #7894a1;
}
.side-top {
  display: flex;
  align-items: center;
}
.close-side {
  display: none;
  color: white;
  margin-left: auto;
}
.org-pill {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #17384d;
  border: 1px solid #295166;
  border-radius: 9px;
  padding: 10px;
  margin: 29px 0 29px;
  color: #d1e1e6;
  font-size: 12px;
}
.status-dot {
  margin-left: auto;
  width: 7px;
  height: 7px;
  background: #56bd87;
  border-radius: 50%;
}
.nav-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  color: #72909e;
  margin: 0 11px 10px;
}
nav {
  display: grid;
  gap: 4px;
}
nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px;
  border-radius: 8px;
  color: #acc1cc;
  text-decoration: none;
}
nav a.active,
nav a:hover {
  background: #1c4b60;
  color: white;
}
nav a.active {
  box-shadow: inset 3px 0 #80d1dc;
}
.count {
  margin-left: auto;
  border-radius: 10px;
  background: #d7963e;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
}
.side-bottom {
  margin-top: auto;
}
.mini-profile {
  display: flex;
  gap: 10px;
  align-items: center;
  border-top: 1px solid #234052;
  padding: 19px 6px 14px;
}
.mini-profile strong,
.mini-profile small {
  display: block;
}
.mini-profile strong {
  font-size: 12px;
  color: white;
}
.mini-profile small {
  font-size: 10px;
  margin-top: 4px;
  color: #7fa2af;
}
.avatar,
.top-avatar {
  background: #b7e1e2;
  color: #145568;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}
.avatar.small {
  height: 29px;
  width: 29px;
}
.avatar.large {
  height: 70px;
  width: 70px;
  font-size: 20px;
}
.logout {
  color: #90adb8;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 8px;
}
.app-shell main {
  margin-left: 250px;
  width: calc(100% - 250px);
}
header {
  height: 73px;
  background: white;
  border-bottom: 1px solid #e5edf0;
  display: flex;
  align-items: center;
  padding: 0 42px;
  justify-content: space-between;
}
.crumb {
  color: #93a4ad;
  font-size: 12px;
}
.crumb span {
  padding: 0 10px;
  color: #ccd6da;
}
.crumb strong {
  color: #274050;
  font-weight: 600;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
.icon-btn {
  position: relative;
  color: #6a818d;
}
.icon-btn i {
  position: absolute;
  right: -1px;
  top: 0;
  background: #e19c4a;
  border: 2px solid white;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.top-avatar {
  background: #173e55;
  color: white;
}
.menu {
  display: none;
}
.content {
  max-width: 1410px;
  margin: 0 auto;
  padding: 42px;
}
.page-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 29px;
}
.page-title h1 {
  font-size: 28px;
  letter-spacing: -0.04em;
  margin: 5px 0 7px;
  color: #12344a;
}
.page-title p:not(.eyebrow) {
  color: #7a8e98;
  margin: 0;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 0.14em;
  color: #4a9cab;
  font-weight: 700;
  margin: 0;
}
.primary,
.secondary,
.filter,
.approve,
.reject {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 11px 16px;
  font-weight: 600;
  font-size: 12px;
}
.primary {
  background: #0c718b;
  color: white;
  box-shadow: 0 4px 10px #0c718b26;
}
.primary:hover {
  background: #095a70;
}
.secondary {
  background: #eef6f7;
  color: #12647a;
}
.secondary:hover {
  background: #dceef0;
}
.wide {
  width: 100%;
  justify-content: center;
  padding: 14px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-card,
.panel {
  background: white;
  border: 1px solid #e6eef1;
  border-radius: 12px;
  box-shadow: 0 4px 14px #17384d06;
}
.stat-card {
  padding: 19px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f5f7;
  color: #0c7c9e;
}
.stat-icon.amber,
.round.amber {
  background: #fff3df;
  color: #c27b27;
}
.stat-icon.purple,
.round.purple {
  background: #f0edff;
  color: #735dc6;
}
.stat-icon.green,
.round.green {
  background: #e4f6ed;
  color: #2d966c;
}
.stat-card span,
.stat-card small {
  display: block;
  color: #7e939d;
  font-size: 11px;
}
.stat-card strong {
  display: block;
  font-size: 25px;
  letter-spacing: -0.04em;
  margin: 5px 0;
}
.stat-card small {
  color: #4a9a77;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.panel {
  padding: 24px;
}
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 22px;
}
.panel h3 {
  margin: 0;
  font-size: 15px;
  color: #1b3949;
}
.panel-head p {
  font-size: 11px;
  color: #8ca0a8;
  margin: 5px 0 0;
}
.text-link {
  color: #0c7892;
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
}
.filter {
  border: 1px solid #e0eaed;
  background: white;
  color: #71858d;
  padding: 8px 11px;
  font-size: 11px;
}
.filter.active {
  background: #e9f5f7;
  color: #0c718b;
  border-color: #cfe8eb;
}
.legend {
  display: flex;
  gap: 20px;
  font-size: 11px;
  color: #7d9099;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.dot.blue {
  background: #0c7c9e;
}
.dot.cyan {
  background: #83c9d6;
}
.attention-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #edf2f3;
}
.attention-item:last-child {
  border: 0;
}
.attention-item > svg {
  margin-left: auto;
  color: #a8bac1;
}
.attention-item strong,
.attention-item small {
  display: block;
}
.attention-item strong {
  font-size: 12px;
}
.attention-item small {
  font-size: 10px;
  color: #91a2aa;
  margin-top: 4px;
}
.round {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.notice-tag {
  font-size: 9px;
  color: #c57c27;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.green-tag {
  color: #2d966c;
}
.notice h4,
.notice h3 {
  margin: 10px 0 6px;
  font-size: 13px;
  line-height: 1.4;
}
.notice p,
.notice small {
  font-size: 11px;
  color: #7d9199;
  line-height: 1.6;
}
.notice {
  padding-bottom: 17px;
  border-bottom: 1px solid #edf2f3;
}
.notice.muted {
  padding-top: 17px;
  border: 0;
}
.course-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid #edf2f3;
  text-decoration: none;
  color: inherit;
}
.course-row:last-child {
  border: 0;
}
.course-thumb {
  height: 44px;
  width: 48px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.course-row-main {
  flex: 1;
}
.course-row-main strong {
  display: block;
  font-size: 12px;
}
.course-row-main small {
  display: block;
  color: #8a9ba3;
  font-size: 10px;
  margin: 4px 0 9px;
}
.progress {
  height: 5px;
  background: #eaf0f2;
  border-radius: 8px;
  overflow: hidden;
}
.progress i {
  height: 100%;
  display: block;
  background: #2c9a91;
  border-radius: 8px;
}
.percent {
  font-size: 11px;
  color: #538c91;
}
.assessment-card {
  border: 1px solid #f2e1c8;
  background: #fffaf2;
  padding: 20px;
  border-radius: 10px;
}
.assessment-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eaf6f7;
  color: #0c7c9e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.assessment-card .assessment-icon {
  background: #fae8c9;
  color: #c27b27;
  margin-bottom: 14px;
}
.pill {
  display: inline-block;
  border-radius: 20px;
  background: #edf3f4;
  padding: 5px 8px;
  color: #6e838c;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.amber-pill {
  background: #fff1da;
  color: #c17b29;
}
.green-pill {
  background: #e3f5eb;
  color: #2d946b;
}
.assessment-card .pill {
  display: block;
  width: max-content;
}
.assessment-card h3 {
  margin: 12px 0 5px;
}
.assessment-card p {
  font-size: 11px;
  color: #8a9ba0;
  margin: 0 0 16px;
}
.mini-notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 18px;
  color: #0c7c9e;
}
.mini-notice strong,
.mini-notice small {
  display: block;
}
.mini-notice strong {
  font-size: 11px;
  color: #365765;
}
.mini-notice small {
  font-size: 10px;
  color: #91a0a7;
  margin-top: 4px;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #dfe9ec;
  border-radius: 8px;
  padding: 10px 12px;
  color: #93a5ac;
}
.search input {
  border: 0;
  outline: 0;
  background: transparent;
  width: 180px;
  font-size: 12px;
}
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.course-banner {
  height: 115px;
  border-radius: 10px 10px 0 0;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.course-banner span {
  font-size: 10px;
  border: 1px solid #ffffff66;
  border-radius: 15px;
  padding: 5px 8px;
}
.course-card {
  background: white;
  border: 1px solid #e6eef1;
  border-radius: 11px;
  overflow: hidden;
  box-shadow: 0 4px 14px #17384d06;
}
.course-card-body {
  padding: 18px;
}
.course-code {
  color: #63a9b7;
  font-weight: 700;
  font-size: 10px;
}
.course-card h3 {
  font-size: 15px;
  line-height: 1.4;
  margin: 8px 0;
}
.course-card p {
  font-size: 11px;
  line-height: 1.6;
  color: #82949c;
  min-height: 53px;
}
.course-meta {
  display: flex;
  gap: 15px;
  color: #7d929b;
  font-size: 10px;
  padding: 12px 0;
  border-top: 1px solid #edf2f3;
}
.course-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}
.progress-label {
  display: block;
  color: #4b8e91;
  font-size: 10px;
  margin-top: 6px;
}
.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}
.plain-action {
  color: #0c788f;
  font-size: 11px;
  font-weight: 600;
}
.detail-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}
.module {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px 0;
  border-bottom: 1px solid #edf2f3;
}
.module:last-child {
  border: 0;
}
.module-check {
  height: 27px;
  width: 27px;
  border: 1px solid #c9dadd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #8da0a7;
}
.module.complete .module-check {
  border: 0;
  background: #e3f5ed;
  color: #2a956b;
}
.module strong,
.module small {
  display: block;
}
.module strong {
  font-size: 12px;
}
.module small {
  color: #91a0a7;
  font-size: 10px;
  margin-top: 5px;
}
.module-open {
  margin-left: auto;
  color: #0c788f;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.radar-art {
  height: 155px;
  border-radius: 10px;
  background: #123c54;
  color: #91d9dc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.radar-art:after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  border: 1px solid #65b7c066;
  border-radius: 50%;
  box-shadow:
    0 0 0 30px #65b7c022,
    0 0 0 60px #65b7c016;
}
.radar-art span {
  position: absolute;
  bottom: 13px;
  left: 15px;
  color: #a1c9cf;
  font-size: 9px;
  letter-spacing: 0.15em;
  z-index: 1;
}
.course-side h3 {
  margin-top: 22px;
}
.course-side p {
  font-size: 12px;
  color: #81949c;
  line-height: 1.7;
}
.side-stat {
  border-top: 1px solid #edf2f3;
  padding: 13px 0;
}
.side-stat span,
.side-stat strong {
  display: block;
  font-size: 10px;
}
.side-stat span {
  color: #94a6ad;
  margin-bottom: 5px;
}
.mapping-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
}
.mapping-intro {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}
.feature-icon {
  height: 40px;
  width: 40px;
  border-radius: 9px;
  background: #e7f5f7;
  color: #0c7c9e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mapping-intro h3 {
  font-size: 14px;
}
.mapping-intro p {
  font-size: 11px;
  line-height: 1.5;
  color: #8da0a7;
  margin: 5px 0;
}
.mapping-form label,
.profile-panel label {
  display: block;
  font-size: 11px;
  color: #58717b;
  font-weight: 600;
  margin: 20px 0;
}
.mapping-form select,
.profile-panel input {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #dce7ea;
  border-radius: 7px;
  padding: 11px;
  background: white;
  color: #294858;
  outline: none;
}
.tag-input {
  margin-top: 8px;
  border: 1px solid #dce7ea;
  border-radius: 7px;
  padding: 7px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tag-input span {
  background: #eaf5f6;
  border-radius: 15px;
  padding: 6px 8px;
  color: #28778a;
  font-size: 10px;
  font-weight: 500;
}
.tag-input button {
  padding: 4px;
  color: #0c7c9e;
}
.weights {
  border-top: 1px solid #edf2f3;
  margin-top: 26px;
  padding-top: 16px;
}
.weights span,
.weights small {
  display: block;
}
.weights span {
  font-size: 11px;
  font-weight: 600;
}
.weights b {
  float: right;
  color: #0c7c9e;
}
.weights small {
  color: #91a0a7;
  font-size: 10px;
  line-height: 1.6;
  margin-top: 7px;
}
.trainer-match {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #edf2f3;
  padding: 13px 0;
}
.trainer-match:last-child {
  border: 0;
}
.rank {
  font-size: 11px;
  color: #a9b8bd;
  padding-top: 8px;
  width: 17px;
}
.trainer-avatar {
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background: #d8eff0;
  color: #12647a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}
.trainer-info {
  flex: 1;
}
.trainer-info > div:first-child {
  display: flex;
  justify-content: space-between;
}
.trainer-info h4 {
  margin: 0;
  font-size: 12px;
}
.trainer-info small {
  font-size: 10px;
  color: #8da0a7;
}
.trainer-info > p {
  font-size: 10px;
  color: #54818b;
  margin: 8px 0;
}
.score {
  text-align: right;
  color: #0c7c9e;
}
.score strong {
  display: block;
  font-size: 23px;
  letter-spacing: -0.05em;
}
.score small {
  font-size: 8px;
  letter-spacing: 0.1em;
}
.match-bars {
  display: flex;
  gap: 13px;
}
.match-bars span {
  font-size: 9px;
  color: #8da0a7;
  flex: 1;
}
.match-bars i {
  display: block;
  height: 4px;
  background: #e9eff1;
  border-radius: 4px;
  margin-top: 5px;
}
.match-bars b {
  display: block;
  background: #5fb3b7;
  height: 100%;
  border-radius: 4px;
}
.why {
  background: #f2f9f8;
  border-radius: 6px;
  margin-top: 10px;
  padding: 8px;
  color: #668187;
  font-size: 10px;
  line-height: 1.5;
}
.why svg {
  vertical-align: middle;
  color: #279a91;
  margin-right: 5px;
}
.why strong {
  color: #257b78;
  margin-right: 4px;
}
.loading-state {
  color: #7c949c;
  text-align: center;
  padding: 65px;
}
.loading-state span {
  display: block;
  color: #0c7c9e;
  letter-spacing: 5px;
  margin-top: 10px;
}
table {
  border-collapse: collapse;
  width: 100%;
  font-size: 11px;
}
th {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 9px;
  color: #94a5ab;
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid #e7eef0;
}
td {
  padding: 16px 10px;
  border-bottom: 1px solid #edf2f3;
  color: #657b84;
}
.person,
.resource {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #254552;
}
.approve {
  background: #e3f5eb;
  color: #2c9369;
  padding: 7px 10px;
  margin-right: 6px;
  font-size: 10px;
}
.reject {
  color: #bd6d6d;
  padding: 7px;
  font-size: 10px;
}
.approved {
  background: #e3f5eb;
  color: #2c9369;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 10px;
}
.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.resource svg {
  color: #5aaeb7;
}
.type {
  color: #608a91;
  font-weight: 600;
}
.announcement-list {
  display: grid;
  gap: 16px;
  max-width: 800px;
}
.notice.full {
  border: 0;
  padding: 25px;
}
.notice.full h3 {
  font-size: 17px;
}
.notice.full p {
  font-size: 12px;
}
.toast {
  background: #e4f6ed;
  color: #277c5d;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 18px;
  width: max-content;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
}
.assessment-list {
  display: grid;
  gap: 14px;
}
.assessment-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
.assessment-list-item > div:nth-child(2) {
  flex: 1;
}
.assessment-list-item h3 {
  font-size: 13px;
}
.assessment-list-item p {
  font-size: 11px;
  color: #82949c;
}
.assessment-status {
  display: flex;
  align-items: center;
  gap: 14px;
}
.certificate-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.certificate {
  position: relative;
  border-top: 4px solid #53aeb5;
}
.cert-seal {
  height: 54px;
  width: 54px;
  border-radius: 50%;
  background: #e3f5ef;
  color: #319473;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.certificate h2 {
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 500;
  line-height: 1.25;
  max-width: 350px;
}
.certificate p:not(.eyebrow) {
  font-size: 11px;
  color: #7e939b;
  line-height: 1.7;
}
.cert-footer {
  border-top: 1px solid #edf2f3;
  margin-top: 20px;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #80959c;
  font-size: 10px;
}
.profile-panel {
  max-width: 850px;
}
.profile-head {
  display: flex;
  align-items: center;
  gap: 17px;
  border-bottom: 1px solid #edf2f3;
  padding-bottom: 24px;
}
.profile-head h2 {
  margin: 0 0 7px;
}
.profile-head p {
  margin: 0;
  color: #81949d;
  font-size: 12px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
}
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: white;
}
.login-art {
  background: #0d2c40;
  position: relative;
  padding: 48px 8%;
  color: white;
  overflow: hidden;
}
.login-message {
  position: absolute;
  left: 13%;
  top: 31%;
  max-width: 440px;
}
.login-message h1 {
  font-size: 48px;
  letter-spacing: -0.06em;
  line-height: 1.05;
  margin: 13px 0 17px;
}
.login-message h1 em {
  color: #7fd0d5;
  font-style: normal;
}
.login-message p:not(.eyebrow) {
  color: #a8c4cd;
  line-height: 1.7;
  max-width: 360px;
}
.orbit {
  position: absolute;
  right: -100px;
  bottom: -100px;
  width: 470px;
  height: 470px;
  border: 1px solid #4e9daf66;
  border-radius: 50%;
  box-shadow:
    0 0 0 50px #4e9daf16,
    0 0 0 100px #4e9daf0d;
}
.orbit span {
  position: absolute;
  color: #7fd0d5;
  font-size: 30px;
}
.orbit span:first-child {
  top: 50px;
  left: 100px;
}
.orbit span:nth-child(2) {
  top: 190px;
  left: 390px;
}
.orbit span:nth-child(3) {
  bottom: 40px;
  left: 170px;
}
.login-form {
  padding: 48px 13%;
  max-width: 600px;
  justify-self: center;
  width: 100%;
  align-self: center;
}
.form-copy {
  margin: 75px 0 30px;
}
.form-copy h2 {
  font-size: 30px;
  letter-spacing: -0.04em;
  margin: 0 0 8px;
}
.form-copy p,
.login-foot {
  color: #84979f;
  font-size: 12px;
}
.login-form label {
  display: block;
  color: #46616d;
  font-size: 11px;
  font-weight: 600;
  margin: 18px 0;
}
.login-form input {
  display: block;
  width: 100%;
  border: 1px solid #dae6e9;
  padding: 13px;
  border-radius: 7px;
  margin-top: 8px;
  outline: none;
}
.demo-roles {
  margin: 22px 0;
}
.demo-roles small {
  display: block;
  color: #899ba2;
  font-size: 10px;
  margin-bottom: 8px;
}
.demo-roles button {
  padding: 8px 12px;
  border: 1px solid #dfebed;
  color: #718991;
  font-size: 11px;
  margin-right: 6px;
  border-radius: 6px;
}
.demo-roles button.selected {
  background: #e8f5f6;
  color: #0c718b;
  border-color: #b8dfe3;
}
.login-foot {
  text-align: center;
  margin-top: 22px;
}
@media (max-width: 1050px) {
  .content {
    padding: 30px;
  }
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 760px) {
  aside {
    transform: translateX(-100%);
    transition: 0.2s;
    width: 270px;
  }
  aside.open {
    transform: translateX(0);
  }
  .close-side,
  .menu {
    display: block;
  }
  .app-shell main {
    margin-left: 0;
    width: 100%;
  }
  header {
    padding: 0 18px;
  }
  .menu {
    color: #0d3a4c;
  }
  .crumb {
    margin-left: 13px;
    margin-right: auto;
  }
  .content {
    padding: 25px 17px;
  }
  .page-title {
    align-items: flex-start;
    flex-direction: column;
  }
  .page-title h1 {
    font-size: 24px;
  }
  .page-title .primary,
  .page-title .search {
    width: 100%;
    justify-content: center;
  }
  .dashboard-grid,
  .detail-layout,
  .mapping-layout,
  .certificate-grid {
    grid-template-columns: 1fr;
  }
  .course-grid {
    grid-template-columns: 1fr;
  }
  .lower {
    display: none;
  }
  .panel {
    padding: 18px;
  }
  .assessment-list-item {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .assessment-status {
    width: 100%;
    margin-left: 56px;
  }
  .table-toolbar {
    align-items: flex-start;
    gap: 10px;
  }
  .table-toolbar .search {
    flex: 1;
  }
  .table-toolbar .search input {
    width: 100%;
  }
  table {
    min-width: 650px;
  }
  .panel:has(table) {
    overflow: auto;
  }
  .login-page {
    grid-template-columns: 1fr;
  }
  .login-art {
    min-height: 270px;
    padding: 28px;
  }
  .login-message {
    left: 28px;
    top: 100px;
  }
  .login-message h1 {
    font-size: 31px;
  }
  .login-message p:not(.eyebrow),
  .orbit {
    display: none;
  }
  .login-form {
    padding: 35px 28px;
  }
  .form-copy {
    margin: 25px 0 30px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}
/* Scroll physics: one document scroller and native nested regions. */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-smooth iframe {
  pointer-events: none;
}
:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}
body {
  background:
    radial-gradient(ellipse at 90% 0%, #dfeef080, transparent 40%), #f5f7f9;
}
button,
a,
input,
select {
  -webkit-tap-highlight-color: transparent;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid #36a8b7;
  outline-offset: 4px;
}
h1,
h2,
h3 {
  text-wrap: balance;
}
.content {
  padding-top: 38px;
}
.panel,
.stat-card {
  border-color: #dce7ed;
  border-radius: 16px;
}
.panel {
  box-shadow: 0 6px 24px -16px #12344a25;
}
.stat-card {
  padding-bottom: 33px;
}
.stat-card strong {
  font-size: 30px;
}
.stat-quick {
  position: absolute;
  right: 16px;
  bottom: 10px;
  font-size: 10px;
  color: #0c718b;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.stat-card:hover .stat-quick,
.stat-card:focus-within .stat-quick {
  opacity: 1;
  transform: none;
}
.app-shell > aside {
  background: linear-gradient(165deg, #102f42, #0a2232);
}
.app-shell main > header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffffdd;
  backdrop-filter: blur(18px);
}
.hero-canvas {
  background: radial-gradient(ellipse at 75% 70%, #206373, #0d2c40 70%);
}
.hero-shade {
  background: linear-gradient(90deg, #0d2c40dd, #0d2c4020);
}
.login-art > .brand,
.login-message {
  z-index: 1;
}
.login-art .orbit {
  pointer-events: none;
  opacity: 0.4;
}
.login-message h1 {
  font-size: clamp(34px, 4.2vw, 66px);
}
.catalog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.catalog-toolbar .filters {
  margin: 0;
  flex-wrap: wrap;
}
.course-card {
  border-radius: 18px;
  overflow: visible;
}
.course-banner {
  position: relative;
  isolation: isolate;
  overflow: visible;
  height: 150px;
  border-radius: 17px 17px 0 0;
  padding: 20px;
}
.course-banner-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  overflow: hidden;
  background-image:
    linear-gradient(#ffffff12 1px, transparent 1px),
    linear-gradient(90deg, #ffffff12 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(120deg, transparent, #000);
}
.course-banner-grid:after {
  content: "";
  position: absolute;
  width: 180px;
  height: 180px;
  right: 35px;
  top: 15px;
  border: 1px solid #ffffff40;
  border-radius: 50%;
  box-shadow:
    0 0 0 20px #ffffff09,
    0 0 0 40px #ffffff09;
}
.course-card-body {
  padding: 23px;
}
.course-card h3 {
  font-size: 18px;
  letter-spacing: -0.025em;
  min-height: 50px;
}
.course-card h3 a {
  color: inherit;
  text-decoration: none;
}
.course-card p {
  font-size: 12px;
}
.quick-actions {
  position: absolute;
  bottom: 14px;
  right: 16px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.course-card:hover .quick-actions,
.course-card:focus-within .quick-actions {
  opacity: 1;
  transform: none;
}
.bookmark-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff55;
  border-radius: 9px;
  background: #ffffffed;
  color: #12344a;
  width: 34px;
  height: 34px;
}
.progress-ring {
  position: relative;
  color: #0c8b88;
  flex-shrink: 0;
}
.progress-ring svg {
  width: 100%;
  height: 100%;
}
.progress-ring span {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
}
.tooltip-host {
  position: relative;
  display: inline-flex;
}
.tooltip-label {
  position: absolute;
  bottom: calc(100% + 9px);
  right: 0;
  padding: 7px 10px;
  border-radius: 7px;
  background: #102f42;
  color: white;
  white-space: nowrap;
  font-size: 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 30;
}
.tooltip-host:hover .tooltip-label,
.tooltip-host:focus-within .tooltip-label {
  opacity: 1;
}
.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-direction: column;
  padding: 38px 20px;
  border: 1px dashed #8dc4cc;
  border-radius: 12px;
  background: #f3fafb;
  color: #207589;
  transition:
    background 0.2s,
    border-color 0.2s;
}
.drop-zone span {
  font-size: 11px;
  color: #71858d;
}
.drop-zone.dragging {
  background: #def3f2;
  border-color: #0c7c9e;
}
.asset-row {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px;
  background: white;
  border: 1px solid #dce7ed;
  border-radius: 10px;
  font-size: 12px;
  list-style: none;
}
.asset-row small {
  display: block;
  color: #7a8e98;
  font-size: 10px;
  margin-top: 4px;
}
.drag-handle {
  touch-action: none;
  cursor: grab;
  color: #7a8e98;
}
.drag-handle:active {
  cursor: grabbing;
}
.question-fieldset {
  border: 1px solid #dce7ed;
  border-radius: 12px;
  padding: 18px;
}
.question-fieldset legend {
  font-weight: 600;
  padding: 0 8px;
}
.question-fieldset label {
  display: block;
  font-size: 12px;
  margin: 10px 0;
}
.question-fieldset input:not([type="radio"]) {
  display: block;
  width: 100%;
  border: 1px solid #dce7ed;
  padding: 10px;
  border-radius: 7px;
  margin-top: 6px;
}
.practice-option {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dce7ed;
  padding: 16px;
  border-radius: 10px;
  margin: 10px 0;
  cursor: pointer;
}
.practice-option:has(:checked) {
  border-color: #0c7c9e;
  background: #eaf7f7;
}
.mapping-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 22px;
  text-align: center;
  min-height: 420px;
  background: radial-gradient(ellipse at top, #e2f4f4, white);
}
.mapping-empty > svg {
  color: #2f8c97;
}
.mapping-empty h2 {
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: #12344a;
}
.mapping-empty > p:last-child {
  max-width: 340px;
  line-height: 1.8;
  font-size: 12px;
  color: #71858d;
}
.match-dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  width: min(640px, calc(100vw - 32px));
  max-height: 85dvh;
  overflow: auto;
  border: 1px solid #cce3e5;
  border-radius: 20px;
  padding: 28px;
  color: #12344a;
  background: white;
  box-shadow: 0 35px 100px #06212c55;
}
.match-dialog::backdrop {
  background: #09233099;
  backdrop-filter: blur(7px);
}
.scan-surface {
  position: relative;
  overflow: hidden;
  background: #eef8f8;
  border-radius: 12px;
  padding: 32px;
  margin-top: 24px;
  text-align: center;
  color: #0c7c9e;
}
.scan-surface > svg {
  margin: 0 auto 20px;
}
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #49c7bd;
  box-shadow: 0 -20px 40px 15px #49c7bd35;
}
.match-result {
  padding: 20px;
  border: 1px solid #dce7ed;
  border-radius: 12px;
  margin: 12px 0;
}
.chart-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.chart-controls button {
  font-size: 10px;
  text-transform: capitalize;
  padding: 6px 9px;
  border: 1px solid #dce7ed;
  border-radius: 20px;
  color: #426d7b;
}
.chart-controls button[aria-pressed="true"] {
  background: #e0f2f2;
  border-color: #72b9c2;
}
.skeleton {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
@keyframes skeleton-pulse {
  50% {
    opacity: 0.4;
  }
}
@media (hover: none) {
  .quick-actions,
  .stat-quick {
    opacity: 1;
    transform: none;
  }
}
@media (max-width: 760px) {
  .catalog-toolbar {
    align-items: stretch;
    flex-direction: column;
  }
  .catalog-toolbar .search input {
    width: 100%;
  }
  .app-shell > aside {
    z-index: 40;
  }
  .course-card h3 {
    min-height: 0;
  }
  .mapping-empty {
    min-height: 320px;
  }
  .match-dialog {
    padding: 20px;
  }
  .stat-card {
    padding: 16px 12px 32px;
    gap: 10px;
  }
  .stat-icon {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }
  .stat-card strong {
    font-size: 25px;
  }
  .dashboard-grid.lower {
    display: grid;
  }
  .detail-layout > .course-side {
    position: static;
    transform: none;
    width: auto;
    height: auto;
    color: inherit;
  }
  .filters {
    flex-wrap: wrap;
  }
  .login-art {
    min-height: 340px;
  }
  .login-message {
    top: 125px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .quick-actions,
  .stat-quick {
    transform: none;
  }
}
.app-shell > aside .brand {
  color: #f1fafb;
}
.course-card h3,
.panel h3 {
  font-weight: 600;
}
```

## Verification and practical limits

Run `npm run typecheck`, `npm run build`, and, with `npm run dev` running, `npm run test:e2e`. Browser tests use locally installed Microsoft Edge; change the channel in playwright.config.ts for a different CI browser.

The four critical components are integrated into the application. Vanta and Three load only on the hero. Cleanup cancels Vanta's loop and listeners, disposes its renderer, releases its context, disconnects observers, and invalidates pending imports. Lenis has one RAF loop and responds to live reduced-motion changes. Touch scrolling stays native. Quick actions work on focus and touch as well as hover.

The full LMS remains a demo: login simulates roles; user approvals, bookmarks, content drafts and questionnaires are session-local; practice results are not recorded. Existing secondary screens retain prototype actions. Live production use requires authenticated API authorization, persistent authoring, signed Storage uploads, and assessment submission services. Competency matching uses the existing Node endpoint through Vite's /api proxy and explicitly labels server demo results. Production must supply its own working /api routing.

Three's lazy chunk exceeds Vite's default 500 kB warning threshold. The build succeeds; no frame-rate guarantee is claimed for untested devices. Browser verification checks lifecycle calls and canvas ownership, not a long-duration GPU memory profile.

Search Summary
- Commands: webcmd --version; webcmd web fetch --url https://github.com/tengbao/vanta; web open for the Vanta README and Lenis v1.0.42 repository URL.
- Sources fetched: https://github.com/tengbao/vanta (web tool); installed Vanta and Lenis package source/declarations.
- Browser fallback: no documentation browser used; no connected browser was available. Isolated Edge used for local application tests.
- Gaps/failures: Webcmd returned FETCH_BLOCKED; the Lenis repository URL returned an internal fetch error. Installed package declarations were used to verify the Lenis options.
