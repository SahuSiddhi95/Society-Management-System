export default function NotificationCard({ label, value, accent = "indigo" }) {
  const accentText = {
    indigo: "text-indigo-600",
    blue: "text-blue-600",
    green: "text-green-600",
    gray: "text-gray-600",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-3xl font-bold mt-2 ${accentText[accent] || "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}