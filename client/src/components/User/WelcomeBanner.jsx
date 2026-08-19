/**
 * WelcomeBanner — shows the user's name, flat details, and live complaint count.
 * Upgraded to professional UI with rich gradients and animations.
 */
export default function WelcomeBanner({ user, complaints = [] }) {
  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // User initials
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 overflow-hidden shadow-lg shadow-indigo-200 group">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-400/30 transition-all duration-700" />
      <div className="absolute right-40 top-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

      {/* Left: greeting + meta */}
      <div className="relative z-10">
        <p className="text-indigo-200 text-sm font-medium mb-1 drop-shadow-sm">{greeting} 👋</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
          {user?.name || "Resident"}
        </h2>
        <p className="text-indigo-100 text-sm mt-2 max-w-lg">
          Stay updated with notices, dues, complaints, and society activities.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-semibold shadow-sm text-white">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {user?.societyName || "Shree Ram Residency"} · Flat {user?.flatNo || "—"}
        </div>
      </div>

      {/* Right: stats */}
      <div className="relative z-10 flex items-center gap-6 sm:gap-8 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-sm">
            {initials}
          </div>
          <div className="text-indigo-100 text-xs font-medium uppercase tracking-wider">{user?.flatType || "Resident"}</div>
        </div>

        <div className="h-12 w-px bg-white/20" />

        <div className="text-center">
          <div className="text-3xl font-black text-white drop-shadow-md">{complaints.length}</div>
          <div className="text-indigo-100 text-xs font-medium uppercase tracking-wider mt-1">Complaints</div>
        </div>
      </div>
    </div>
  );
}