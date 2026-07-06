export default function WelcomeBanner({ user, complaints }) {
  console.log(user)
  return (
    <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl p-7 flex items-center justify-between overflow-hidden shadow-lg shadow-indigo-200">
      <div className="absolute -right-10 -top-14 w-56 h-56 bg-white/5 rounded-full" />
      <div className="absolute right-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full" />
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white">
          Welcome to your Society Dashboard
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Stay updated with notices, dues, complaints, and activities.
        </p>
        <span className="inline-flex items-center gap-2 mt-4 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          Shree Ram Residency ·{user?.flatNo}
        </span>
      </div>
      <div className="relative z-10 flex items-center gap-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{user?.name}</div>
          <div className="text-xs text-indigo-200 mt-1">{user?.flatType}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{complaints.length}</div>
          <div className="text-xs text-indigo-200 mt-1">Complaints</div>
        </div>
      </div>
    </div>
  );
}