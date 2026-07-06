import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Individual API functions ───────────────────────────────────────────────

export const createEvent = (data) =>
  api.post("/events/", data).then((r) => r.data);

export const getAllEvents = () =>
  api.get("/events/").then((r) => r.data);

export const getEventById = (id) =>
  api.get(`/events/${id}`).then((r) => r.data);

export const updateEvent = (id, data) =>
  api.put(`/events/${id}`, data).then((r) => r.data);

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`).then((r) => r.data);

export const getEventsByCategory = (category) =>
  api.get(`/events/category/${category}`).then((r) => r.data);

export const updateEventStatus = (id, status) =>
  api.patch(`/events/status/${id}`, { status }).then((r) => r.data);

export const getEventStats = () =>
  api.get("/events/stats").then((r) => r.data);

export default api;