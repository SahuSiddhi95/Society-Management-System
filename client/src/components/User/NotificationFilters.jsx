import { FILTERS } from "../../../utils/notificationConfig";

export default function NotificationFilters({ active, onChange, counts = {} }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const count = counts[f.key];
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
              border whitespace-nowrap shrink-0 transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700"
              }
            `}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}