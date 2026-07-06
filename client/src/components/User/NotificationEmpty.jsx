export default function NotificationEmpty({ compact = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-10 px-6" : "py-16 px-6"
      }`}
    >
      <div
        className={`rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 ${
          compact ? "w-12 h-12" : "w-20 h-20"
        }`}
      >
        <span className={compact ? "text-2xl" : "text-4xl"}>🔔</span>
      </div>
      <p className={`font-bold text-slate-800 ${compact ? "text-sm" : "text-base"}`}>
        No notifications yet
      </p>
      <p className={`text-slate-400 mt-1 ${compact ? "text-xs" : "text-sm"}`}>
        Everything looks quiet.
      </p>
    </div>
  );
}