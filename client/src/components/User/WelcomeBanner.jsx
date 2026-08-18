/**
 * WelcomeBanner — shows the user's name, flat details, and live complaint count.
 * Removed debug console.log.
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
    <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden shadow-lg shadow-indigo-200">
      {/* Decorative blobs */}
      <div className="absolute -right-10 -top-14 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute right-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute right-60 top-0 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />

      {/* Left: greeting + meta */}
      <div className="relative z-10">
        <p className="text-indigo-200 text-xs font-medium mb-1">{greeting} 👋</p>
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {user?.name || "Resident"}
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Stay updated with notices, dues, complaints, and activities.
        </p>
        <span className="inline-flex items-center gap-2 mt-4 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {user?.societyName || "Shree Ram Residency"} · Flat {user?.flatNo || "—"}
        </span>
      </div>

      {/* Right: stats */}
      <div className="relative z-10 flex items-center gap-5 sm:gap-8">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-base sm:text-lg mx-auto mb-1">
            {initials}
          </div>
          <div className="text-white text-xs font-medium">{user?.flatType || "Resident"}</div>
        </div>

        <div className="h-10 w-px bg-white/20" />

        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">{complaints.length}</div>
          <div className="text-xs text-indigo-200 mt-0.5">Complaints</div>
        </div>
      </div>
    </div>
  );
}