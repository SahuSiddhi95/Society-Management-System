import Icon from "../../assets/icons";

export default function MyComplaints({ complaints, setActiveNav }) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 lg:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          My Complaints
        </h3>
        <button
          onClick={() => setActiveNav("complaint")}
          className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 hover:underline transition-colors"
        >
          Raise new →
        </button>
      </div>
      <div className="flex flex-col gap-1 -mx-2">
        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
             <div className="text-3xl mb-2 opacity-50">🛠️</div>
             <p className="text-sm">No complaints found</p>
          </div>
        ) : (
          complaints.slice(0, 4).map((c) => (
            <div
              key={c._id}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default"
            >
              <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shrink-0 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
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
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{c.title}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "No Date"}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide shadow-sm uppercase shrink-0 ${
                  c.status?.toLowerCase() === "resolved" ? "bg-green-50 text-green-600 border border-green-100"
                  : c.status?.toLowerCase() === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : "bg-red-50 text-red-500 border border-red-100"
                }`}
              >
                {c.status || "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}