import API from "../../api/axios";
import { useEffect, useState } from "react";

/**
 * MaintenanceDue — fetches and displays the current user's pending maintenance
 * dues from GET /api/maintenance/my-dues (no more hardcoded data).
 */
export default function MaintenanceDue({ setActiveNav }) {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDues = async () => {
      try {
        setLoading(true);
        const res = await API.get("/maintenance/my-dues");
        const list = Array.isArray(res.data) ? res.data : res.data?.dues || [];
        // Only show pending / unpaid dues
        const pending = list.filter(
          (d) => d.status === "Pending" || d.status === "Unpaid" || !d.status
        );
        setDues(pending);
      } catch (err) {
        setError("Could not load dues.");
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  // Calculate total
  const total = dues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  // Next due date from the earliest due
  const nextDue = dues
    .map((d) => d.dueDate)
    .filter(Boolean)
    .sort()
    .at(0);

  const nextDueStr = nextDue
    ? new Date(nextDue).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="col-span-2 relative bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 rounded-3xl p-7 flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
      {/* Decorative pulse glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-400/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600/80">
          Maintenance Due
        </h3>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col gap-3 animate-pulse relative z-10 mt-2">
          <div className="h-10 w-32 rounded-lg bg-orange-200 mt-2" />
          <div className="h-4 w-40 rounded bg-orange-100" />
          <div className="border-t border-orange-200/50 pt-5 space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-28 rounded bg-orange-100" />
                <div className="h-3 w-16 rounded bg-orange-100" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4 relative z-10">
          <p className="text-sm font-medium text-slate-500">{error}</p>
        </div>
      ) : dues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 gap-3 relative z-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            ✅
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">All dues cleared!</p>
            <p className="text-sm text-slate-500 mt-1">No pending maintenance dues.</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col flex-1">
          <p className="text-sm font-medium text-orange-700/70 mb-2">
            {dues[0]?.month
              ? `${dues[0].month} ${dues[0].year || ""}`
              : "Current Period"}
          </p>

          <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">
            {fmt(total)}
          </div>

          {nextDueStr && (
            <p className="text-sm font-medium text-slate-500 mb-6">
              Pay by{" "}
              <strong className="text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-md">{nextDueStr}</strong>
            </p>
          )}

          <div className="border-t border-orange-200/50 pt-5 flex flex-col gap-3 mb-6">
            {dues.slice(0, 4).map((d, i) => (
              <div key={d._id || i} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium truncate max-w-[65%]">
                  {d.description || d.month || `Due #${i + 1}`}
                </span>
                <span className="text-slate-800 font-bold">{fmt(d.amount || 0)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveNav?.("dues")}
            className="mt-auto w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all text-white font-bold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            💳 Pay Now
          </button>
        </div>
      )}
    </div>
  );
}