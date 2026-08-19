import NotificationBell from "./NotificationBell";

/**
 * Topbar component for the User dashboard.
 */
export default function Topbar({ user, setActiveNav, onMenuClick }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] transition-all">
      {/* ── Left: greeting + date ──────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-indigo-600 active:scale-95 transition-all shrink-0"
          aria-label="Toggle menu"
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight truncate">
            {greeting}, <span className="text-indigo-600">{user?.name || "Resident"}</span> 👋
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5 truncate hidden sm:block">
            {today} <span className="mx-1.5 opacity-50">•</span> {user?.societyName || "Shree Ram Residency"}
          </p>
        </div>
      </div>

      {/* ── Right: bell + avatar ───────────────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Flat / role badge — hidden on mobile */}
        {user?.flatNo && (
          <div className="hidden md:flex flex-col items-end mr-1 pr-4 border-r border-slate-200/60">
            <span className="text-sm font-bold text-slate-700 leading-tight">
              Flat {user.flatNo}
            </span>
            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-widest">
              Resident
            </span>
          </div>
        )}

        {/* Notification Bell */}
        <NotificationBell onNavigate={setActiveNav} />

        {/* User avatar */}
        <div
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 ring-2 ring-transparent hover:ring-indigo-100 active:scale-95 transition-all select-none"
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}