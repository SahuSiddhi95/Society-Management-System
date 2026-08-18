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
    <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
        Maintenance Due
      </h3>

      {loading ? (
        <div className="flex-1 flex flex-col gap-3 animate-pulse">
          <div className="h-8 w-24 rounded bg-amber-200 mt-2" />
          <div className="h-3 w-32 rounded bg-amber-100" />
          <div className="border-t border-amber-200 pt-4 space-y-2 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-24 rounded bg-amber-100" />
                <div className="h-3 w-12 rounded bg-amber-100" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      ) : dues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 gap-2">
          <div className="text-3xl">✅</div>
          <p className="text-sm font-semibold text-slate-700">All dues cleared!</p>
          <p className="text-xs text-slate-400">No pending maintenance dues.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            {dues[0]?.month
              ? `${dues[0].month} ${dues[0].year || ""}`
              : "Current Period"}
          </p>

          <div className="text-4xl font-bold text-slate-800 mb-1">
            {fmt(total)}
          </div>

          {nextDueStr && (
            <p className="text-xs text-slate-500 mb-4">
              Due by{" "}
              <strong className="text-amber-600">{nextDueStr}</strong>
            </p>
          )}

          <div className="border-t border-amber-200 pt-4 flex flex-col gap-2 mb-5">
            {dues.slice(0, 4).map((d, i) => (
              <div key={d._id || i} className="flex justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[60%]">
                  {d.description || d.month || `Due #${i + 1}`}
                </span>
                <span className="text-slate-700 font-semibold">{fmt(d.amount || 0)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveNav?.("dues")}
            className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-medium text-sm rounded-xl py-2.5 flex items-center justify-center gap-2"
          >
            💳 Pay Now
          </button>
        </>
      )}
    </div>
  );
}