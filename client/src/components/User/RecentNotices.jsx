import { DotColor } from "./shared/constants";

// Returns "Today", "Yesterday", or a short date like "May 15"
const getDateLabel = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function RecentNotices({ setActiveNav, recentNotices = [] }) {
  return (
    <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Recent Notices
        </h3>
        <button
          onClick={() => setActiveNav("notices")}
          className="text-indigo-600 text-xs font-medium hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="flex flex-col">
        {recentNotices.map((n, i) => {
          const dateLabel = getDateLabel(n.createdAt);
          const isRecent = dateLabel === "Today" || dateLabel === "Yesterday";

          return (
            <div
              key={n._id}
              className={`flex items-start justify-between gap-3 py-3 ${i < recentNotices.length - 1 ? "border-b border-slate-100" : ""
                }`}
            >
              <div className="flex gap-3 min-w-0">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${DotColor[n.dot] || "bg-indigo-500"
                    }`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 leading-snug">
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Posted by {n.postedBy || "Admin"}
                  </p>
                </div>
              </div>

              {/* Right-side date badge */}
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${isRecent
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-slate-100 text-slate-500"
                  }`}
              >
                {dateLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}