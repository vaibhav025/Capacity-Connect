import { useSyncExternalStore } from "react";

export type Learning = {
  enrolled: boolean;
  completed: number[];
  score?: number;
  issuedAt?: string;
  feedback?: { rating: number; text: string };
};
export type Notice = {
  id: string;
  title: string;
  body: string;
  kind: string;
  audience: string;
  date: string;
};
export type ProfileRecord = {
  name: string;
  unit: string;
  designation: string;
  location: string;
  qualifications: string;
  experience: string;
  interests: string;
  skills: string;
  certificates: string;
};
export type ProjectSuggestion = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  techStack: string[];
  skillsGained: string[];
  resources: { label: string; url: string }[];
  createdBy: string;
  createdAt: string;
};
export type ProjectSubmission = {
  id: string;
  projectId: string;
  traineeName: string;
  githubLink: string;
  deployedLink: string;
  documentation: string;
  notes: string;
  status: "pending" | "reviewed" | "approved" | "needs-revision";
  feedback: string;
  submittedAt: string;
  reviewedAt?: string;
};
export type Discussion = {
  id: string;
  title: string;
  body: string;
  author: string;
  authorRole: string;
  category: string;
  createdAt: string;
  replies: DiscussionReply[];
};
export type DiscussionReply = {
  id: string;
  body: string;
  author: string;
  authorRole: string;
  createdAt: string;
};
export type Resource = {
  id: string;
  title: string;
  type: "PYQ" | "Syllabus" | "Notes" | "Other";
  subject: string;
  category: string;
  author: string;
  fileUrl: string;
  description: string;
  uploadedAt: string;
};
export type Opportunity = {
  id: string;
  type: "hackathon" | "internship";
  title: string;
  organization: string;
  deadline: string;
  eligibility: string;
  skillsRequired: string[];
  location: string;
  description: string;
  applicationLink: string;
  createdAt: string;
};
export type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
};
export type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  details: string;
};
export type CalendarEvent = {
  id: string;
  title: string;
  type: "class" | "assessment" | "project" | "meeting" | "event" | "deadline";
  date: string;
  endDate?: string;
  time: string;
  description: string;
  color: string;
};
export type CertificateRecord = {
  id: string;
  certificateNo: string;
  hash: string;
  traineeName: string;
  courseTitle: string;
  issuedAt: string;
  score: number;
};
type State = {
  learning: Record<string, Learning>;
  notices: Notice[];
  profiles: Record<string, ProfileRecord>;
  bookmarks: string[];
  projects: ProjectSuggestion[];
  submissions: ProjectSubmission[];
  discussions: Discussion[];
  resources: Resource[];
  opportunities: Opportunity[];
  notifications: Notification[];
  auditLog: AuditEntry[];
  calendarEvents: CalendarEvent[];
  certificates: CertificateRecord[];
};
const initial: State = {
  learning: {},
  profiles: {},
  bookmarks: [],
  notices: [
    {
      id: "welcome",
      title: "Monsoon forecast review: build your operational readiness",
      body: "Complete the radar learning path, check your understanding, and share your feedback with the training team.",
      kind: "Training",
      audience: "all",
      date: "2026-09-07T09:00:00.000Z",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Real-time Weather Dashboard with React & OpenWeather API",
      description:
        "Build a responsive weather dashboard that fetches live data from OpenWeatherMap API. Include interactive maps, 5-day forecasts, and city search functionality.",
      difficulty: "Intermediate",
      techStack: ["React", "TypeScript", "OpenWeather API", "Chart.js"],
      skillsGained: [
        "API Integration",
        "State Management",
        "Data Visualization",
        "Responsive Design",
      ],
      resources: [
        { label: "OpenWeather API Docs", url: "https://openweathermap.org/api" },
        { label: "React Charts Guide", url: "#" },
      ],
      createdBy: "Dr. Ananya Rao",
      createdAt: "2026-09-01T10:00:00.000Z",
    },
    {
      id: "proj-2",
      title: "Cyclone Track Prediction Visualization",
      description:
        "Create an interactive map showing historical cyclone tracks with prediction models. Use Mapbox or Leaflet for geospatial rendering.",
      difficulty: "Advanced",
      techStack: ["Python", "Folium", "Pandas", "GeoJSON"],
      skillsGained: [
        "Geospatial Analysis",
        "Data Processing",
        "Scientific Visualization",
        "ML Basics",
      ],
      resources: [
        { label: "IBTrACS Database", url: "https://www.ncdc.noaa.gov/ibtracs/" },
      ],
      createdBy: "Rajiv Menon",
      createdAt: "2026-08-28T14:00:00.000Z",
    },
    {
      id: "proj-3",
      title: "Personal Portfolio Website",
      description:
        "Design and deploy a professional portfolio showcasing your meteorology projects, skills, and achievements. Perfect for resume building.",
      difficulty: "Beginner",
      techStack: ["HTML", "CSS", "JavaScript", "Vercel/Netlify"],
      skillsGained: [
        "Web Design",
        "CSS Animations",
        "Deployment",
        "Personal Branding",
      ],
      resources: [
        { label: "GitHub Pages Guide", url: "#" },
        { label: "Portfolio Inspiration", url: "#" },
      ],
      createdBy: "Dr. Meera Iyer",
      createdAt: "2026-09-03T09:00:00.000Z",
    },
  ],
  submissions: [],
  discussions: [
    {
      id: "disc-1",
      title: "Best resources for learning radar signal processing?",
      body: "I'm looking for comprehensive resources on radar signal processing for my upcoming project. Any recommendations for books, courses, or online materials?",
      author: "Vikram Kumar",
      authorRole: "trainee",
      category: "Academic",
      createdAt: "2026-09-05T11:00:00.000Z",
      replies: [
        {
          id: "reply-1",
          body: "Check out 'Introduction to Radar Analysis' by Shriraam Mahapatra. Also, the MIT OpenCourseWare lectures are excellent.",
          author: "Dr. Ananya Rao",
          authorRole: "trainer",
          createdAt: "2026-09-05T14:00:00.000Z",
        },
        {
          id: "reply-2",
          body: "The IMD training portal also has some great internal documentation on Doppler radar processing.",
          author: "Priya Sharma",
          authorRole: "trainee",
          createdAt: "2026-09-06T09:00:00.000Z",
        },
      ],
    },
    {
      id: "disc-2",
      title: "Study group for NWP final assessment",
      body: "Looking to form a study group for the Numerical Weather Prediction assessment. We can meet every evening this week to review problem sets together.",
      author: "Amit Patel",
      authorRole: "trainee",
      category: "Study Group",
      createdAt: "2026-09-06T16:00:00.000Z",
      replies: [],
    },
  ],
  resources: [
    {
      id: "res-1",
      title: "Doppler Radar Principles - Previous Year Questions 2025",
      type: "PYQ",
      subject: "Radar Meteorology",
      category: "Assessment",
      author: "Vikram Kumar",
      fileUrl: "#",
      description: "Collection of previous year exam questions on Doppler radar principles and applications.",
      uploadedAt: "2026-09-04T10:00:00.000Z",
    },
    {
      id: "res-2",
      title: "Satellite Meteorology Course Syllabus 2026",
      type: "Syllabus",
      subject: "Satellite Meteorology",
      category: "Curriculum",
      author: "Training Office",
      fileUrl: "#",
      description: "Complete syllabus for the Satellite Meteorology advanced course.",
      uploadedAt: "2026-08-20T08:00:00.000Z",
    },
    {
      id: "res-3",
      title: "NWP Model Output Interpretation Notes",
      type: "Notes",
      subject: "NWP",
      category: "Study Material",
      author: "Dr. Meera Iyer",
      fileUrl: "#",
      description: "Comprehensive notes on interpreting GFS and ECMWF model outputs for operational forecasting.",
      uploadedAt: "2026-09-02T15:00:00.000Z",
    },
  ],
  opportunities: [
    {
      id: "opp-1",
      type: "hackathon",
      title: "India Meteorological Hackathon 2026",
      organization: "IMD & Ministry of Earth Sciences",
      deadline: "2026-10-15",
      eligibility: "Open to all IMD trainees and research scholars",
      skillsRequired: ["Python", "Data Analysis", "ML/AI", "Weather Domain Knowledge"],
      location: "New Delhi (Hybrid)",
      description: "Build innovative solutions for weather prediction, climate adaptation, or disaster management using IMD datasets.",
      applicationLink: "#",
      createdAt: "2026-09-01T08:00:00.000Z",
    },
    {
      id: "opp-2",
      type: "hackathon",
      title: "Smart City Weather Alert System Challenge",
      organization: "NITI Aayog",
      deadline: "2026-11-01",
      eligibility: "Students and early-career professionals",
      skillsRequired: ["IoT", "Mobile Development", "API Design"],
      location: "Online",
      description: "Design a hyperlocal weather alert system for Indian smart cities using real-time sensor data.",
      applicationLink: "#",
      createdAt: "2026-09-05T10:00:00.000Z",
    },
    {
      id: "opp-3",
      type: "internship",
      title: "Summer Research Internship - Climate Modelling",
      organization: "IITM Pune",
      deadline: "2026-09-30",
      eligibility: "M.Sc./B.Tech students in Atmospheric Science or related fields",
      skillsRequired: ["Python", "Fortran", "Linux", "Numerical Methods"],
      location: "Pune (On-site)",
      description: "Work on cutting-edge climate modelling projects under experienced scientists at IITM.",
      applicationLink: "#",
      createdAt: "2026-08-25T09:00:00.000Z",
    },
    {
      id: "opp-4",
      type: "internship",
      title: "Data Science Intern - Weather Analytics",
      organization: "Skymet Weather Services",
      deadline: "2026-10-20",
      eligibility: "Final year students or recent graduates in CS/Data Science/Statistics",
      skillsRequired: ["Python", "SQL", "Machine Learning", "Data Visualization"],
      location: "Gurgaon (Hybrid)",
      description: "Analyze historical weather data and build predictive models for agricultural weather services.",
      applicationLink: "#",
      createdAt: "2026-09-03T11:00:00.000Z",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Welcome to Capacity Connect",
      body: "Your account is ready. Start exploring courses and learning paths.",
      type: "system",
      read: false,
      createdAt: "2026-09-07T09:00:00.000Z",
    },
    {
      id: "notif-2",
      title: "New course available",
      body: "Numerical Weather Prediction course has been published.",
      type: "course",
      read: false,
      createdAt: "2026-09-06T14:00:00.000Z",
      link: "/trainee/courses",
    },
    {
      id: "notif-3",
      title: "Assessment deadline approaching",
      body: "Doppler Radar Module 3 assessment is due in 3 days.",
      type: "deadline",
      read: false,
      createdAt: "2026-09-05T10:00:00.000Z",
      link: "/trainee/assessments",
    },
    {
      id: "notif-4",
      title: "Monsoon review session scheduled",
      body: "A training session has been scheduled for 18 Sep at the National Meteorological Centre.",
      type: "event",
      read: true,
      createdAt: "2026-09-04T08:00:00.000Z",
    },
  ],
  auditLog: [
    {
      id: "audit-1",
      timestamp: "2026-09-07T09:15:00.000Z",
      user: "Anil Sharma",
      role: "ADMIN",
      action: "Course Published",
      resource: "Doppler Weather Radar Fundamentals",
      details: "Course status changed from REVIEW to PUBLISHED",
    },
    {
      id: "audit-2",
      timestamp: "2026-09-06T16:30:00.000Z",
      user: "Anil Sharma",
      role: "ADMIN",
      action: "User Approved",
      resource: "vikram.kumar@imd.gov.in",
      details: "Account status changed from PENDING to APPROVED",
    },
    {
      id: "audit-3",
      timestamp: "2026-09-06T11:00:00.000Z",
      user: "Dr. Ananya Rao",
      role: "TRAINER",
      action: "Assessment Created",
      resource: "Doppler Radar - Module 3 Quiz",
      details: "15 questions added, deadline set to 12 Sep 2026",
    },
    {
      id: "audit-4",
      timestamp: "2026-09-05T14:20:00.000Z",
      user: "System",
      role: "SYSTEM",
      action: "Certificate Issued",
      resource: "CC-CYCLONE-VK-20260905",
      details: "Certificate issued to Vikram Kumar for Tropical Cyclone Forecasting",
    },
    {
      id: "audit-5",
      timestamp: "2026-09-05T09:00:00.000Z",
      user: "Anil Sharma",
      role: "ADMIN",
      action: "Role Changed",
      resource: "Dr. Meera Iyer",
      details: "Role updated from TRAINER to SENIOR TRAINER",
    },
    {
      id: "audit-6",
      timestamp: "2026-09-04T13:45:00.000Z",
      user: "Anil Sharma",
      role: "ADMIN",
      action: "Announcement Published",
      resource: "Monsoon forecast review",
      details: "Announcement published to all roles",
    },
  ],
  calendarEvents: [
    {
      id: "cal-1",
      title: "Doppler Radar - Module 3 Assessment Due",
      type: "assessment",
      date: "2026-09-12",
      time: "23:59",
      description: "Last date to complete the Module 3 assessment",
      color: "#d18a32",
    },
    {
      id: "cal-2",
      title: "Monsoon Review Session",
      type: "meeting",
      date: "2026-09-18",
      time: "10:00",
      description: "National Meteorological Centre, New Delhi",
      color: "#0969da",
    },
    {
      id: "cal-3",
      title: "Satellite Meteorology - Live Class",
      type: "class",
      date: "2026-09-15",
      time: "14:00",
      description: "Advanced interpretation techniques for INSAT-3D data",
      color: "#7155c7",
    },
    {
      id: "cal-4",
      title: "IMD Hackathon 2026 - Registration Deadline",
      type: "deadline",
      date: "2026-10-15",
      time: "23:59",
      description: "Last date to register for the India Meteorological Hackathon",
      color: "#b42338",
    },
    {
      id: "cal-5",
      title: "NWP Project Submission",
      type: "project",
      date: "2026-09-25",
      time: "18:00",
      description: "Submit your NWP model output analysis project",
      color: "#2c9a70",
    },
    {
      id: "cal-6",
      title: "IITM Internship Application Deadline",
      type: "deadline",
      date: "2026-09-30",
      time: "23:59",
      description: "Last date to apply for Climate Modelling internship",
      color: "#b42338",
    },
  ],
  certificates: [],
};
const key = "capacity-connect-demo-v2";
let state = initial;
try {
  const saved = JSON.parse(localStorage.getItem(key) || "null");
  if (
    saved?.learning &&
    saved?.profiles &&
    Array.isArray(saved.notices) &&
    Array.isArray(saved.bookmarks)
  )
    state = { ...initial, ...saved };
} catch {
  /* A fresh demo remains usable when storage is unavailable. */
}
const listeners = new Set<() => void>();
export function updateDemo(change: (previous: State) => State) {
  const next = change(state);
  localStorage.setItem(key, JSON.stringify(next));
  state = next;
  listeners.forEach((listener) => listener());
}
export function useDemo() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
  );
}
export const emptyLearning: Learning = { enrolled: false, completed: [] };
export function saveLearning(id: string, patch: Partial<Learning>) {
  updateDemo((previous) => ({
    ...previous,
    learning: {
      ...previous.learning,
      [id]: { ...(previous.learning[id] || emptyLearning), ...patch },
    },
  }));
}
export function progressOf(learning?: Learning) {
  return learning
    ? Math.round(
        ((learning.completed.length +
          (learning.score !== undefined && learning.score >= 70 ? 1 : 0)) /
          4) *
          100,
      )
    : 0;
}
export function getOrCreateCertificate(
  courseId: string,
  courseTitle: string,
  traineeName: string,
  score: number,
): CertificateRecord {
  const existing = state.certificates.find((c) => c.id === courseId);
  if (existing) return existing;
  const now = new Date().toISOString();
  const hash = generateHash(courseId + traineeName + now);
  const certNo =
    "CC-" +
    courseId.toUpperCase().slice(0, 6) +
    "-" +
    now.slice(0, 10).replaceAll("-", "") +
    "-" +
    hash.slice(0, 6).toUpperCase();
  const cert: CertificateRecord = {
    id: courseId,
    certificateNo: certNo,
    hash,
    traineeName,
    courseTitle,
    issuedAt: now,
    score,
  };
  updateDemo((prev) => ({
    ...prev,
    certificates: [...prev.certificates, cert],
  }));
  return cert;
}
function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + Date.now().toString(36);
}
export function addNotification(
  title: string,
  body: string,
  type: string,
  link?: string,
) {
  updateDemo((prev) => ({
    ...prev,
    notifications: [
      {
        id: crypto.randomUUID(),
        title,
        body,
        type,
        read: false,
        createdAt: new Date().toISOString(),
        link,
      },
      ...prev.notifications,
    ],
  }));
}
export function markNotificationsRead() {
  updateDemo((prev) => ({
    ...prev,
    notifications: prev.notifications.map((n) => ({ ...n, read: true })),
  }));
}
export function addAuditEntry(
  user: string,
  role: string,
  action: string,
  resource: string,
  details: string,
) {
  updateDemo((prev) => ({
    ...prev,
    auditLog: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        user,
        role,
        action,
        resource,
        details,
      },
      ...prev.auditLog,
    ],
  }));
}
