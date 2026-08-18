import Icon from "../../assets/icons";

/**
 * PaymentHistoryCard — shows the last 4 real transactions passed from the dashboard.
 * No more PAYMENTS constant with hardcoded data.
 */
export default function PaymentHistoryCard({ setActiveNav, transactions = [] }) {
  // Format amount in Indian style
  const fmt = (n) =>
    typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : `₹${n || 0}`;

  const recent = transactions.slice(0, 4);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Payment History
        </h3>
        <button
          onClick={() => setActiveNav("history")}
          className="text-indigo-600 text-xs font-medium hover:underline"
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <div className="text-3xl">📭</div>
          <p className="text-sm text-slate-400">No payment records yet</p>
        </div>
      ) : (
        recent.map((p, i) => {
          const date = p.createdAt || p.date || p.paidAt;
          const dateStr = date
            ? new Date(date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—";

          const isPaid =
            p.status === "Paid" ||
            p.status === "paid" ||
            p.status === "Success" ||
            p.status === "success";

          return (
            <div
              key={p._id || i}
              className={`flex items-center justify-between py-3 ${
                i < recent.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
                  <Icon name="home" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {p.description || p.month || "Maintenance"}
                    {p.year ? ` ${p.year}` : ""}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{dateStr}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-bold ${
                    isPaid ? "text-green-600" : "text-amber-500"
                  }`}
                >
                  {fmt(p.amount)}
                </span>
                <p className={`text-[10px] mt-0.5 font-medium ${isPaid ? "text-green-500" : "text-amber-500"}`}>
                  {p.status || "Pending"}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}