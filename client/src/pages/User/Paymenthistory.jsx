import { useState, useEffect } from "react";
import Sidebar from "../../components/User/Sidebar";
import Icon from "../../assets/icons";

const CategoryBadge = {
  Maintenance: "bg-indigo-50 text-indigo-600",
  Event: "bg-purple-50 text-purple-600",
};

// ─── helpers ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount) {
  if (amount == null) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// Derive a friendly category from the transaction description / method
function deriveCategory(txn) {
  const desc = (txn.description || "").toLowerCase();
  if (desc.includes("event") || desc.includes("festival") || desc.includes("holi") || desc.includes("new year"))
    return "Event";
  return "Maintenance";
}

// Pick an icon name that matches the category
function deriveIcon(txn) {
  return deriveCategory(txn) === "Event" ? "party" : "home";
}

// ─── component ──────────────────────────────────────────────
export default function PaymentHistory({
  activeNav,
  setActiveNav,
  user,
  complaints,
  fetchDashboardData,
  recentNotices,
}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── fetch transactions on mount ──────────────────────────
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // adjust key if needed
        const res = await fetch("http://localhost:3001/api/transactions/my-transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Request failed (${res.status})`);
        }

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ── derived summary stats ────────────────────────────────
  const totalPaid = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const lastTxn = transactions[0] ?? null;

  // ── download handler ─────────────────────────────────────
  const handleDownload = () => {
    if (!transactions.length) {
      alert("No transactions to download.");
      return;
    }

    const rows = [
      ["Description", "Transaction ID", "Category", "Date", "Amount", "Status"],
      ...transactions.map((t) => [
        t.description ?? "—",
        t.transactionId ?? "—",
        deriveCategory(t),
        formatDate(t.createdAt),
        t.amount ?? 0,
        t.status ?? "—",
      ]),
    ];

    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── render ───────────────────────────────────────────────
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
            <h1 className="text-lg font-bold text-slate-800">Payment History</h1>
            <p className="text-xs text-slate-400 mt-0.5">All your past transactions</p>
          </div>
          <button
            onClick={handleDownload}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl transition-all"
          >
            ⬇️ Download Statement
          </button>
        </header>

        <main className="p-8 flex flex-col gap-6">
          {/* ── Summary cards ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Total Paid
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : formatAmount(totalPaid)}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">All time</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Transactions
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : transactions.length}
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">All successful</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Last Payment
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : lastTxn ? formatAmount(lastTxn.amount) : "N/A"}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {loading ? "" : lastTxn ? formatDate(lastTxn.createdAt) : "No payments yet"}
              </p>
            </div>
          </div>

          {/* ── Transactions table ── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                All Transactions
              </h3>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-5 px-6 py-2 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="col-span-2">Description</span>
              <span>Category</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-5 items-center px-6 py-4 animate-pulse">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-200" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-32 bg-slate-200 rounded" />
                        <div className="h-2.5 w-24 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-20 bg-slate-100 rounded-full" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded ml-auto" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm font-semibold text-slate-700">Failed to load transactions</p>
                <p className="text-xs text-slate-400 max-w-xs">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-3xl">🧾</span>
                <p className="text-sm font-semibold text-slate-700">No transactions yet</p>
                <p className="text-xs text-slate-400">Your payment history will appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100">
                {transactions.map((txn) => {
                  const category = deriveCategory(txn);
                  const icon = deriveIcon(txn);

                  return (
                    <div
                      key={txn._id}
                      className="grid grid-cols-5 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
                    >
                      {/* Description */}
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                          <Icon name={icon} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {txn.description || "Payment"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            {txn.transactionId}
                          </p>
                        </div>
                      </div>

                      {/* Category */}
                      <span
                        className={`self-center text-[10px] font-bold px-2.5 py-1 rounded-full w-fit uppercase tracking-wide ${
                          CategoryBadge[category] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {category}
                      </span>

                      {/* Date */}
                      <span className="text-sm text-slate-500">
                        {formatDate(txn.createdAt)}
                      </span>

                      {/* Amount */}
                      <span className="text-sm font-bold text-green-600 text-right">
                        {formatAmount(txn.amount)}
                      </span>
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