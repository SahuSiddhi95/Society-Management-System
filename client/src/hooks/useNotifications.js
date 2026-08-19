import { useState, useEffect, useCallback, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllRead as apiMarkAllRead,
  deleteNotification as apiDeleteNotification,
  deleteAllNotifications as apiDeleteAllNotifications,
} from "../api/notificationApi";

// Global state variables
let globalNotifications = [];
let globalUnreadCount = 0;
let globalLoading = false;
let globalError = null;
let globalFetchedOnce = false;

// List of listeners (setState setters)
const listeners = new Set();

function emit() {
  for (const listener of listeners) {
    listener({
      notifications: globalNotifications,
      unreadCount: globalUnreadCount,
      loading: globalLoading,
      error: globalError,
    });
  }
}

export default function useNotifications() {
  const [state, setState] = useState({
    notifications: globalNotifications,
    unreadCount: globalUnreadCount,
    loading: globalLoading,
    error: globalError,
  });

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const fetchAll = useCallback(async () => {
    globalLoading = true;
    globalError = null;
    emit();
    try {
      const data = await getNotifications();
      const list = Array.isArray(data) ? data : data?.notifications || data?.data || [];
      const normalized = list.map((n) => ({
        ...n,
        isRead: n.isRead !== undefined ? n.isRead : !!n.read,
        read: n.read !== undefined ? n.read : !!n.isRead,
      }));
      globalNotifications = normalized;
      globalFetchedOnce = true;
      globalUnreadCount = normalized.filter((n) => !n.read && !n.isRead).length;
    } catch (err) {
      globalError = "Couldn't load notifications. Please try again.";
    } finally {
      globalLoading = false;
      emit();
    }
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      globalUnreadCount = data?.count ?? data?.unreadCount ?? 0;
      emit();
    } catch (err) {
      // Silent fail
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    let wasUnread = false;
    globalNotifications = globalNotifications.map((n) => {
      if (n._id === id && !n.read && !n.isRead) wasUnread = true;
      return n._id === id ? { ...n, read: true, isRead: true } : n;
    });
    if (wasUnread) globalUnreadCount = Math.max(0, globalUnreadCount - 1);
    emit();

    try {
      await apiMarkAsRead(id);
    } catch (err) {
      globalNotifications = globalNotifications.map((n) =>
        n._id === id ? { ...n, read: false, isRead: false } : n
      );
      if (wasUnread) globalUnreadCount += 1;
      emit();
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const snapshot = globalNotifications;
    globalNotifications = globalNotifications.map((n) => ({ ...n, read: true, isRead: true }));
    const prevUnread = globalUnreadCount;
    globalUnreadCount = 0;
    emit();

    try {
      await apiMarkAllRead();
    } catch (err) {
      globalNotifications = snapshot;
      globalUnreadCount = prevUnread;
      emit();
    }
  }, []);

  const remove = useCallback(async (id) => {
    const snapshot = globalNotifications;
    const target = globalNotifications.find((n) => n._id === id);
    globalNotifications = globalNotifications.filter((n) => n._id !== id);
    if (target && !target.read && !target.isRead) globalUnreadCount = Math.max(0, globalUnreadCount - 1);
    emit();

    try {
      await apiDeleteNotification(id);
    } catch (err) {
      globalNotifications = snapshot;
      if (target && !target.read && !target.isRead) globalUnreadCount += 1;
      emit();
    }
  }, []);

  const removeAll = useCallback(async () => {
    const snapshot = globalNotifications;
    globalNotifications = [];
    const prevUnread = globalUnreadCount;
    globalUnreadCount = 0;
    emit();

    try {
      await apiDeleteAllNotifications();
    } catch (err) {
      globalNotifications = snapshot;
      globalUnreadCount = prevUnread;
      emit();
    }
  }, []);

  const fetchedOnce = useRef(globalFetchedOnce);
  useEffect(() => {
    fetchedOnce.current = globalFetchedOnce;
  }, [state]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    fetchAll,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    removeAll,
    fetchedOnce,
  };
}
