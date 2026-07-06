import Icon from "../../assets/icons";

export default function StatCards({ complaints, setActiveNav ,recentNotices}) {
  const cards = [
    {
      icon: "pending",  iconBg: "bg-indigo-50",
      val: "₹3,500",   label: "Due This Month",
      chip: "Pending",  chipCls: "bg-red-50 text-red-500",
      nav: "dues",
    },
    {
      icon: "paid",     iconBg: "bg-green-50",
      val: "₹42,000",  label: "Paid This Year",
      chip: "On time",  chipCls: "bg-green-50 text-green-600",
      nav: "history",
    },
    { 
      icon: "complaint",
      iconBg: "bg-amber-50",
      val: complaints.length,
      label: "Open Complaints",
      chip: complaints.length > 0 ? `${complaints.length} Open` : "No complaints",
      chipCls: complaints.length > 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600",
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
    <div className="grid grid-cols-4 gap-4">
      {cards.map((s, i) => (
        <button
          key={i}
          onClick={() => setActiveNav(s.nav)}
          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 transition-all text-left"
        >
          <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center text-xl`}>
            <Icon name={s.icon} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{s.val}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
          <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${s.chipCls}`}>
            {s.chip}
          </span>
        </button>
      ))}
    </div>
  );
}