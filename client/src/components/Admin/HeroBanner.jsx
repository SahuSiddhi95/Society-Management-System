export default function HeroBanner({ stats }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#4f54c9] to-[#6e73e5] p-6 text-white flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold mb-1">Welcome to your Society Dashboard</h2>
        <p className="text-indigo-200 text-sm">
          Stay updated with residents, maintenance, complaints, and society activities.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          Shree Ram Residency · Admin Panel
        </div>
      </div>
      <div className="hidden md:flex gap-8 text-right">
        <div>
          <p className="text-2xl font-bold">{stats.totalResidents}</p>
          <p className="text-indigo-200 text-xs mt-0.5">Total Residents</p>
        </div>

        <div>
          <p className="text-2xl font-bold">{stats.totalFlats}</p>
          <p className="text-indigo-200 text-xs mt-0.5">Total Flats</p>
        </div>

      </div>
    </div>
  );
}