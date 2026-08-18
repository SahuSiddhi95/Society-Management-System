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
      iconBg: "bg-indigo-50",
      val: fmt(pendingAmount),
      label: "Due This Month",
      chip: pendingDues.length > 0 ? `${pendingDues.length} Pending` : "All Clear",
      chipCls:
        pendingDues.length > 0
          ? "bg-red-50 text-red-500"
          : "bg-green-50 text-green-600",
      nav: "dues",
    },
    {
      icon: "paid",
      iconBg: "bg-green-50",
      val: fmt(paidThisYear),
      label: "Paid This Year",
      chip: "On time",
      chipCls: "bg-green-50 text-green-600",
      nav: "history",
    },
    {
      icon: "complaint",
      iconBg: "bg-amber-50",
      val: complaints.length,
      label: "Open Complaints",
      chip:
        complaints.length > 0
          ? `${complaints.length} Open`
          : "No complaints",
      chipCls:
        complaints.length > 0
          ? "bg-red-50 text-red-500"
          : "bg-green-50 text-green-600",
      nav: "complaint",
    },
    {
      icon: "notice",
      iconBg: "bg-red-50",
      val: recentNotices?.length || 0,
      label: "Recent Notices",
      chip:
        recentNotices?.length > 0
          ? `${recentNotices.length} New`
          : "No Notices",
      chipCls:
        recentNotices?.length > 0
          ? "bg-red-50 text-red-500"
          : "bg-green-50 text-green-600",
      nav: "notices",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <button
          key={i}
          onClick={() => setActiveNav(s.nav)}
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all text-left group"
        >
          <div
            className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}
          >
            <Icon name={s.icon} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-800">
              {s.val}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
          <span
            className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${s.chipCls}`}
          >
            {s.chip}
          </span>
        </button>
      ))}
    </div>
  );
}