import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import Icon from "../../assets/icons";
import API from "../../api/axios";

const CategoryBadge = {
  Maintenance: "bg-indigo-50 text-indigo-600",
  Event: "bg-purple-50 text-purple-600",
};

// Transaction.status is "Success" | "Failed" | "paid" | "failed"
const StatusBadge = {
  Success: "bg-green-50 text-green-600",
  Paid: "bg-green-50 text-green-600",
  paid: "bg-green-50 text-green-600",
  Failed: "bg-red-50 text-red-600",
  failed: "bg-red-50 text-red-600",
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
export default function PaymentHistory() {
  const { fetchDashboardData, transactions: propTransactions = [] } = useOutletContext();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── fetch transactions ───────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/transactions/my-transactions");
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ── derived summary stats ────────────────────────────────
  const successfulTxns = transactions.filter(
    (t) => t.status === "Success" || t.status === "paid" || t.status === "Paid"
  );
  const totalPaid = successfulTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const lastTxn = transactions[0] ?? null;

  // ── download handler ─────────────────────────────────────
  const handleDownload = () => {
    if (!transactions.length) {
      toast.error("No transactions to download.");
      return;
    }

    const rows = [
      ["Description", "Transaction ID", "Category", "Date", "Amount", "Status", "Method"],
      ...transactions.map((t) => [
        t.description ?? "—",
        t.transactionId ?? "—",
        deriveCategory(t),
        formatDate(t.createdAt),
        t.amount ?? 0,
        t.status ?? "—",
        t.method ?? "—",
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
    toast.success("Statement downloaded");
  };

  // ── render ───────────────────────────────────────────────
  return (
    <>
        <div className="flex flex-col gap-4 sm:gap-6 pb-10">
          {/* ── Summary cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-xs text-indigo-600 font-medium mt-1">
                {loading ? "" : `${successfulTxns.length} successful`}
              </p>
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
            
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">

            {/* Header row */}
            <div className="grid grid-cols-7 px-6 py-2 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="col-span-2">Description</span>
              <span>Category</span>
              <span>Date</span>
              <span>Method</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-7 items-center px-6 py-4 animate-pulse">
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-200" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-3 w-32 bg-slate-200 rounded" />
                        <div className="h-2.5 w-24 bg-slate-100 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-20 bg-slate-100 rounded-full" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
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
                  onClick={fetchTransactions}
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
                      className="grid grid-cols-7 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
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
                        className={`self-center text-[10px] font-bold px-2.5 py-1 rounded-full w-fit uppercase tracking-wide ${CategoryBadge[category] || "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {category}
                      </span>

                      {/* Date */}
                      <span className="text-sm text-slate-500">
                        {formatDate(txn.createdAt)}
                      </span>

                      {/* Method */}
                      <span className="text-sm text-slate-500">{txn.method || "—"}</span>

                      {/* Status */}
                      <span
                        className={`self-center text-[10px] font-bold px-2.5 py-1 rounded-full w-fit uppercase tracking-wide ${StatusBadge[txn.status] || "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {txn.status}
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
            </div>
          </div>
        </div>
    </>
  );
}