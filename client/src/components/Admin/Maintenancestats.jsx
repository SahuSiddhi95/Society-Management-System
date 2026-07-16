import { Layers, CheckCircle2, Clock, IndianRupee } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, loading }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse mt-2" />
        ) : (
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const MaintenanceStats = ({ maintenance, loading }) => {
  const total = maintenance.length;
  const paid = maintenance.filter((m) => m.status === "Paid").length;
  const pending = maintenance.filter((m) => m.status !== "Paid").length;
  const revenue = maintenance
    .filter((m) => m.status === "Paid")
    .reduce((sum, m) => sum + Number(m.amount || 0), 0);

  const cards = [
    {
      title: "Total Generated",
      value: total,
      icon: Layers,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Paid",
      value: paid,
      icon: CheckCircle2,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} loading={loading} />
      ))}
    </div>
  );
};

export default MaintenanceStats;