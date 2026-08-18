// Notification API layer.
// All notification network calls live here — components never call axios directly.
import API from "./axios";

// Get all notifications for the logged-in user
export const getNotifications = async () => {
  const res = await API.get("/notifications/");
  return res.data;
};

// Get unread notification count (used by the bell badge)
export const getUnreadCount = async () => {
  const res = await API.get("/notifications/unread-count");
  return res.data;
};

// Mark a single notification as read
export const markAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

// Mark all notifications as read
export const markAllRead = async () => {
  const res = await API.put("/notifications/read-all");
  return res.data;
};

// Delete a single notification by ID
export const deleteNotification = async (id) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};

// Delete ALL notifications for the current user
export const deleteAllNotifications = async () => {
  const res = await API.delete("/notifications/");
  return res.data;
};