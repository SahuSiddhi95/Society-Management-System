import NotificationBell from "./NotificationBell";

/**
 * Topbar component for the User dashboard.
 *
 * Props:
 *  - user        — the logged-in user object
 *  - setActiveNav — (optional) SPA navigation setter from UserDashboard;
 *                   passed to NotificationBell so "View all" navigates
 *                   without a full page reload.
 */
export default function Topbar({ user, setActiveNav }) {
  // Dynamic date string
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Dynamic greeting based on hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // User initials (max 2 chars)
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* ── Left: greeting + date ──────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all shrink-0"
          aria-label="Toggle menu"
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 truncate">
            {greeting}, {user?.name || "Resident"} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
            {today} · {user?.societyName || "Shree Ram Residency"}
          </p>
        </div>
      </div>

      {/* ── Right: bell + avatar ───────────────────────────────────── */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Flat / role badge — hidden on mobile */}
        {user?.flatNo && (
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-xs font-semibold text-slate-700">
              {user.flatNo}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              Resident
            </span>
          </div>
        )}

        {/* Notification Bell with dropdown */}
        <NotificationBell onNavigate={setActiveNav} />

        {/* User avatar */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md select-none"
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}