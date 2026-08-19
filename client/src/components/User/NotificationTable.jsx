import { getTypeConfig, timeAgo } from "../../../utils/notificationConfig";
import { Check, Trash2, ChevronRight, Star } from "lucide-react";

export default function NotificationTable({
  notifications,
  loading,
  onSelect,
  onMarkRead,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 sm:px-6 py-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-100 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
            <div className="h-5 w-16 bg-slate-100 rounded-full hidden md:block" />
            <div className="h-3 w-16 bg-slate-100 rounded hidden sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <span className="text-3xl mb-2">🔔</span>
        <p className="text-sm font-semibold text-slate-700">No notifications matching filters</p>
        <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different category.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Table Header (Hidden on small screens for cleaner mobile cards-in-table feel) */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span className="col-span-6 md:col-span-5">Notification</span>
        <span className="col-span-3 md:col-span-3">Category</span>
        <span className="hidden md:block md:col-span-2">Received</span>
        <span className="col-span-3 md:col-span-2 text-right">Actions</span>
      </div>

      {/* Row Items */}
      <div className="divide-y divide-slate-100 bg-white">
        {notifications.map((n) => {
          const config = getTypeConfig(n.type);
          const isUnread = !n.read;
          const isImportant = n.priority === "important";
          const timeStr = timeAgo(n.createdAt || n.date);

          return (
            <div
              key={n._id}
              onClick={() => onSelect(n)}
              className={`
                group grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center px-4 sm:px-6 py-3.5
                hover:bg-slate-50/80 transition-colors cursor-pointer relative
                ${isUnread ? "bg-indigo-50/20" : ""}
              `}
            >
              {/* Notification Main Info (Icon + Title + Snippet) */}
              <div className="sm:col-span-6 md:col-span-5 flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${config.iconBg} border ${config.border}`}
                >
                  {config.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm truncate leading-snug ${
                        isUnread ? "font-bold text-slate-900" : "font-medium text-slate-700"
                      }`}
                    >
                      {n.title}
                    </p>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                    {isImportant && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {n.message}
                  </p>
                </div>
              </div>

              {/* Category Badge & Status */}
              <div className="sm:col-span-3 md:col-span-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.bg} ${config.text} ${config.border}`}
                >
                  {config.label}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isUnread
                      ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {isUnread ? "Unread" : "Read"}
                </span>
              </div>

              {/* Received Time (Desktop only) */}
              <div className="hidden md:block md:col-span-2 text-xs text-slate-400">
                {timeStr}
              </div>

              {/* Actions */}
              <div
                className="sm:col-span-3 md:col-span-2 flex items-center justify-between sm:justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] text-slate-400 sm:hidden">{timeStr}</span>

                <div className="flex items-center gap-1">
                  {isUnread && (
                    <button
                      onClick={() => onMarkRead?.(n._id)}
                      title="Mark as read"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete?.(n._id)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelect(n)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                    title="Details"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
