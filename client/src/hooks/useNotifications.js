import { useState, useCallback, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllRead as apiMarkAllRead,
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications as apiDeleteAllNotifications,
} from "../api/notificationApi";

/**
 * Single source of truth for notification data.
 * Shared by NotificationBell (badge + dropdown) and the full Notifications page,
 * so read/delete actions taken in one place stay consistent everywhere it's used.
 *
 * Pagination note: the API layer doesn't expose page/limit params, so this hook
 * fetches the full list once and lets consumers do client-side infinite reveal
 * via the useInfiniteReveal hook. If the backend later supports ?page=&limit=,
 * only fetchAll() needs to change.
 */
export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchedOnce = useRef(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : data?.notifications || [];
      setNotifications(list);
      fetchedOnce.current = true;
    } catch (err) {
      setError("Couldn't load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data?.count ?? data?.unreadCount ?? 0);
    } catch (err) {
      // Silent fail — the badge simply won't update this cycle.
    }
  }, []);

  // --- Optimistic UI updates below: state changes instantly, then the API
  // call confirms it. On failure we roll back to the previous snapshot. ---

  const markAsRead = useCallback(async (id) => {
    let wasUnread = false;
    setNotifications((prev) =>
      prev.map((n) => {
        if (n._id === id && !n.read) wasUnread = true;
        return n._id === id ? { ...n, read: true } : n;
      })
    );
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await apiMarkAsRead(id);
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n))
      );
      if (wasUnread) setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    let snapshot;
    setNotifications((prev) => {
      snapshot = prev;
      return prev.map((n) => ({ ...n, read: true }));
    });
    const prevUnread = unreadCount;
    setUnreadCount(0);

    try {
      await apiMarkAllRead();
    } catch (err) {
      setNotifications(snapshot);
      setUnreadCount(prevUnread);
    }
  }, [unreadCount]);

  const remove = useCallback(async (id) => {
    let snapshot;
    let target;
    setNotifications((prev) => {
      snapshot = prev;
      target = prev.find((n) => n._id === id);
      return prev.filter((n) => n._id !== id);
    });
    if (target && !target.read) setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await apiDeleteNotification(id);
    } catch (err) {
      setNotifications(snapshot);
      if (target && !target.read) setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const removeAll = useCallback(async () => {
    let snapshot;
    setNotifications((prev) => {
      snapshot = prev;
      return [];
    });
    const prevUnread = unreadCount;
    setUnreadCount(0);

    try {
      await apiDeleteAllNotifications();
    } catch (err) {
      setNotifications(snapshot);
      setUnreadCount(prevUnread);
    }
  }, [unreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchAll,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    removeAll,
    fetchedOnce,
  };
}