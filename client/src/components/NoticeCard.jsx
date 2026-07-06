const CategoryBadge = {
  Maintenance: "bg-amber-900/40 text-amber-400",
  Meeting: "bg-indigo-900/40 text-indigo-400",
  Update: "bg-green-900/40 text-green-400",
  Event: "bg-purple-900/40 text-purple-400",
};

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

const NoticeCard = ({ recentNotices = [] }) => {
  // Show only the latest 5, most recent first
  const notices = [...recentNotices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-[#171717] border border-gray-800 rounded-2xl p-6 flex-1">
      <h2 className="text-2xl font-semibold mb-5">Recent Notices</h2>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <p className="text-gray-500 text-sm">No notices yet.</p>
        ) : (
          notices.map((n) => {
            const dateLabel = getDateLabel(n.createdAt);
            const isRecent = dateLabel === "Today" || dateLabel === "Yesterday";

            return (
              <div
                key={n._id}
                className="bg-[#1f1f1f] p-4 rounded-xl flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{n.title}</h3>
                    {n.category && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${
                          CategoryBadge[n.category] || "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {n.category}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 mt-2 text-sm">
                    {n.postedBy || "Admin"}
                  </p>
                </div>

                {/* Right-side date badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                    isRecent
                      ? "bg-indigo-900/40 text-indigo-300"
                      : "bg-slate-800 text-slate-400"
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
};

export default NoticeCard;