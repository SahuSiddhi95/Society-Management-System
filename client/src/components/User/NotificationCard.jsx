import { getTypeConfig, timeAgo } from "../../../utils/notificationConfig";

/**
 * `compact` renders the dense dropdown-row style.
 * Full mode (compact=false, used on the Notifications page) adds the same
 * card treatment as the rest of the dashboard (white, border-slate-200,
 * rounded-xl, shadow-sm) and reveals Mark-read / Delete on hover.
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

  return (
    <div
      onClick={onClick}
      className={[
        "group flex gap-3 px-4 py-3 cursor-pointer transition-colors",
        "hover:bg-slate-50",
        compact
          ? "border-b border-slate-100 last:border-b-0"
          : `rounded-xl border shadow-sm mb-2 ${
              isUnread
                ? "border-indigo-200 bg-indigo-50/40"
                : "border-slate-200 bg-white"
            }`,
      ].join(" ")}
    >
      {/* Type icon — same square, rounded-xl treatment as the dashboard's buttons/avatar */}
      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-base">
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-slate-800 truncate">
            {notification.title}
          </p>
          {isUnread && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
          )}
        </div>

        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] text-slate-400">{timeAgo(notification.createdAt)}</span>

          {!compact && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUnread && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead?.(notification._id);
                  }}
                  title="Mark as read"
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors text-sm"
                >
                  ✓
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(notification._id);
                }}
                title="Delete"
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors text-sm"
              >
                🗑
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}