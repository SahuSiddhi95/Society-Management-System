import NotificationBell from "./NotificationBell";

export default function Topbar({ user }) {
     console.log("admin",user?.name); 

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
  // User Initials  
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">

      {/* Left */}
      <div>

        <h1 className="text-lg font-bold text-slate-800">

          {greeting}, {user?.name || "Resident"} 👋

        </h1>

        <p className="text-xs text-slate-400 mt-0.5">

          {today}
          {" · "}
          {user?.societyName || "Shree Ram Residency"}

        </p>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Flat Info */}
        <div className="hidden md:flex flex-col items-end mr-2">

          

          <span className="text-xs text-slate-400 capitalize">

            {"Resident"}

          </span>

        </div>
{/* 
        Search
        <button className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors text-lg">

          🔍

        </button> */}

        {/* Notification */}
        <NotificationBell />

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md">

          {initials}

        </div>    

      </div>
    </header>
  );
}