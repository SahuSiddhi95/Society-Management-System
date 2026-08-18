import { useRef } from "react";
import { Bell, ChevronRight, CheckCheck } from "lucide-react";
import NotificationCard from "./NotificationCard";
import NotificationSkeleton from "./NotificationSkeleton";
import NotificationEmpty from "./NotificationEmpty";
import useInfiniteReveal from "../../hooks/useInfiniteReveal";

export default function NotificationDropdown({
  notificationState,
  onViewAll,
  onClose,
}) {
  const scrollRef = useRef(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchAll,
    markAsRead,
    markAllAsRead,
  } = notificationState;

  const { visible, hasMore, loadingMore, loadMore } = useInfiniteReveal(
    notifications,
    8
  );

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loadingMore || !hasMore) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom) loadMore();
  };

  const handleCardClick = async (notification) => {
    if (!notification.read) await markAsRead(notification._id);
    onClose();
    // Card click in dropdown just marks as read and closes — full details are on the Notifications page
  };

  return (
    <>
      {/* Scoped keyframes */}
      <style>{`
        @keyframes notifPopIn {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .notif-dropdown { animation: notifPopIn 0.18s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <div
        className="notif-dropdown absolute right-0 mt-2 w-[380px] max-w-[94vw] bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden"
        style={{ boxShadow: "0 20px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)" }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-[10px] text-indigo-600 font-medium mt-0.5">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                All read
              </button>
            )}
            <button
              onClick={onViewAll}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ──────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{
            maxHeight: "420px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(99,102,241,0.2) transparent",
          }}
        >
          {/* Loading */}
          {loading && <NotificationSkeleton count={4} compact />}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
              <span className="text-2xl">⚠️</span>
              <p className="text-xs text-slate-400 max-w-[200px]">{error}</p>
              <button
                onClick={fetchAll}
                className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && visible.length === 0 && (
            <NotificationEmpty compact />
          )}

          {/* Cards */}
          {!loading &&
            !error &&
            visible.map((n) => (
              <NotificationCard
                key={n._id}
                notification={n}
                compact
                onClick={() => handleCardClick(n)}
              />
            ))}

          {/* Load more */}
          {loadingMore && (
            <div className="py-3 text-center text-xs text-slate-400">
              Loading more…
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onViewAll}
            className="w-full py-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-1.5"
          >
            See all notifications
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}