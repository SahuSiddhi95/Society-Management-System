import { Layers, CheckCircle2, Clock, IndianRupee } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, loading }) => (
  <div className="group bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 ${iconBg} rounded-full blur-3xl opacity-20 -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500`} />
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse mt-2" />
        ) : (
          <h3 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">{value}</h3>
        )}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg} bg-opacity-50 ring-1 ring-white/60 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
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