import { useMemo, useState } from "react";
// import NotificationCard from "../../components/Admin/Notificationcard";
import NotificationTable from "../../components/Admin/Notificationtable";
import NotificationDetailsDrawer from "../../components/Admin/Notificationdetailsdrawer";
import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";
import { useNotifications } from "../../../context/Notificationcontext";

const FILTERS = ["All", "Unread", "Read", "Newest", "Oldest"];

export default function NotificationPage({
  active,
  setActive,
  users,
}) {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    removeNotification,
  } = useNotifications();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...notifications];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q) ||
          n.user?.name?.toLowerCase().includes(q)
      );
    }

    if (filter === "Unread") list = list.filter((n) => !n.isRead);
    if (filter === "Read") list = list.filter((n) => n.isRead);
    if (filter === "Newest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (filter === "Oldest")
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return list;
  }, [notifications, search, filter]);

  // const stats = useMemo(() => {
  //   const today = new Date().toDateString();
  //   return {
  //     total: notifications.length,
  //     unread: notifications.filter((n) => !n.isRead).length,
  //     read: notifications.filter((n) => n.isRead).length,
  //     today: notifications.filter(
  //       (n) => new Date(n.createdAt).toDateString() === today
  //     ).length,
  //   };
  // }, [notifications]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
      />

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar
          users={users}
          setActive={setActive}
        />

        {/* Page Content */}
        <main className="flex-1 p-6">

          <div className=" flex-1 flex flex-col min-h-screen">


            <main className="p-2 flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Notification history and activity
                </p>
              </div>

              {/* Summary cards */}
              {/* <div className="grid grid-cols-4 gap-4">
            <NotificationCard label="Total Notifications" value={loading ? "—" : stats.total} accent="indigo" />
            <NotificationCard label="Unread Notifications" value={loading ? "—" : stats.unread} accent="blue" />
            <NotificationCard label="Read Notifications" value={loading ? "—" : stats.read} accent="gray" />
            <NotificationCard label="Today's Notifications" value={loading ? "—" : stats.today} accent="green" />
          </div> */}

              {/* Search + filters */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, message, or user..."
                  className="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${filter === f
                          ? "bg-indigo-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                {error ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <span className="text-3xl">⚠️</span>
                    <p className="text-sm font-semibold text-gray-700">
                      Failed to load notifications
                    </p>
                    <p className="text-xs text-gray-400 max-w-xs">{error}</p>
                    <button
                      onClick={fetchNotifications}
                      className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <NotificationTable
                    notifications={filtered}
                    loading={loading}
                    onSelect={setSelected}
                    onMarkRead={markAsRead}
                    onDelete={removeNotification}
                  />
                )}
              </div>
            </main>
          </div>

          <NotificationDetailsDrawer
            notification={selected}
            onClose={() => setSelected(null)}
            onMarkRead={(id) => {
              markAsRead(id);
              setSelected((prev) =>
                prev ? { ...prev, isRead: true } : prev
              );
            }}
            onDelete={(id) => {
              removeNotification(id);
              setSelected(null);
            }}
          />
        </main>
      </div>
    </div>
  );
}