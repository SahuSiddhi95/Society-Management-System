import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Sparkles, Send } from "lucide-react";
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
  residentId: "All",
  month: MONTHS[new Date().getMonth()],
  year: currentYear,
  amount: "",
  dueDate: "",
  category: "Maintenance",
  description: "",
};

const GenerateMaintenanceForm = ({ onGenerated, users = [] }) => {
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
      const response = await API.post("/maintenance/generate-dues", {
        residentId: form.residentId,
        amount: Number(form.amount),
        month: form.month,
        year: Number(form.year),
        dueDate: form.dueDate,
        category: form.category,
        description: form.description,
      });
      const { total, emailsSent, smsSent, inAppSent } = response.data;
      if (total === 0) {
        toast.error("Maintenance already exists for the selected resident(s) in this month/category.");
      } else {
        toast.success(
          `Generated ${total} dues. Sent ${emailsSent} emails, ${smsSent} SMS, ${inAppSent} in-app alerts.`,
          { duration: 5000 }
        );
      }
      setForm((prev) => ({ ...initialForm, month: prev.month, category: prev.category, residentId: prev.residentId }));
      onGenerated?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate dues");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-2xl border-2 border-transparent bg-slate-50 text-sm text-gray-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none";
  const labelClasses = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Generate Charges</h2>
          <p className="text-sm text-gray-400 mt-0.5">Create custom or mass dues for your residents</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClasses}>Target Resident</label>
            <select
              name="residentId"
              value={form.residentId}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="All">Everyone (Mass Generate)</option>
              {users.filter(u => u.role !== "admin").map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} (Flat {u.flatNo || u.flatNumber || "N/A"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>Month</label>
            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              className={inputClasses}
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
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

          <div>
            <label className={labelClasses}>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              placeholder="e.g. 2500"
              value={form.amount}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClasses}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
          
          <div className="sm:col-span-2 lg:col-span-2">
            <label className={labelClasses}>Description</label>
            <input
              type="text"
              name="description"
              placeholder="E.g. Late penalty fee or event contribution..."
              value={form.description}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={loading}
            className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
            {loading ? "Generating..." : form.residentId === "All" ? "Generate For Everyone" : "Generate Custom Charge"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerateMaintenanceForm;