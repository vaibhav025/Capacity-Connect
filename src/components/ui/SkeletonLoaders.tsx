export function SkeletonLoaders({
  label = "Loading content",
}: {
  label?: string;
}) {
  return (
    <div role="status" aria-label={label} className="space-y-4 p-6">
      <span className="sr-only">{label}</span>
      {[80, 100, 65].map((width) => (
        <div
          key={width}
          className="skeleton h-5 rounded-lg bg-slate-200"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}
