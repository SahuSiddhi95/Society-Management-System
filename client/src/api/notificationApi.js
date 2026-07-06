// Notification API layer.
// Keep all notification network calls here — components never call axios directly.
import API from "./axios";

export const getNotifications = async () => {
  const res = await API.get("/notifications/");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await API.get("/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllRead = async () => {
  const res = await API.put("/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};

export const deleteAllNotifications = async () => {
  const res = await API.delete("/notifications");
  return res.data;
};