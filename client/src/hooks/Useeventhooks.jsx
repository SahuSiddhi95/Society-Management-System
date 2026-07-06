import { useState, useEffect, useCallback } from "react";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  updateEventStatus,
  getEventStats,
} from "../api/Admin/Eventapi";

// ── useEvents: fetch all events ────────────────────────────────────────────
export function useEvents() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { events, setEvents, loading, error, refetch: fetch };
}

// ── useEvent: fetch single event by id ────────────────────────────────────
export function useEvent(id) {
  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getEventById(id)
      .then(setEvent)
      .catch((err) => setError(err.response?.data?.message || "Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  return { event, loading, error };
}

// ── useEventsByCategory ────────────────────────────────────────────────────
export function useEventsByCategory(category) {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!category || category === "All") return;
    setLoading(true);
    setError(null);
    getEventsByCategory(category)
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load events"))
      .finally(() => setLoading(false));
  }, [category]);

  return { events, loading, error };
}

// ── useEventStats ──────────────────────────────────────────────────────────
export function useEventStats() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await getEventStats());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}

// ── useEventMutations: create / update / delete / status ──────────────────
export function useEventMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn();
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create:       (body)         => run(() => createEvent(body)),
    update:       (id, body)     => run(() => updateEvent(id, body)),
    remove:       (id)           => run(() => deleteEvent(id)),
    changeStatus: (id, status)   => run(() => updateEventStatus(id, status)),
  };
}