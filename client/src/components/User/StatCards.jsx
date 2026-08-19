import Icon from "../../assets/icons";

/**
 * Dashboard stat cards — all values come from real API data passed as props.
 * No hardcoded amounts.
 */
export default function StatCards({
  complaints = [],
  setActiveNav,
  recentNotices = [],
  dues = [],          // real maintenance dues from GET /api/maintenance/my-dues
  transactions = [],  // real transactions from GET /api/transactions/my-transactions
}) {
  // Sum pending dues amount
  const pendingDues = dues.filter(
    (d) => d.status === "Pending" || d.status === "Unpaid"
  );
  const pendingAmount = pendingDues.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Sum paid transactions this year
  const currentYear = new Date().getFullYear();
  const paidThisYear = transactions
    .filter((t) => {
      const yr = new Date(t.createdAt || t.date || t.paidAt).getFullYear();
      return yr === currentYear && (t.status === "Paid" || t.status === "Success" || t.status === "paid");
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // Format Indian currency
  const fmt = (n) =>
    n > 0
      ? `₹${n.toLocaleString("en-IN")}`
      : "₹0";

  const cards = [
    {
      icon: "pending",
      iconBg: "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700",
      cardBg: "bg-white",
      val: fmt(pendingAmount),
      label: "Due This Month",
      chip: pendingDues.length > 0 ? `${pendingDues.length} Pending` : "All Clear",
      chipCls:
        pendingDues.length > 0
          ? "bg-red-50 text-red-600 border border-red-100"
          : "bg-green-50 text-green-600 border border-green-100",
      nav: "dues",
    },
    {
      icon: "paid",
      iconBg: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700",
      cardBg: "bg-white",
      val: fmt(paidThisYear),
      label: "Paid This Year",
      chip: "On time",
      chipCls: "bg-green-50 text-green-600 border border-green-100",
      nav: "history",
    },
    {
      icon: "complaint",
      iconBg: "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700",
      cardBg: "bg-white",
      val: complaints.length,
      label: "Open Complaints",
      chip:
        complaints.length > 0
          ? `${complaints.length} Open`
          : "No complaints",
      chipCls:
        complaints.length > 0
          ? "bg-amber-50 text-amber-600 border border-amber-100"
          : "bg-green-50 text-green-600 border border-green-100",
      nav: "complaint",
    },
    {
      icon: "notice",
      iconBg: "bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700",
      cardBg: "bg-white",
      val: recentNotices?.length || 0,
      label: "Recent Notices",
      chip:
        recentNotices?.length > 0
          ? `${recentNotices.length} New`
          : "No Notices",
      chipCls:
        recentNotices?.length > 0
          ? "bg-blue-50 text-blue-600 border border-blue-100"
          : "bg-slate-50 text-slate-500 border border-slate-100",
      nav: "notices",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((s, i) => (
        <button
          key={i}
          onClick={() => setActiveNav(s.nav)}
          className={`relative overflow-hidden ${s.cardBg} border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200/60 transition-all duration-300 text-left group`}
        >
          {/* Subtle background glow effect on hover */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div
            className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            <Icon name={s.icon} />
          </div>
          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {s.val}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">{s.label}</div>
          </div>
          <span
            className={`relative z-10 self-start text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${s.chipCls}`}
          >
            {s.chip}
          </span>
        </button>
      ))}
    </div>
  );
}