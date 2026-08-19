import Icon from "../../assets/icons";

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
    <div className="col-span-3 bg-white border border-slate-200/60 rounded-3xl p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Recent Notices
        </h3>
        <button
          onClick={() => setActiveNav("notices")}
          className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline transition-colors"
        >
          View all →
        </button>
      </div>
      <div className="flex flex-col gap-1 -mx-2">
        {recentNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
             <div className="text-3xl mb-2 opacity-50">📰</div>
             <p className="text-sm">No recent notices</p>
          </div>
        ) : (
          recentNotices.map((n, i) => {
            const dateLabel = getDateLabel(n.createdAt);
            const isRecent = dateLabel === "Today" || dateLabel === "Yesterday";

            return (
              <div
                key={n._id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default"
              >
                <div className="flex gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-lg shrink-0 text-indigo-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <Icon name="notice" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors truncate pr-4">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Posted by {n.postedBy || "Admin"}
                    </p>
                  </div>
                </div>

                {/* Right-side date badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shrink-0 shadow-sm ${isRecent
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                      : "bg-white text-slate-500 border border-slate-200"
                    }`}
                >
                  {dateLabel}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}