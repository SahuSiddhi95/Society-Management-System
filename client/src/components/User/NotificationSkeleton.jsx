/**
 * compact=true  → smaller row skeleton (used in NotificationDropdown)
 * compact=false → full card skeleton (used on Notifications page)
 */
export default function NotificationSkeleton({ count = 5, compact = false }) {
  if (compact) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
            <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-slate-200" />
              <div className="h-2.5 w-4/5 rounded bg-slate-100" />
              <div className="h-2 w-1/4 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 px-4 py-4 rounded-xl border border-slate-200 bg-white animate-pulse"
        >
          {/* Icon circle */}
          <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-2.5 min-w-0">
            {/* Title + badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="h-3.5 w-2/5 rounded-lg bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-200 shrink-0" />
            </div>
            {/* Body lines */}
            <div className="h-2.5 w-4/5 rounded bg-slate-100" />
            <div className="h-2.5 w-3/5 rounded bg-slate-100" />
            {/* Footer */}
            <div className="flex items-center justify-between mt-1">
              <div className="h-2 w-20 rounded bg-slate-100" />
              <div className="h-5 w-12 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}