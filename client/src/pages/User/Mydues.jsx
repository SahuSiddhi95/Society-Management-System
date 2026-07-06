import { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/User/Sidebar";

// ─── helpers ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDueDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function authHeaders() {
  const token = localStorage.getItem("token"); // adjust key if needed
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ─── component ──────────────────────────────────────────────
export default function MyDues({
  activeNav,
  setActiveNav,
  user,
  complaints,
  fetchDashboardData,
  recentNotices,
}) {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null); // tracks which due is being paid
  const [payError, setPayError] = useState(null);

  // ── fetch dues ───────────────────────────────────────────
  const fetchDues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/maintenance/my-dues", {
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setDues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDues();
  }, [fetchDues]);

  // ── pay a due ────────────────────────────────────────────
  const handlePay = async (maintenanceId) => {
    setPayingId(maintenanceId);
    setPayError(null);
    try {
      const res = await fetch("http://localhost:3001/api/transactions/pay", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ maintenanceId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Payment failed (${res.status})`);
      }
      // Refresh dues so UI reflects the new "paid" status
      await fetchDues();
      if (fetchDashboardData) fetchDashboardData();
    } catch (err) {
      setPayError(err.message);
    } finally {
      setPayingId(null);
    }
  };

  // ── derived stats ────────────────────────────────────────
  const unpaid = dues.filter((d) => d.status === "unpaid");
  const paid = dues.filter((d) => d.status === "paid");
  const totalUnpaid = unpaid.reduce((s, d) => s + (d.amount || 0), 0);
  const totalPaid = paid.reduce((s, d) => s + (d.amount || 0), 0);
  const monthlyDue = dues[0]?.amount ?? 0;

  // ── skeleton row ─────────────────────────────────────────
  const SkeletonRow = () => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-40 bg-slate-200 rounded" />
          <div className="h-2.5 w-28 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={complaints}
        fetchDashboardData={fetchDashboardData}
        recentNotices={recentNotices}
      />

      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* ── Topbar ── */}
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800">My Dues</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Maintenance and payment overview
            </p>
          </div>
        </header>

        <main className="p-8 flex flex-col gap-6">
          {/* ── Pay error toast ── */}
          {payError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <p className="text-sm text-red-600 font-medium">⚠️ {payError}</p>
              <button
                onClick={() => setPayError(null)}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Pending Dues
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : `₹${totalUnpaid.toLocaleString("en-IN")}`}
              </p>
              <p className="text-xs text-amber-600 font-medium mt-1">
                {loading ? "" : `${unpaid.length} month${unpaid.length !== 1 ? "s" : ""} unpaid`}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Paid This Year
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : `₹${totalPaid.toLocaleString("en-IN")}`}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {loading ? "" : `${paid.length} months paid`}
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Monthly Due
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : monthlyDue ? `₹${monthlyDue.toLocaleString("en-IN")}` : "—"}
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                Due on last day of month
              </p>
            </div>
          </div>

          {/* ── Unpaid banner (first unpaid due) ── */}
          {!loading && !error && unpaid.length > 0 && (
            <div className="bg-white border border-amber-300 rounded-2xl p-6 flex items-center justify-between gap-6 shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500 text-xl">⚠️</span>
                  <h3 className="text-sm font-bold text-slate-800">
                    {unpaid[0].month} — Payment Pending
                  </h3>
                </div>

                {/* Breakdown — render only if present */}
                {unpaid[0].breakdown?.length > 0 && (
                  <div className="flex gap-6 mb-4">
                    {unpaid[0].breakdown.map((b) => (
                      <div key={b.label}>
                        <p className="text-xs text-slate-400">{b.label}</p>
                        <p className="text-sm font-semibold text-slate-700">
                          ₹{b.amt.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  Due by{" "}
                  <strong className="text-amber-600">
                    {formatDueDate(unpaid[0].dueDate)}
                  </strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-slate-800 mb-3">
                  ₹{(unpaid[0].amount || 0).toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => handlePay(unpaid[0]._id)}
                  disabled={payingId === unpaid[0]._id}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-semibold text-sm rounded-xl px-6 py-2.5"
                >
                  {payingId === unpaid[0]._id ? "Processing…" : "💳 Pay Now"}
                </button>
              </div>
            </div>
          )}

          {/* ── All dues list ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Monthly Due History
            </h3>

            {loading ? (
              <div className="flex flex-col">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm font-semibold text-slate-700">
                  Failed to load dues
                </p>
                <p className="text-xs text-slate-400 max-w-xs">{error}</p>
                <button
                  onClick={fetchDues}
                  className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            ) : dues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-semibold text-slate-700">
                  No dues found
                </p>
                <p className="text-xs text-slate-400">
                  Your maintenance records will appear here once created.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {dues.map((d, i) => {
                  const isPaid = d.status === "paid";
                  const isPaying = payingId === d._id;

                  return (
                    <div
                      key={d._id}
                      className={`flex items-center justify-between py-4 ${
                        i < dues.length - 1 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            isPaid ? "bg-green-50" : "bg-amber-50"
                          }`}
                        >
                          {isPaid ? "✅" : "⏳"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {d.month} Maintenance
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {isPaid
                              ? `Paid on ${formatDate(d.paidAt)}`
                              : `Due by ${formatDueDate(d.dueDate)}`}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">
                          ₹{(d.amount || 0).toLocaleString("en-IN")}
                        </span>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                            isPaid
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </span>

                        {!isPaid && (
                          <button
                            onClick={() => handlePay(d._id)}
                            disabled={isPaying}
                            className="text-indigo-600 text-xs font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPaying ? "Paying…" : "Pay →"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}