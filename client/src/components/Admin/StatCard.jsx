export default function StatCards({ stats, setActive }) {
  const cards = [
    {
      icon: "🏢",
      iconBg: "bg-purple-50",
      value: stats.totalFlats,
      label: "Total Flats/Units",
      badge: `${stats.occupiedFlats} Occupied`,
      badgeColor: "text-purple-600 bg-purple-50",
    },
    {
      icon: "👨‍👩‍👧",
      iconBg: "bg-blue-50",
      value: stats.totalResidents,
      label: "Total Residents",
      badge: `${stats.vacantFlats} Vacant`,
      badgeColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: "💰",
      iconBg: "bg-green-50",
      value: stats.maintenanceCollected || "₹0",
      label: "Maintenance Collected",
      badge: "This Month",
      badgeColor: "text-green-600 bg-green-50",
    },
    {
      icon: "💳",
      iconBg: "bg-red-50",
      value: stats.pendingPayments || "₹0",
      label: "Pending Payments",
      badge: `${stats.defaulters || 0} Defaulters`,
      badgeColor: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div
            className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center text-xl mb-4`}
          >
            {card.icon}
          </div>

          <p className="text-2xl font-bold text-gray-900">
            {card.value}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {card.label}
          </p>

          <span
            className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mt-3 ${card.badgeColor}`}
          >
            {card.badge}
          </span>
        </div>
      ))}
    </div>
  );
}