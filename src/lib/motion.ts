import { useSyncExternalStore } from "react";

const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribe = (listener: () => void) => {
  preference.addEventListener("change", listener);
  return () => preference.removeEventListener("change", listener);
};
/** Unlike the installed Motion hook, this follows preference changes live. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => preference.matches,
    () => true,
  );
}
