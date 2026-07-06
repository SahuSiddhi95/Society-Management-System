import { FILTERS } from "../../../utils/notificationConfig";

export default function NotificationFilters({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
            active === f.key
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}