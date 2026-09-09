import {
  cloneElement,
  isValidElement,
  useId,
  type PropsWithChildren,
} from "react";
export function Tooltips({
  children,
  label,
}: PropsWithChildren<{ label: string }>) {
  const id = useId();
  return (
    <span className="tooltip-host">
      {isValidElement<{ "aria-describedby"?: string }>(children)
        ? cloneElement(children, {
            "aria-describedby": [children.props["aria-describedby"], id]
              .filter(Boolean)
              .join(" "),
          })
        : children}
      <span id={id} role="tooltip" className="tooltip-label">
        {label}
      </span>
    </span>
  );
}
