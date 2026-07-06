import { useState, useCallback } from "react";
import { Edit2, Trash2, Eye, Plus } from "lucide-react";
import { useEvents, useEventMutations } from "../../hooks/Useeventhooks";
import { getEventsByCategory } from "../../api/Admin/Eventapi";
import EventForm  from "./Eventform";
import toast from "../../Toast";
import BackButton from "../../components/Backbutton ";
const CATEGORIES = ["All", "Festival", "Meeting", "Sports", "Cultural", "Maintenance", "Kids Activity"];
const STATUSES   = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const STATUS_COLORS = {
  Upcoming:  "bg-blue-50 text-blue-700 border border-blue-200",
  Ongoing:   "bg-green-50 text-green-700 border border-green-200",
  Completed: "bg-gray-50 text-gray-700 border border-gray-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function EventManagement() {
  const { events, setEvents, loading, refetch } = useEvents();
  const { remove, changeStatus, loading: mutating } = useEventMutations();

  const [showForm, setShowForm]       = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeCategory, setCategory]  = useState("All");
  const [catLoading, setCatLoading]    = useState(false);

  // ── Category filter (calls real API) ──────────────────────────────────
  const handleCategoryChange = useCallback(async (cat) => {
    setCategory(cat);
    setFilterStatus("All");

    if (cat === "All") {
      refetch();
      return;
    }

    setCatLoading(true);
    try {
      const data = await getEventsByCategory(cat);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to filter by category");
    } finally {
      setCatLoading(false);
    }
  }, [refetch, setEvents]);

  // ── Client-side status filter ──────────────────────────────────────────
  const displayed = filterStatus === "All"
    ? events
    : events.filter((e) => e.status === filterStatus);

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    const result = await remove(event._id);
    if (result.success) {
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
      toast.success("Event deleted.");
    } else {
      toast.error(result.error);
    }
  };

  // ── Inline status change (optimistic) ─────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    setEvents((prev) =>
      prev.map((e) => e._id === id ? { ...e, status: newStatus } : e)
    );
    const result = await changeStatus(id, newStatus);
    if (result.success) {
      setEvents((prev) =>
        prev.map((e) => e._id === id ? result.data : e)
      );
      toast.success(`Status set to ${newStatus}.`);
    } else {
      // Rollback
      refetch();
      toast.error(result.error);
    }
  };

  // ── Form success ───────────────────────────────────────────────────────
  const handleFormSuccess = (saved) => {
    if (editingEvent) {
      // Update in-place
      setEvents((prev) =>
        prev.map((e) => e._id === saved._id ? saved : e)
      );
    } else {
      // Prepend new event
      setEvents((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setEditingEvent(null);
  };

  const openCreate = () => { setEditingEvent(null); setShowForm(true); };
  const openEdit   = (event) => { setEditingEvent(event); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditingEvent(null); };

  const isLoading = loading || catLoading;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <BackButton/>
      <div className="border-b border-slate-200 sticky top-0 z-30 bg-white ">
        <div className="max-w-6xl mx-auto px-6 py-5 ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Events</h1>
              <p className="text-sm text-slate-600 mt-1">Manage your organization's events</p>
            </div>
            <button
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Plus size={18} />
              Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Stats ───────────────────────────────────────────────────── */}
        

        {/* ── Category filter ─────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              disabled={catLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Status filter tabs ───────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["All", ...STATUSES].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filterStatus === status
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* ── Events Table ────────────────────────────────────────────── */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-1/3">Event</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-1/6">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-1/6">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-1/6">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  /* Skeleton rows */
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: j === 0 ? "80%" : "60%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : displayed.length > 0 ? (
                  displayed.map((event, idx) => (
                    <tr key={event._id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 text-sm">{event.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{event.location}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={event.status}
                          onChange={(e) => handleStatusChange(event._id, e.target.value)}
                          disabled={mutating}
                          className={`text-xs font-medium px-2.5 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${STATUS_COLORS[event.status] || STATUS_COLORS.Upcoming}`}
                        >
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(event)}
                            title="Edit event"
                            className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(event)}
                            disabled={mutating}
                            title="Delete event"
                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            title="View event details"
                            className="text-slate-500 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <p className="text-slate-600 font-medium text-sm">No events found</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {activeCategory !== "All"
                          ? `No events in the "${activeCategory}" category`
                          : "Try creating a new event or adjusting your filters"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Create / Edit Form Modal ─────────────────────────────────────── */}
      {showForm && (
        <EventForm
          initialData={editingEvent}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}