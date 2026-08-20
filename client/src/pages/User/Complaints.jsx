import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { createComplaint, getMyComplaints } from "../../api/complaintApi";
import { Droplet, Zap, ArrowUpSquare, Wrench, MoreHorizontal, Plus, X, MessageSquareWarning, Clock, CheckCircle2, FileText, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Water", "Electric", "Lift", "Plumber", "Other"];

const CategoryIcon = {
  Water: <Droplet className="w-5 h-5 text-blue-500" />,
  Electric: <Zap className="w-5 h-5 text-amber-500" />,
  Lift: <ArrowUpSquare className="w-5 h-5 text-indigo-500" />,
  Plumber: <Wrench className="w-5 h-5 text-emerald-500" />,
  Other: <MoreHorizontal className="w-5 h-5 text-slate-500" />
};

export default function Complaints() {
  const { fetchDashboardData } = useOutletContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Water",
    description: "",
    image: null,
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getMyComplaints();
      setComplaints(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      await createComplaint(formData);
      await fetchComplaints();
      if (fetchDashboardData) await fetchDashboardData();
      
      toast.success("Complaint raised successfully!");
      setForm({ title: "", category: "Water", description: "", image: null });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  // Stats derived
  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const pending = total - resolved;
    return { total, resolved, pending };
  }, [complaints]);

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        
        {/* Header with Stats Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
                <p className="text-sm text-slate-500 mt-0.5">Track and raise complaints.</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 ${
                showForm 
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-600" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow"
              }`}
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancel" : "New Ticket"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total</span>
              <span className="text-2xl font-black text-slate-800">{loading ? "—" : stats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Pending</span>
              <span className="text-2xl font-black text-amber-600">{loading ? "—" : stats.pending}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Resolved</span>
              <span className="text-2xl font-black text-emerald-600">{loading ? "—" : stats.resolved}</span>
            </div>
          </div>
        </div>

        {/* Inline Form */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showForm ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-white border border-indigo-100 shadow-lg shadow-indigo-100/20 rounded-2xl p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl"></div>
            
            <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Open a Support Ticket
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Issue Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Briefly summarize the issue"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Category <span className="text-rose-500">*</span></label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all bg-slate-50/50 focus:bg-white appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Attach Photo (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full border border-slate-200 border-dashed rounded-xl px-4 py-3 text-sm text-slate-500 bg-slate-50 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{form.image ? form.image.name : "Click to upload image"}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Description <span className="text-rose-500">*</span></label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide all relevant details here..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all bg-slate-50/50 focus:bg-white resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow w-full sm:w-auto"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 px-2">Ticket History</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-slate-400 animate-pulse">Loading tickets...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">No issues found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">You haven't raised any complaints yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {complaints.map((c) => {
                const isResolved = c.status === "resolved";
                
                return (
                  <div key={c._id} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow transition-shadow">
                    
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        {CategoryIcon[c.category] || CategoryIcon.Other}
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border ${
                        isResolved 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {c.status || "Pending"}
                      </span>
                    </div>

                    <div className="mb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] font-bold text-slate-400">{new Date(c.createdAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{c.title}</h4>
                      {c.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{c.description}</p>
                      )}
                    </div>
                    
                    {c.image && (
                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <a href={c.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                          <ImageIcon className="w-3.5 h-3.5" /> View Attachment
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
