export default function NotificationEmpty({ compact = false, filtered = false }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center text-center overflow-hidden ${
        compact ? "py-10 px-6" : "py-20 px-8"
      }`}
    >
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-indigo-50/80 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-violet-50/60 blur-2xl" />
      </div>

      {/* Icon container */}
      <div
        className={`relative z-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center shadow-sm mb-5 ${
          compact ? "w-14 h-14" : "w-24 h-24"
        }`}
      >
        <span className={compact ? "text-3xl" : "text-5xl"} role="img" aria-label="No notifications">
          🔔
        </span>
      </div>

      <div className="relative z-10">
        <h3
          className={`font-bold text-slate-800 ${
            compact ? "text-sm" : "text-xl"
          }`}
        >
          {filtered ? "No matching notifications" : "All caught up!"}
        </h3>
        <p
          className={`text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {filtered
            ? "Try changing the filter or search term."
            : "You have no notifications right now. We'll let you know when something new arrives."}
        </p>
      </div>
    </div>
  );
}