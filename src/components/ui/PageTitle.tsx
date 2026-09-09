import type React from "react";
export function PageTitle({
  kicker,
  title,
  desc,
  action,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <p className="eyebrow">{kicker || "CAPACITY CONNECT"}</p>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {action}
    </div>
  );
}
