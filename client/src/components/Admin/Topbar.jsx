import NotificationBell from "./NotificationBell";
import Icon from "../../assets/icons";

export default function Topbar({ user, users, society, onMenuClick }) {
  // Current Date
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Greeting
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  // Admin Initials
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="md:hidden w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition"
        >
          <Icon name="menu" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-800 truncate">
            {greeting}, {user?.name || "Admin"} 👋
          </h1>

          <p className="text-xs text-slate-500 truncate mt-0.5">
            {today}
            {" • "}
            {society?.societyName || user?.societyName || "Society Management System"}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Admin Role */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-semibold text-slate-700">
            Administrator
          </span>
          <span className="text-xs text-slate-400">
            Manage Society
          </span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* Admin Avatar */}
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer">
          {initials}
        </div>
      </div>
    </header>
  );
}