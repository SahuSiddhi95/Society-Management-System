import Icon from "../../assets/icons";
import { useNavigate } from "react-router-dom";

/**
 * PaymentHistoryCard — shows the last 4 real transactions passed from the dashboard.
 * No more PAYMENTS constant with hardcoded data.
 */
export default function PaymentHistoryCard({ setActiveNav, transactions = [] }) {
  const navigate = useNavigate();

  // Format amount in Indian style
  const fmt = (n) =>
    typeof n === "number" ? `₹${n.toLocaleString("en-IN")}` : `₹${n || 0}`;

  const recent = transactions.slice(0, 4);

  const handleViewAll = () => {
    if (typeof setActiveNav === "function") {
      setActiveNav("history");
    } else {
      navigate("/user-dashboard/history");
    }
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Payment History
        </h3>
        <button
          onClick={handleViewAll}
          className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline transition-colors"
        >
          View all →
        </button>
      </div>


      <div className="flex flex-col gap-1 -mx-2">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
             <div className="text-3xl mb-2 opacity-50">📭</div>
             <p className="text-sm">No payment records yet</p>
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
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 shrink-0 group-hover:from-indigo-50 group-hover:to-indigo-100 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <Icon name="home" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {p.description || p.month || "Maintenance"}
                      {p.year ? ` ${p.year}` : ""}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{dateStr}</p>
                  </div>
                </div>
                <div className="text-right pr-2">
                  <span
                    className={`text-sm font-extrabold tracking-tight ${
                      isPaid ? "text-emerald-600" : "text-amber-500"
                    }`}
                  >
                    {fmt(p.amount)}
                  </span>
                  <p className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                    {p.status || "Pending"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}