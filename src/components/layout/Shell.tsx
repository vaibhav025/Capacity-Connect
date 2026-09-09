import {
  Activity,
  Award,
  Bell,
  BookOpen,
  BrainCircuit,
  FileText,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type { LucideIcon } from "lucide-react";
import { Announcements } from "../../pages/Announcements";
import { Assessments } from "../../pages/Assessments";
import { Certificates } from "../../pages/Certificates";
import { Competency } from "../../pages/Competency";
import { CourseDetail } from "../../pages/CourseDetail";
import { Courses } from "../../pages/Courses";
import { Dashboard } from "../../pages/Dashboard";
import { LibraryPage } from "../../pages/LibraryPage";
import { Performance } from "../../pages/Performance";
import { Profile } from "../../pages/Profile";
import { UsersPage } from "../../pages/UsersPage";
import type { Role } from "../../types/domain";
import { AnimatedPageTransition } from "./AnimatedPageTransition";
export function Shell({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const navs: [string, string, LucideIcon][] =
    role === "admin"
      ? [
          ["dashboard", "Dashboard", LayoutDashboard],
          ["users", "User approvals", Users],
          ["competency-mapping", "Competency mapping", BrainCircuit],
          ["announcements", "Announcements", Bell],
        ]
      : role === "trainer"
        ? [
            ["dashboard", "Dashboard", LayoutDashboard],
            ["courses", "My courses", BookOpen],
            ["library", "Content library", Library],
            ["assessments", "Assessments", FileText],
            ["performance", "Performance", Activity],
            ["profile", "My profile", Users],
          ]
        : [
            ["dashboard", "Dashboard", LayoutDashboard],
            ["courses", "Course catalogue", BookOpen],
            ["assessments", "My assessments", FileText],
            ["certificates", "Certificates", Award],
            ["profile", "My profile", Users],
          ];
  return (
    <div className="app-shell">
      <aside className={open ? "open" : ""}>
        <div className="side-top">
          <div className="brand">
            <span className="brand-mark">✦</span> CAPACITY
            <br />
            <span className="brand-sub">CONNECT</span>
          </div>
          <button
            aria-label="Close navigation"
            className="close-side"
            onClick={() => setOpen(false)}
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
        <nav>
          {navs.map(([path, label, Icon]) => (
            <Link
              onClick={() => setOpen(false)}
              className={loc.pathname.includes("/" + path) ? "active" : ""}
              to={`/${role}/${path}`}
              key={path}
            >
              <Icon size={18} />
              <span>{label}</span>
              {path === "users" && <b className="count">8</b>}
            </Link>
          ))}
        </nav>
        <div className="side-bottom">
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
      </aside>
      <main>
        <header>
          <button
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
            <Link
              aria-label="View announcements"
              className="icon-btn"
              to={`/${role}/announcements`}
            >
              <Bell size={19} />
              <i />
            </Link>
            <div className="top-avatar">
              {role === "admin" ? "AS" : role === "trainer" ? "AR" : "VK"}
            </div>
          </div>
        </header>
        <div className="content">
          <div className="demo-banner">
            Interactive prototype · Sample organisational statistics · Your
            learning changes save in this browser
          </div>
          <AnimatedPageTransition pageKey={loc.pathname}>
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
              <Route
                path="announcements"
                element={<Announcements role={role} />}
              />
              <Route path="library" element={<LibraryPage />} />
              <Route path="assessments" element={<Assessments role={role} />} />
              <Route path="performance" element={<Performance />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="profile" element={<Profile role={role} />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AnimatedPageTransition>
        </div>
      </main>
    </div>
  );
}
