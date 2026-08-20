import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2, Edit3 } from "lucide-react";
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

  const inputClasses = "w-full px-4 py-3 rounded-2xl border-2 border-transparent bg-slate-50 text-sm text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none";
  const labelClasses = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl p-8 animate-[scaleUp_0.2s_ease-out_forwards]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 rounded-t-3xl" />
        
        <div className="flex items-center justify-between mb-8 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Edit3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Edit Maintenance</h3>
              <p className="text-sm text-gray-400 mt-0.5">Modify record for {record.resident?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Month</label>
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className={inputClasses}
              >
                {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Year</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClasses}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all duration-300 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;