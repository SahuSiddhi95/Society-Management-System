import Icon from "./shared/Icon";
import { formatTimeAgo } from "./Timeago";

const checkPath = "M20 6 9 17l-5-5";
const trashPath =
  "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6";
const bellPath =
  "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0";

export default function NotificationTable({
  notifications,
  loading,
  onSelect,
  onMarkRead,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-7 gap-4 items-center px-6 py-4 animate-pulse"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100" />
            <div className="h-3 bg-gray-100 rounded col-span-2" />
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
            <div className="h-3 bg-gray-100 rounded ml-auto w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-3xl">🔔</span>
        <p className="text-sm font-semibold text-gray-700">No notifications found</p>
        <p className="text-xs text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-4 px-6 py-2 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        <span></span>
        <span className="col-span-2">Notification</span>
        <span className="col-span-2">Resident &amp; Flat</span>
        <span>Date &amp; Time</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="divide-y divide-gray-50">
        {notifications.map((n) => {
          const userObj = typeof n.user === "object" ? n.user : null;
          const residentName = userObj?.name || n.senderName || n.sender;
          const flatNo = userObj?.flatNo || userObj?.flatNumber || n.flatNo || n.flatNumber;
          const isRead = !!(n.isRead || n.read);

          let residentLabel = "";
          if (residentName && flatNo) {
            residentLabel = `${residentName} • Flat ${flatNo}`;
          } else if (residentName) {
            residentLabel = residentName;
          } else if (flatNo) {
            residentLabel = `Flat ${flatNo}`;
          }

          return (
            <div
              key={n._id}
              onClick={() => onSelect(n)}
              className="grid grid-cols-7 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
                <Icon d={bellPath} size={14} color="#6366f1" />
              </div>

              <div className="col-span-2 min-w-0">
                <p
                  className={`text-sm text-gray-900 truncate ${
                    isRead ? "font-medium" : "font-bold"
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{n.message}</p>
              </div>

              <div className="col-span-2 min-w-0">
                {residentLabel ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 truncate max-w-full">
                    👤 {residentLabel}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">—</span>
                )}
              </div>

              <span className="text-xs text-gray-500">
                {formatTimeAgo(n.createdAt)}
              </span>

              <div
                className="flex items-center justify-end gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {!isRead && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(n._id)}
                    title="Mark as read"
                    className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-green-50 transition-colors"
                  >
                    <Icon d={checkPath} size={12} color="#16a34a" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(n._id)}
                  title="Delete"
                  className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Icon d={trashPath} size={12} color="#ef4444" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}