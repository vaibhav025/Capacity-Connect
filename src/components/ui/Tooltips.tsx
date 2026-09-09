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
