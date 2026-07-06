export default function NotificationSkeleton({ count = 4 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3 animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-2.5 w-4/5 rounded bg-slate-200" />
            <div className="h-2 w-1/4 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}