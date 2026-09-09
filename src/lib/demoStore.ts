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
type State = {
  learning: Record<string, Learning>;
  notices: Notice[];
  profiles: Record<string, ProfileRecord>;
  bookmarks: string[];
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
    state = saved;
} catch {
  /* A fresh demo remains usable when storage is unavailable. */
}
const listeners = new Set<() => void>();
export function updateDemo(change: (previous: State) => State) {
  const next = change(state);
  // Persist before committing so the UI never reports a successful save that failed.
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
