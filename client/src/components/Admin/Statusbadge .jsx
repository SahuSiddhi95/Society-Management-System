// src/components/complaints/StatusBadge.jsx
const STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const DOT_STYLES = {
  pending: "bg-amber-500",
  resolved: "bg-emerald-500",
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-600 ring-slate-500/20";
  const dot = DOT_STYLES[status] || "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}