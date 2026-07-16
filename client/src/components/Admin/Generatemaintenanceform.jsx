    import  { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Sparkles } from "lucide-react";
import API from "../../api/axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CATEGORIES = [
  "Maintenance", "Parking", "Water", "Sinking Fund", "Event", "Club House", "Security",
];

const currentYear = new Date().getFullYear();

const initialForm = {
  month: MONTHS[new Date().getMonth()],
  year: currentYear,
  amount: "",
  dueDate: "",
  category: "Maintenance",
  description: "",
};

const GenerateMaintenanceForm = ({ onGenerated }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.dueDate) {
      toast.error("Please fill in amount and due date");
      return;
    }

    setLoading(true);
    try {
      await API.post("/maintenance/generate-dues", {
        amount: Number(form.amount),
        month: form.month,
        year: Number(form.year),
        dueDate: form.dueDate,
        category: form.category,
        description: form.description,
      });
      toast.success("Maintenance dues generated for all residents");
      setForm((prev) => ({ ...initialForm, month: prev.month, category: prev.category }));
      onGenerated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate dues");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Generate Monthly Maintenance</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Month</label>
            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Year</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              placeholder="e.g. 2500"
              value={form.amount}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full sm:w-1/2 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Description</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Add any additional details about this maintenance cycle..."
            value={form.description}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm shadow-indigo-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Generating..." : "Generate For All Residents"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateMaintenanceForm;