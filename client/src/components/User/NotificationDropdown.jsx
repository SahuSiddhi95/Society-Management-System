import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./NotificationCard";
import NotificationSkeleton from "./NotificationSkeleton";
import NotificationEmpty from "./NotificationEmpty";
import useInfiniteReveal from "../../hooks/useInfiniteReveal";
import { getTypeConfig } from "../../../utils/notificationConfig";

export default function NotificationDropdown({ notificationState, onViewAll, onClose }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const { notifications, loading, error, fetchAll, markAsRead } = notificationState;

  // Only the latest batch renders up front; scrolling near the bottom reveals more.
  const { visible, hasMore, loadingMore, loadMore } = useInfiniteReveal(notifications, 8);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || loadingMore || !hasMore) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom) loadMore();
  };

  const handleCardClick = async (notification) => {
    if (!notification.read) await markAsRead(notification._id);
    const config = getTypeConfig(notification.type);
    onClose();
    if (config.route) navigate(config.route);
  };

  return (
    <div className="absolute right-0 mt-2 w-[360px] max-w-[92vw] bg-white rounded-xl shadow-md border border-slate-200 z-50 origin-top-right animate-notif-pop">
      {/* Scoped keyframes for the dropdown's entrance transition only —
          no new colors/spacing, purely a motion detail. Move into your
          global stylesheet if preferred. */}
      <style>{`
        @keyframes notifPop {
          from { opacity: 0; transform: scale(0.97) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-notif-pop { animation: notifPop 0.15s ease-out; }
      `}</style>

      {/* Sticky header — same border/shadow language as the Topbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-xl">
        <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View All <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} onScroll={handleScroll} className="max-h-[500px] overflow-y-auto">
        {loading && <NotificationSkeleton count={4} />}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
            <span className="text-2xl">⚠️</span>
            <p className="text-xs text-slate-400">{error}</p>
            <button
              onClick={fetchAll}
              className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && visible.length === 0 && <NotificationEmpty compact />}

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

        {loadingMore && (
          <div className="py-3 text-center text-xs text-slate-400">Loading more…</div>
        )}
      </div>
    </div>
  );
}