// pages/User/Complaints.jsx

import { useState, useEffect } from "react";

import Icon from "../../assets/icons";
import Sidebar from "../../components/User/Sidebar";

import { createComplaint, getMyComplaints } from "../../api/complaintApi";

const CATEGORIES = ["Water", "Electric", "Lift", "Plumber", "Other"];

export default function Complaints({
  activeNav,
  setActiveNav,
  user,
  complaints: dashboardComplaints = [],
  fetchDashboardData,
  recentNotices = [],
}) {
  // States
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  // Form State
  const [form, setForm] = useState({
    title: "",
    category: "Water",
    description: "",
    image: null,
  });
  // =========================
  // FETCH COMPLAINTS
  // =========================
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
  // Load Complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  // =========================
  // SUBMIT COMPLAINT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.title || !form.description) return;

    try {
      setSubmitting(true);

      // FormData
      const formData = new FormData();

      formData.append("title", form.title);

      formData.append("category", form.category);

      formData.append("description", form.description);

      // Image
      if (form.image) {
        formData.append("image", form.image);
      }

      // API
      await createComplaint(formData);

      // Refresh Complaints
      await fetchComplaints();

      // Refresh Dashboard
      if (fetchDashboardData) {
        await fetchDashboardData();
      }

      // Success
      setSuccessMsg("Complaint raised successfully!");

      // Reset Form
      setForm({
        title: "",
        category: "Water",
        description: "",
        image: null,
      });

      // Close Form
      setShowForm(false);

      // Remove Success
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // CATEGORY ICON
  // =========================
  const iconForCategory = (cat) => {
    if (cat === "Water") return "water";

    if (cat === "Electric") return "electric";

    if (cat === "Lift") return "lift";

    if (cat === "Plumber") return "plumber";

    return "complaint";
  };
  const statusCounts = complaints.reduce((acc, complaint) => {
    const status = complaint.status || "Pending";

    acc[status] = (acc[status] || 0) + 1;

    return acc;
  }, {});
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar
      
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={dashboardComplaints}
        fetchDashboardData={fetchDashboardData}
        recentNotices={recentNotices}
      />

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800">My Complaints</h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Track and raise complaints
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95"
          >
            + Raise Complaint
          </button>
        </header>

        {/* Content */}
        <main className="p-8 flex flex-col gap-6">
          {/* Success Message */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-5 py-3 rounded-xl">
              ✅ {successMsg}
            </div>
          )}

          {/* Complaint Form */}
          {showForm && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800">
                  Raise New Complaint
                </h3>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2">
                  <label className="text-xs text-slate-500 font-medium mb-1 block">
                    Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Water leakage in bathroom"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">
                    Attach Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.files[0],
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-xs text-slate-500 font-medium mb-1 block">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Describe issue..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    {submitting ? "Submitting..." : "Submit Complaint"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Complaint List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                All Complaints ({complaints.length})
              </h3>

              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <span
                    key={status}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status.toLowerCase() === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {status} ({count})
                  </span>
                ))}
              </div>
            </div>
            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : complaints.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>

                <p className="text-sm text-slate-500 font-medium">
                  No complaints raised yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {complaints.map((c, i) => (
                  <div
                    key={c._id}
                    className={`flex items-start gap-4 py-4 ${
                      i < complaints.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      <Icon name={iconForCategory(c.category)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-800">
                          {c.title}
                        </p>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                          {c.category}
                        </span>
                      </div>

                      {c.description && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.description}
                        </p>
                      )}

                      <p className="text-xs text-slate-400 mt-1">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN")
                          : "No Date"}
                      </p>

                      {/* Image */}
                      {c.image && (
                        <img
                          src={`http://localhost:3001/${c.image}`}
                          alt="complaint"
                          className="w-20 h-20 object-cover rounded-xl mt-2 border border-slate-100"
                        />
                      )}
                    </div>

                    {/* Status */}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                        c.status === "resolved"
                          ? "bg-green-50 text-green-600"
                          : c.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-500"
                      }`}
                    >
                      {c.status || "Open"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
