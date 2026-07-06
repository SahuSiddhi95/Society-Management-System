import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useEventMutations } from "../../hooks/Useeventhooks";
import toast from "../../Toast";

const CATEGORIES = ["Festival", "Meeting", "Sports", "Cultural", "Maintenance", "Kids Activity"];
const STATUSES   = ["Upcoming", "Ongoing", "Completed", "Cancelled"];

const EMPTY = {
  title: "", description: "", date: "", time: "",
  location: "", category: "Festival", status: "Upcoming",
};

/**
 * EventForm
 * @prop {object|null} initialData  - event to edit; null = create mode
 * @prop {function}    onSuccess    - called with saved event after API responds
 * @prop {function}    onCancel     - closes the form
 */
export default function EventForm({ initialData = null, onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const { create, update, loading } = useEventMutations();

  // Populate when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       ?? "",
        description: initialData.description ?? "",
        date:        initialData.date?.slice(0, 10) ?? "",
        time:        initialData.time        ?? "",
        location:    initialData.location    ?? "",
        category:    initialData.category    ?? "Festival",
        status:      initialData.status      ?? "Upcoming",
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = initialData
      ? await update(initialData._id, form)
      : await create(form);

    if (result.success) {
      toast.success(initialData ? "Event updated." : "Event created.");
      // API returns { success, event } on create or the event directly on update
      onSuccess?.(result.data?.event ?? result.data);
    } else {
      toast.error(result.error);
    }
  };

  return (
    // Overlay — uses normal flow min-height so it doesn't collapse in iframes
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-lg border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Event" : "Create New Event"}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">
              Event Title *
            </label>
            <input
              name="title" type="text" required
              value={form.title} onChange={handleChange}
              placeholder="e.g., Independence Day Celebration"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">
              Description
            </label>
            <textarea
              name="description" rows={3}
              value={form.description} onChange={handleChange}
              placeholder="Describe your event..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Date *
              </label>
              <input
                name="date" type="date" required
                value={form.date} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Time + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Time *
              </label>
              <input
                name="time" type="time" required
                value={form.time} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Location *
              </label>
              <input
                name="location" type="text" required
                value={form.location} onChange={handleChange}
                placeholder="e.g., Society Garden"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Status (show only in edit mode) */}
          {initialData && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              {loading ? "Saving…" : initialData ? "Update Event" : "Create Event"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}