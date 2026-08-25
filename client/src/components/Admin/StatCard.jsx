export default function StatCards({ stats, timeRange = "ALL" }) {
  const rangeLabel = timeRange === "ALL" ? "All Time" : timeRange === "THIS_MONTH" ? "This Month" : `Filtered: ${timeRange}`;

  const cards = [
    {
      icon: "🏢",
      iconBg: "bg-purple-100/50 text-purple-600",
      value: stats?.totalFlats || 0,
      label: "Total Flats/Units",
      badge: `${stats?.occupiedFlats || 0} Occupied`,
      badgeColor: "text-purple-700 bg-purple-100",
      bgGradient: "from-purple-50 to-white",
      borderColor: "border-purple-100",
    },
    {
      icon: "👨‍👩‍👧",
      iconBg: "bg-blue-100/50 text-blue-600",
      value: stats?.totalResidents || 0,
      label: "Total Residents",
      badge: `${stats?.vacantFlats || 0} Vacant`,
      badgeColor: "text-blue-700 bg-blue-100",
      bgGradient: "from-blue-50 to-white",
      borderColor: "border-blue-100",
    },
    {
      icon: "💰",
      iconBg: "bg-green-100/50 text-green-600",
      value: `₹${(stats?.maintenanceCollected || 0).toLocaleString("en-IN")}`,
      label: "Maintenance Collected",
      badge: rangeLabel,
      badgeColor: "text-green-700 bg-green-100",
      bgGradient: "from-green-50 to-white",
      borderColor: "border-green-100",
    },
    {
      icon: "💳",
      iconBg: "bg-red-100/50 text-red-600",
      value: `₹${(stats?.pendingPayments || 0).toLocaleString("en-IN")}`,
      label: "Pending Payments",
      badge: `${stats?.defaulters || 0} Defaulters`,
      badgeColor: "text-red-700 bg-red-100",
      bgGradient: "from-red-50 to-white",
      borderColor: "border-red-100",
    },
  ];


  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-sm border ${card.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
        >
          {/* Subtle background glow effect */}
          <div className={`absolute -right-6 -top-6 w-24 h-24 ${card.iconBg} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity`}></div>

          <div className="relative z-10">
            <div
              className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm`}
            >
              {card.icon}
            </div>

            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {card.value}
            </p>

            <p className="text-sm font-medium text-gray-500 mt-1">
              {card.label}
            </p>

            <div className="mt-4 flex items-center">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${card.badgeColor} shadow-sm`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                {card.badge}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}