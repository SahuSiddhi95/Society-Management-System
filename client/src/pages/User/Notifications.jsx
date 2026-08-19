import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCheck, Trash2, Bell, Inbox, AlertCircle, CheckCircle2 } from "lucide-react";

import NotificationCard from "../../components/User/NotificationCard";
import NotificationTable from "../../components/User/NotificationTable";
import NotificationFilters from "../../components/User/NotificationFilters";
import NotificationDetailsDrawer from "../../components/User/NotificationDetailsDrawer";
import NotificationEmpty from "../../components/User/NotificationEmpty";
import NotificationSkeleton from "../../components/User/NotificationSkeleton";
import ConfirmModal from "../../components/common/ConfirmModal";
import useNotifications from "../../hooks/useNotifications";
import useInfiniteReveal from "../../hooks/useInfiniteReveal";
import { getTypeConfig } from "../../../utils/notificationConfig";

export default function Notifications() {
  const navigate = useNavigate();

  // Control states
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("card"); // "card" | "table"

  // Drawer & Modal state
  const [selected, setSelected] = useState(null);
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

  // Calculate live count badges per filter
  const counts = useMemo(() => {
    const res = {
      all: notifications.length,
      unread: 0,
      read: 0,
    };
    notifications.forEach((n) => {
      if (n.read) res.read++;
      else res.unread++;

      if (n.type) {
        res[n.type] = (res[n.type] || 0) + 1;
      }
    });
    return res;
  }, [notifications]);

  // Statistics overview
  const stats = useMemo(() => {
    const unread = notifications.filter((n) => !n.read).length;
    const read = notifications.length - unread;
    const important = notifications.filter(
      (n) => n.priority === "important" || n.type === "maintenance" || n.type === "complaint"
    ).length;

    return {
      total: notifications.length,
      unread,
      read,
      important,
    };
  }, [notifications]);

  // Filtered & Sorted list
  const filtered = useMemo(() => {
    let list = [...notifications];

    // 1. Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q)
      );
    }

    // 2. Category / Status Filter
    if (filter === "unread") list = list.filter((n) => !n.read);
    else if (filter === "read") list = list.filter((n) => n.read);
    else if (filter !== "all") list = list.filter((n) => n.type === filter);

    // 3. Sorting
    if (sortOrder === "newest") {
      list.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    } else if (sortOrder === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
    } else if (sortOrder === "unread") {
      list.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
    }

    return list;
  }, [notifications, search, filter, sortOrder]);

  const { visible, hasMore, loadingMore, loadMore } = useInfiniteReveal(filtered, 12);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom && hasMore && !loadingMore) loadMore();
  };

  const handleCardClick = (notification) => {
    if (!notification.read) markAsRead(notification._id);
    setSelected(notification);
  };

  const handleConfirm = async () => {
    if (confirmModal?.type === "deleteAll") await removeAll();
    if (confirmModal?.type === "deleteOne") await remove(confirmModal.id);
    setConfirmModal(null);
  };

  return (
    <>
      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto space-y-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Notifications
              </h1>
              {stats.unread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                  {stats.unread} new
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Stay updated with society notices, payments, events, and maintenance alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              onClick={markAllAsRead}
              disabled={loading || stats.unread === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden xs:inline">Mark all as read</span>
              <span className="xs:hidden">Mark read</span>
            </button>
            <button
              onClick={() => setConfirmModal({ type: "deleteAll" })}
              disabled={loading || notifications.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden xs:inline">Delete all</span>
              <span className="xs:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Total
              </span>
              <span className="text-lg font-bold text-slate-900">
                {loading ? "—" : stats.total}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Unread
              </span>
              <span className="text-lg font-bold text-indigo-600">
                {loading ? "—" : stats.unread}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Read
              </span>
              <span className="text-lg font-bold text-slate-900">
                {loading ? "—" : stats.read}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Priority
              </span>
              <span className="text-lg font-bold text-slate-900">
                {loading ? "—" : stats.important}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Sort, View mode & Category filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <NotificationFilters
            activeFilter={filter}
            onFilterChange={setFilter}
            searchQuery={search}
            onSearchChange={setSearch}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            counts={counts}
          />
        </div>

        {/* Notifications List / Table Container */}
        <div
          className="overflow-y-auto pr-0.5 space-y-3 focus:outline-none"
          onScroll={handleScroll}
        >
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
              <NotificationSkeleton count={6} />
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl">⚠️</span>
              <p className="text-sm font-semibold text-slate-700">{error}</p>
              <button
                onClick={fetchAll}
                className="mt-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <NotificationEmpty />
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <>
              {viewMode === "card" ? (
                <div className="grid grid-cols-1 gap-3">
                  {visible.map((n) => (
                    <NotificationCard
                      key={n._id}
                      notification={n}
                      onClick={() => handleCardClick(n)}
                      onMarkRead={markAsRead}
                      onDelete={(id) => setConfirmModal({ type: "deleteOne", id })}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <NotificationTable
                    notifications={visible}
                    loading={loading}
                    onSelect={handleCardClick}
                    onMarkRead={markAsRead}
                    onDelete={(id) => setConfirmModal({ type: "deleteOne", id })}
                  />
                </div>
              )}
            </>
          )}

          {loadingMore && (
            <div className="py-4 text-center text-xs font-medium text-slate-400 animate-pulse">
              Loading more notifications…
            </div>
          )}
        </div>
      </div>

      {/* Slide Drawer Details */}
      <NotificationDetailsDrawer
        notification={selected}
        onClose={() => setSelected(null)}
        onMarkRead={(id) => {
          markAsRead(id);
          setSelected((prev) => (prev ? { ...prev, read: true } : prev));
        }}
        onDelete={(id) => {
          setConfirmModal({ type: "deleteOne", id });
          setSelected(null);
        }}
        onNavigate={(route) => {
          navigate(route);
        }}
      />

      {/* Confirmation Modal */}
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
    </>
  );
}