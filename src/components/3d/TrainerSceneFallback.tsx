import { Globe2, GraduationCap } from "lucide-react";
export function TrainerSceneFallback() {
  return (
    <div className="trainer-fallback" aria-hidden="true">
      <div className="fallback-orbit orbit-one" />
      <div className="fallback-orbit orbit-two" />
      <div className="fallback-globe">
        <Globe2 size={112} strokeWidth={0.65} />
      </div>
      <div className="fallback-board">
        <GraduationCap size={24} />
        <span>KNOWLEDGE IN MOTION</span>
        <b>Learn. Apply. Advance.</b>
      </div>
    </div>
  );
}
