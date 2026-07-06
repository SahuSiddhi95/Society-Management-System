export default function MaintenanceDue() {
  return (
    <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
        Maintenance Due
      </h3>
      <p className="text-xs text-slate-400 mb-3">May 2026</p>
      <div className="text-4xl font-bold text-slate-800 mb-1">₹3,500</div>
      <p className="text-xs text-slate-500 mb-4">
        Due by <strong className="text-amber-600">31 May 2026</strong>
      </p>
      <div className="border-t border-amber-200 pt-4 flex flex-col gap-2 mb-5">
        {[
          ["Maintenance", "₹2,500"],
          ["Sinking Fund", "₹500"],
          ["Parking",      "₹500"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-slate-400">{k}</span>
            <span className="text-slate-700 font-medium">{v}</span>
          </div>
        ))}
      </div>
      <button
        className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-medium text-sm rounded-xl py-2.5 flex items-center justify-center gap-2"
        onClick={() => alert("Redirecting to payment gateway…")}
      >
        💳 Pay Now
      </button>
    </div>
  );
}