import { useEffect, useState } from "react";
import Icon from "./shared/Icon";
import { formatTimeAgo } from "./Timeago";

const xPath = "M18 6 6 18 M6 6l12 12";
const checkPath = "M20 6 9 17l-5-5";
const trashPath =
  "M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6";

export default function NotificationDetailsDrawer({
  notification,
  onClose,
  onMarkRead,
  onDelete,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [notification]);

  useEffect(() => {
    if (!notification) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification]);

  if (!notification) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const residentName = notification.senderName || notification.user?.name || "—";
  const flatNumber = notification.flatNo || notification.user?.flatNo || notification.user?.flatNumber || "—";
  const isRead = !!(notification.isRead || notification.read);

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            Notification Details
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Icon d={xPath} size={14} color="#6b7280" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                isRead
                  ? "bg-gray-100 text-gray-500"
                  : "bg-indigo-50 text-indigo-700 font-bold border border-indigo-100"
              }`}
            >
              {isRead ? "Read" : "Unread"}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-3">
              {notification.title}
            </h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {notification.message}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Resident Metadata
            </h4>
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Resident Name</span>
              <span className="font-bold text-gray-900 bg-indigo-50 px-2.5 py-1 rounded-lg text-indigo-700 border border-indigo-100">
                👤 {residentName}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Flat Number</span>
              <span className="font-bold text-indigo-900 bg-indigo-100/60 px-2.5 py-1 rounded-lg border border-indigo-200">
                Flat {flatNumber}
              </span>
            </div>
            {notification.user?.email && (
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="font-semibold text-gray-700">
                  {notification.user.email}
                </span>
              </div>
            )}
            {notification.user?.phone && (
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
                <span className="text-gray-400 font-medium">Phone</span>
                <span className="font-semibold text-gray-700">
                  {notification.user.phone}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Type</span>
              <span className="font-semibold text-gray-800 capitalize">
                {notification.type || "General"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Received Date</span>
              <span className="font-semibold text-gray-800">
                {formatTimeAgo(notification.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100">
          {!isRead && (
            <button
              type="button"
              onClick={() => onMarkRead(notification._id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Icon d={checkPath} size={14} color="#15803d" />
              Mark Read
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onDelete(notification._id);
              handleClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Icon d={trashPath} size={14} color="#dc2626" />
            Delete
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}