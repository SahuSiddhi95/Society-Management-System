import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import toast from "react-hot-toast";
import * as notificationApi from "../src/api/notificationApi";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const res = await notificationApi.getNotifications();
      const list = Array.isArray(res) ? res : res?.notifications || res?.data || [];
      const normalized = list.map((n) => ({
        ...n,
        isRead: n.isRead !== undefined ? n.isRead : !!n.read,
        read: n.read !== undefined ? n.read : !!n.isRead,
      }));
      setNotifications(normalized);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Optimistic: flip locally first so the UI feels instant, roll back on failure.
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true, read: true } : n))
    );
    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: false, read: false } : n))
      );
      toast.error(
        err?.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    let snapshot;
    setNotifications((prev) => {
      snapshot = prev;
      return prev.map((n) => ({ ...n, isRead: true, read: true }));
    });
    try {
      await notificationApi.markAllRead();
      toast.success("All notifications marked as read");
    } catch (err) {
      setNotifications(snapshot);
      toast.error(
        err?.response?.data?.message || "Failed to mark all as read"
      );
    }
  }, []);

  const removeNotification = useCallback(async (id) => {
    let snapshot;
    setNotifications((prev) => {
      snapshot = prev;
      return prev.filter((n) => n._id !== id);
    });
    try {
      await notificationApi.deleteNotification(id);
      toast.success("Notification deleted");
    } catch (err) {
      setNotifications(snapshot);
      toast.error(
        err?.response?.data?.message || "Failed to delete notification"
      );
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead && !n.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      removeNotification,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      removeNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within a <NotificationProvider>"
    );
  }
  return ctx;
}