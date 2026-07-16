import NotificationItem from "./NotificationItem";
import { useNotifications } from "../../../context/Notificationcontext";

export default function NotificationDropdown({ onClose, onViewAll }) {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  const recent = notifications.slice(0, 8);

  return (
    <div className="w-[360px] bg-white rounded-2xl shadow-[0_12px_32px_-8px_rgba(15,23,42,0.25)] ring-1 ring-black/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-900">Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={fetchNotifications}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
            <span className="text-2xl">🔔</span>
            <p className="text-xs text-gray-500">No notifications yet</p>
          </div>
        ) : (
          recent.map((n) => <NotificationItem key={n._id} notification={n} />)
        )}
      </div>

      {/* Footer */}
      <button
        onClick={onViewAll}
        
        className="w-full text-center text-xs font-semibold text-indigo-600 hover:bg-gray-50 py-3 border-t border-gray-100 transition-colors"
      >
        
        View All Notifications
      </button>
    </div>
  );
}