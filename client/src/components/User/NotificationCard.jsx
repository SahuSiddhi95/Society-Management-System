import { getTypeConfig, timeAgo } from "../../../utils/notificationConfig";
import { Check, Trash2, ChevronRight, Star } from "lucide-react";

/**
 * Two modes:
 *  - compact=true   → dense dropdown row style used in NotificationDropdown
 *  - compact=false  → full card used on the Notifications page
 */
export default function NotificationCard({
  notification,
  compact = false,
  onClick,
  onMarkRead,
  onDelete,
}) {
  const config = getTypeConfig(notification.type);
  const isUnread = !notification.read;
  const isImportant = notification.priority === "important";
  const timeStr = timeAgo(notification.createdAt || notification.date);

  // ── Compact (Dropdown) Mode ──────────────────────────────────────────────
  if (compact) {
    return (
      <div
        onClick={onClick}
        className="group flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
      >
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${config.iconBg} border ${config.border}`}
        >
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
              {notification.title}
            </p>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
            )}
          </div>

          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <span className="text-[11px] text-slate-400 mt-1 block">{timeStr}</span>
        </div>
      </div>
    );
  }

  // ── Full Card Mode ───────────────────────────────────────────────────────
  return (
    <div
      onClick={onClick}
      className={[
        "group relative flex gap-3.5 px-4 py-4 cursor-pointer rounded-xl border shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
        isUnread
          ? `bg-indigo-50/40 border-l-4 ${config.leftBorder} border-slate-200`
          : "bg-white border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      {/* Type icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl ${config.iconBg} border ${config.border}`}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <p
              className={`text-sm leading-snug truncate ${
                isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-700"
              }`}
            >
              {notification.title}
            </p>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 flex-none" />
            )}
            {isImportant && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 flex-none" />
            )}
          </div>

          {/* Category badge */}
          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${config.bg} ${config.text} ${config.border}`}
          >
            {config.label}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
          {notification.message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">{timeStr}</span>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                isUnread
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {isUnread ? "Unread" : "Read"}
            </span>

            {isImportant && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-50 text-amber-600 border-amber-100">
                Important
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {isUnread && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead?.(notification._id);
                  }}
                  title="Mark as read"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(notification._id);
                }}
                title="Delete notification"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}