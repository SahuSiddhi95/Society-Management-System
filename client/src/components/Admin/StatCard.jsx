const stats = [
  { icon: "🏢", iconBg: "bg-purple-50", value: "120",       label: "Total Flats/Units",       badge: "98 occupied",     badgeColor: "text-purple-600 bg-purple-50" },
  { icon: "🎫", iconBg: "bg-yellow-50", value: "8",         label: "Pending Complaints",       badge: "3 urgent",        badgeColor: "text-orange-500 bg-orange-50" },
  { icon: "💰", iconBg: "bg-green-50",  value: "₹4,25,000", label: "Maintenance Collected",    badge: "This month",      badgeColor: "text-green-600 bg-green-50" },
  { icon: "💳", iconBg: "bg-red-50",    value: "₹58,000",   label: "Pending Payments",         badge: "15 defaulters",   badgeColor: "text-red-500 bg-red-50" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}>
            {s.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-3 ${s.badgeColor}`}>
            {s.badge}
          </span>
        </div>
      ))}
    </div>
  );
}