import Icon from "./shared/Icon";

const icons = {
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  bell:   "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};
 // Dynamic Date
  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  // Dynamic Greeting
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }
export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {greeting}, Admin 👋
        </h1>
        <p className="text-xs text-gray-400">
          {today} · Shree Ram Residency
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Icon d={icons.search} size={16} color="#6b7280" />
        </button>
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
          <Icon d={icons.bell} size={16} color="#6b7280" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-400 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
            3
          </span>
        </button>
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
          AD
        </div>
      </div>
    </header>
  );
}