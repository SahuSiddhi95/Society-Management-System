import { useEffect, useState } from "react";
import { X, Check, Trash2, ExternalLink, Calendar, Bell, Star } from "lucide-react";
import { getTypeConfig, formatDate, timeAgo } from "../../../utils/notificationConfig";

export default function NotificationDetailsDrawer({
  notification,
  onClose,
  onMarkRead,
  onDelete,
  onNavigate,
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

  const config = getTypeConfig(notification.type);
  const isUnread = !notification.read;
  const isImportant = notification.priority === "important";
  const formattedDate = formatDate(notification.createdAt || notification.date);
  const relTime = timeAgo(notification.createdAt || notification.date);

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        className={`relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out z-10 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${config.iconBg} border ${config.border}`}
            >
              {config.icon}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Notification Details
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                {relTime}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6">
          {/* Status and Category Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
            >
              {config.label}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isUnread
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {isUnread ? "Unread" : "Read"}
            </span>

            {isImportant && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Important
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {notification.title}
            </h3>
          </div>

          {/* Message Content */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line shadow-inner">
            {notification.message}
          </div>

          {/* Metadata Breakdown */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Information
            </h4>

            {formattedDate && (
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Received Date
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {formattedDate}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Category
              </span>
              <span className="font-semibold text-slate-800 capitalize">
                {config.label}
              </span>
            </div>

            {notification.sender && (
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <span className="text-slate-400">Sender</span>
                <span className="font-semibold text-slate-800">
                  {notification.sender}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-2.5">
          {config.route && (
            <button
              onClick={() => {
                onNavigate?.(config.route);
                handleClose();
              }}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200"
            >
              <ExternalLink className="w-4 h-4" />
              View Section
            </button>
          )}

          {isUnread && (
            <button
              onClick={() => onMarkRead?.(notification._id)}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark as Read
            </button>
          )}

          <button
            onClick={() => {
              onDelete?.(notification._id);
              handleClose();
            }}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
