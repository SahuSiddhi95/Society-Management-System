import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Adjust these two import paths if your Sidebar/Topbar live elsewhere.
import Sidebar from "../../components/User/Sidebar";

import NotificationCard from "../../components/User/NotificationCard";
import NotificationFilters from "../../components/User/NotificationFilters";
import NotificationEmpty from "../../components/User/NotificationEmpty";
import NotificationSkeleton from "../../components/User/NotificationSkeleton";
import ConfirmModal from "../../components/common/ConfirmModal";
import useNotifications from "../../hooks/useNotifications";
import useInfiniteReveal from "../../hooks/useInfiniteReveal";
import { getTypeConfig } from "../../../utils/notificationConfig";

export default function Notifications({ activeNav,
  setActiveNav,
  user,
  complaints: dashboardComplaints = [],
  fetchDashboardData,
  recentNotices = [],
  events = [],
  dues = [],
  transactions = [],
}) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  // null | { type: "deleteAll" } | { type: "deleteOne", id }
  const [confirmModal, setConfirmModal] = useState(null);

  const {
    notifications,
    loading,
    error,
    fetchAll,
    markAsRead,
    markAllAsRead,
    remove,
    removeAll,
  } = useNotifications();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "read") return notifications.filter((n) => n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const { visible, hasMore, loadingMore, loadMore } = useInfiniteReveal(filtered, 12);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom && hasMore && !loadingMore) loadMore();
  };

  // Mark as read, then navigate according to the type -> route mapping.
  const handleCardClick = async (notification) => {
    if (!notification.read) await markAsRead(notification._id);
    const config = getTypeConfig(notification.type);
    if (config.route) navigate(config.route);
  };

  const handleConfirm = async () => {
    if (confirmModal?.type === "deleteAll") await removeAll();
    if (confirmModal?.type === "deleteOne") await remove(confirmModal.id);
    setConfirmModal(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={dashboardComplaints}
        fetchDashboardData={fetchDashboardData}
        recentNotices={recentNotices}
        events={events}
        dues={dues}
        transactions={transactions}
      />

      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Notifications</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Stay updated with your latest notifications
            </p>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-lg font-bold text-slate-800">Notifications</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setConfirmModal({ type: "deleteAll" })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-200 text-red-600 hover:bg-slate-200 transition-colors"
              >
                Delete all
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <NotificationFilters active={filter} onChange={setFilter} />
          </div>

          {/* List */}
          <div
            className="overflow-y-auto pr-1"
            style={{ maxHeight: "calc(100vh - 260px)" }}
            onScroll={handleScroll}
          >
            {loading && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <NotificationSkeleton count={6} />
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm text-slate-400">{error}</p>
                <button
                  onClick={fetchAll}
                  className="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Retry
                </button>

              </div>

            )}

            {!loading && !error && visible.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <NotificationEmpty />
              </div>
            )}

            {!loading &&
              !error &&
              visible.map((n) => (
                <NotificationCard
                  key={n._id}
                  notification={n}
                  onClick={() => handleCardClick(n)}
                  onMarkRead={markAsRead}
                  onDelete={(id) => setConfirmModal({ type: "deleteOne", id })}
                />
              ))}

            {loadingMore && (
              <div className="py-4 text-center text-xs text-slate-400">Loading more…</div>
            )}
          </div>

        </main>

      </div>

      <ConfirmModal
        open={!!confirmModal}
        title={confirmModal?.type === "deleteAll" ? "Delete all notifications?" : "Delete notification?"}
        message={
          confirmModal?.type === "deleteAll"
            ? "This will permanently remove all your notifications. This action cannot be undone."
            : "This notification will be permanently removed."
        }
        confirmLabel="Delete"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal(null)}
      />

    </div>

  );
}