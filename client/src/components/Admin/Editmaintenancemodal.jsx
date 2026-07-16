import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";
import API from "../../api/axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORIES = [
  "Maintenance", "Parking", "Water", "Sinking Fund", "Event", "Club House", "Security",
];

const EditMaintenanceModal = ({ record, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    month: "",
    year: "",
    amount: "",
    dueDate: "",
    category: "Maintenance",
    description: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({
        month: record.month || "",
        year: record.year || "",
        amount: record.amount || "",
        dueDate: record.dueDate ? record.dueDate.slice(0, 10) : "",
        category: record.category || "Maintenance",
        description: record.description || "",
        status: record.status || "Pending",
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/maintenance/${record._id}`, {
        ...form,
        amount: Number(form.amount),
        year: Number(form.year),
      });
      toast.success("Maintenance record updated");
      onUpdated?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update record");
    } finally {
      setLoading(false);
    }
  };

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-[fadeIn_0.15s_ease-out]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Edit Maintenance Record</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Month</label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              >
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Year</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm shadow-indigo-200 transition-all duration-200 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;