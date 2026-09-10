import { useReducedMotion } from "../../lib/motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  Award,
  Bell,
  BookOpen,
  BrainCircuit,
  Calendar,
  FileText,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  Users,
  X,
  Search,
} from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { SearchCommand } from "../ui/SearchCommand";
import { SkeletonLoaders } from "../ui/SkeletonLoaders";
import { NotificationDrawer } from "./NotificationDrawer";
import { useDemo } from "../../lib/demoStore";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type { LucideIcon } from "lucide-react";
const Announcements = lazy(() =>
  import("../../pages/Announcements").then((module) => ({
    default: module.Announcements,
  })),
);
const Assessments = lazy(() =>
  import("../../pages/Assessments").then((module) => ({
    default: module.Assessments,
  })),
);
const AuditTrail = lazy(() =>
  import("../../pages/AuditTrail").then((module) => ({
    default: module.AuditTrail,
  })),
);
const CalendarPage = lazy(() =>
  import("../../pages/CalendarPage").then((module) => ({
    default: module.CalendarPage,
  })),
);
const CertificateVerify = lazy(() =>
  import("../../pages/CertificateVerify").then((module) => ({
    default: module.CertificateVerify,
  })),
);
const Certificates = lazy(() =>
  import("../../pages/Certificates").then((module) => ({
    default: module.Certificates,
  })),
);
const Competency = lazy(() =>
  import("../../pages/Competency").then((module) => ({
    default: module.Competency,
  })),
);
const CourseDetail = lazy(() =>
  import("../../pages/CourseDetail").then((module) => ({
    default: module.CourseDetail,
  })),
);
const Courses = lazy(() =>
  import("../../pages/Courses").then((module) => ({ default: module.Courses })),
);
const Dashboard = lazy(() =>
  import("../../pages/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const DiscussionCentre = lazy(() =>
  import("../../pages/DiscussionCentre").then((module) => ({
    default: module.DiscussionCentre,
  })),
);
const LibraryPage = lazy(() =>
  import("../../pages/LibraryPage").then((module) => ({
    default: module.LibraryPage,
  })),
);
const Performance = lazy(() =>
  import("../../pages/Performance").then((module) => ({
    default: module.Performance,
  })),
);
const Profile = lazy(() =>
  import("../../pages/Profile").then((module) => ({ default: module.Profile })),
);
const Projects = lazy(() =>
  import("../../pages/Projects").then((module) => ({
    default: module.Projects,
  })),
);
const UsersPage = lazy(() =>
  import("../../pages/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);
import type { Role } from "../../types/domain";
import { AnimatedPageTransition } from "./AnimatedPageTransition";
export function Shell({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const { notifications } = useDemo();
  const unreadCount = notifications.filter((n) => !n.read).length;
  useMotionValueEvent(scrollY, "change", (value) => setCompact(value > 32));
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const sync = () => {
      setMobile(media.matches);
      if (!media.matches) setOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) menu.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const element = sidebar.current;
    element?.querySelector<HTMLButtonElement>(".close-side")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menu.current?.focus();
      }
      if (event.key === "Tab") {
        const nodes = Array.from(
          element?.querySelectorAll<HTMLElement>("a,button") || [],
        ).filter((node) => node.offsetParent !== null);
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  const loc = useLocation();
  const nav = useNavigate();
  const navs: [string, string, LucideIcon][] =
    role === "admin"
      ? [
          ["dashboard", "Dashboard", LayoutDashboard],
          ["users", "User approvals", Users],
          ["competency-mapping", "Competency mapping", BrainCircuit],
          ["announcements", "Announcements", Bell],
          ["audit-trail", "Audit trail", ShieldCheck],
          ["calendar", "Calendar", Calendar],
        ]
      : role === "trainer"
        ? [
            ["dashboard", "Dashboard", LayoutDashboard],
            ["courses", "My courses", BookOpen],
            ["projects", "Projects", FileText],
            ["library", "Content library", Library],
            ["assessments", "Assessments", FileText],
            ["resources", "Resources", MessageSquare],
            ["performance", "Performance", Activity],
            ["calendar", "Calendar", Calendar],
            ["profile", "My profile", Users],
          ]
        : [
            ["dashboard", "Dashboard", LayoutDashboard],
            ["courses", "Course catalogue", BookOpen],
            ["projects", "Projects", FileText],
            ["assessments", "My assessments", FileText],
            ["resources", "Resources", MessageSquare],
            ["certificates", "Certificates", Award],
            ["calendar", "Calendar", Calendar],
            ["profile", "My profile", Users],
          ];
  return (
    <div
      className={`app-shell ${collapsed && !mobile ? "sidebar-collapsed" : ""}`}
    >
      <a className="skip-link" href="#workspace-content">
        Skip to content
      </a>
      {open && (
        <button
          className="nav-backdrop"
          aria-label="Dismiss navigation"
          onClick={() => {
            setOpen(false);
            menu.current?.focus();
          }}
        />
      )}
      <motion.aside
        ref={sidebar}
        id="workspace-navigation"
        data-lenis-prevent
        aria-label="Workspace navigation"
        inert={mobile && !open}
        className={open ? "open" : ""}
        animate={{ width: mobile ? 270 : collapsed ? 80 : 250 }}
        transition={{ duration: reduce ? 0 : 0.22 }}
      >
        <div className="side-top">
          <div className="brand">
            <span className="brand-mark">✦</span> CAPACITY
            <br />
            <span className="brand-sub">CONNECT</span>
          </div>
          <button
            aria-label="Close navigation"
            className="close-side"
            onClick={() => {
              setOpen(false);
              menu.current?.focus();
            }}
          >
            <X />
          </button>
        </div>
        <div className="org-pill">
          <ShieldCheck size={16} />
          <span>IMD · MoES</span>
          <span className="status-dot" />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {navs.map(([path, label, Icon]) => (
            <Link
              aria-label={label}
              title={collapsed ? label : undefined}
              aria-current={
                loc.pathname.includes("/" + path) ? "page" : undefined
              }
              onClick={() => setOpen(false)}
              className={loc.pathname.includes("/" + path) ? "active" : ""}
              to={`/${role}/${path}`}
              key={path}
            >
              {loc.pathname.includes("/" + path) && (
                <motion.i
                  className="nav-active-indicator"
                  layoutId="navigation-indicator"
                  transition={{ duration: reduce ? 0 : 0.2 }}
                />
              )}
              <Icon size={18} />
              <span>{label}</span>
              {path === "users" && <b className="count">8</b>}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
          <button
            className="collapse-sidebar"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <>
                <PanelLeftClose size={18} />
                <span>Collapse workspace</span>
              </>
            )}
          </button>
          <div className="mini-profile">
            <div className="avatar">
              {role === "admin" ? "AS" : role === "trainer" ? "AR" : "VK"}
            </div>
            <div>
              <strong>
                {role === "admin"
                  ? "Anil Sharma"
                  : role === "trainer"
                    ? "Ananya Rao"
                    : "Vikram Kumar"}
              </strong>
              <small>{role.toUpperCase()}</small>
            </div>
          </div>
          <button className="logout" onClick={() => nav("/login")}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </motion.aside>
      <main inert={mobile && open}>
        <header className={compact ? "compact" : ""}>
          <button
            ref={menu}
            aria-expanded={open}
            aria-controls="workspace-navigation"
            aria-label="Open navigation"
            className="menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="crumb">
            Workspace <span>/</span>{" "}
            <strong>
              {navs.find(([p]) => loc.pathname.includes("/" + p))?.[1] ||
                "Dashboard"}
            </strong>
          </div>
          <div className="header-actions">
            <SearchCommand role={role} />
            <label className="demo-switch">
              <span>Demo role</span>
              <select
                aria-label="Switch demo role"
                value={role}
                onChange={(event) =>
                  nav("/" + event.target.value + "/dashboard")
                }
              >
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="trainee">Trainee</option>
              </select>
            </label>
            <button
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              className="icon-btn notif-trigger"
              onClick={() => setNotifOpen(true)}
            >
              <Bell size={19} />
              {unreadCount > 0 && <i />}
            </button>
            <Link
              className="top-avatar"
              aria-label="Open professional profile"
              to={`/${role}/profile`}
            >
              {role === "admin" ? "AS" : role === "trainer" ? "AR" : "VK"}
            </Link>
          </div>
        </header>
        <div className="content" id="workspace-content" tabIndex={-1}>
          <div className="demo-banner">
            Interactive prototype · Sample organisational statistics · Your
            learning changes save in this browser
          </div>
          <AnimatedPageTransition pageKey={loc.pathname}>
            <Suspense fallback={<SkeletonLoaders />}>
              <Routes location={loc}>
                <Route path="dashboard" element={<Dashboard role={role} />} />
                <Route path="courses" element={<Courses role={role} />} />
                <Route
                  path="courses/:id"
                  element={<CourseDetail role={role} />}
                />
                {role === "admin" && (
                  <Route path="competency-mapping" element={<Competency />} />
                )}
                {role === "admin" && (
                  <Route path="users" element={<UsersPage />} />
                )}
                {role === "admin" && (
                  <Route path="audit-trail" element={<AuditTrail />} />
                )}
                <Route
                  path="announcements"
                  element={<Announcements role={role} />}
                />
                <Route path="projects" element={<Projects role={role} />} />
                <Route path="library" element={<LibraryPage />} />
                <Route
                  path="assessments"
                  element={<Assessments role={role} />}
                />
                <Route path="resources" element={<DiscussionCentre role={role} />} />
                <Route path="performance" element={<Performance />} />
                <Route path="calendar" element={<CalendarPage role={role} />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="certificate-verify" element={<CertificateVerify />} />
                <Route
                  path="profile"
                  element={<Profile key={role} role={role} />}
                />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </Suspense>
          </AnimatedPageTransition>
        </div>
      </main>
      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        role={role}
      />
    </div>
  );
}
