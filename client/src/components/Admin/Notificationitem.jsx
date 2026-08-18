import Icon from "./shared/Icon";
import useNotifications from "../../hooks/useNotifications";
import { formatTimeAgo } from "./Timeago";

const TYPE_ICON = {
  complaint:
    "M12 9v2m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  maintenance:
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.77z",
  notice: "M3 11l18-5v12L3 14v-3z M11.6 16.8a2 2 0 1 1-3.2 2.4",
  event:
    "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  visitor:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  default:
    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

const checkPath = "M20 6 9 17l-5-5";
const trashPath =
  "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6";

export default function NotificationItem({ notification }) {
  const { markAsRead, remove } = useNotifications();
  const isRead = !!notification.read;

  return (
    <div
      className={`group flex gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 transition-colors ${
        isRead ? "opacity-60 hover:opacity-100" : "bg-blue-50/60 hover:bg-blue-50"
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 relative">
        <Icon
          d={TYPE_ICON[notification.type] || TYPE_ICON.default}
          size={15}
          color="#6366f1"
        />
        {!isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm text-gray-900 truncate ${
            isRead ? "font-medium" : "font-bold"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
          {notification.user?.name && (
            <>
              <span>{notification.user.name}</span>
              {notification.user?.flatNo && (
                <span>· {notification.user.flatNo}</span>
              )}
              <span>·</span>
            </>
          )}
          <span>{formatTimeAgo(notification.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!isRead && (
          <button
            onClick={() => markAsRead(notification._id)}
            title="Mark as read"
            className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-green-50"
          >
            <Icon d={checkPath} size={12} color="#16a34a" />
          </button>
        )}
        <button
          onClick={() => remove(notification._id)}
          title="Delete"
          className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50"
        >
          <Icon d={trashPath} size={12} color="#ef4444" />
        </button>
      </div>
    </div>
  );
}