import Icon from "../../assets/icons";

export default function MyComplaints({ complaints, setActiveNav }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          My Complaints
        </h3>
        <button
          onClick={() => setActiveNav("complaint")}
          className="text-indigo-600 text-xs font-medium hover:underline"
        >
          Raise new →
        </button>
      </div>
      {complaints.length === 0 ? (
        <p className="text-sm text-slate-400">No complaints found</p>
      ) : (
        complaints.slice(0, 4).map((c, i) => (
          <div
            key={c._id}
            className={`flex items-center gap-3 py-3 ${
              i < Math.min(complaints.length, 4) - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
              <Icon
                name={
                  c.category === "Water"    ? "water"
                  : c.category === "Electric" ? "electric"
                  : c.category === "Lift"     ? "lift"
                  : c.category === "Plumber"  ? "plumber"
                  : "complaint"
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{c.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "No Date"}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                c.status === "Resolved" ? "bg-green-50 text-green-600"
                : c.status === "Pending" ? "bg-yellow-50 text-yellow-600"
                : "bg-red-50 text-red-500"
              }`}
            >
              {c.status || "Pending"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}