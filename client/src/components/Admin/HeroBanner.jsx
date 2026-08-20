export default function HeroBanner({ stats, society }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 text-white overflow-hidden shadow-lg shadow-indigo-200">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-sm">
            Welcome back to your Dashboard! 👋
          </h2>
          <p className="text-indigo-100 text-sm max-w-xl leading-relaxed">
            Manage your society effectively. Here is a quick overview of residents, maintenance, complaints, and recent activities.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs font-semibold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            {society?.societyName || "SocietyOS"} · Admin Portal
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-right bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
          <div>
            <p className="text-3xl font-black drop-shadow-md">{stats?.totalResidents || 0}</p>
            <p className="text-indigo-100 text-xs font-medium mt-1 uppercase tracking-wider">Total Residents</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <p className="text-3xl font-black drop-shadow-md">{stats?.totalFlats || 0}</p>
            <p className="text-indigo-100 text-xs font-medium mt-1 uppercase tracking-wider">Total Flats</p>
          </div>
        </div>
      </div>
    </div>
  );
}