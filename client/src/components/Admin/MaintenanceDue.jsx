export default function MaintenanceDue({ stats }) {
  const collected = stats?.maintenanceCollected || 0;
  const pending = stats?.pendingPayments || 0;
  const defaulters = stats?.defaulters || 0;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50 rounded-2xl p-6 h-full flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Decorative blurred circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all duration-500"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl group-hover:bg-orange-400/20 transition-all duration-500"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/50 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
            Society Collection Overview
          </p>
          <div className="bg-white/60 p-2 rounded-lg backdrop-blur-md">
            <span className="text-amber-600 text-lg">💰</span>
          </div>
        </div>
        
        <p className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2">
          ₹{collected.toLocaleString("en-IN")}
        </p>
        <p className="text-sm font-medium text-gray-500 mt-1">Total Maintenance Collected</p>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              <span className="text-sm text-gray-600 font-medium">Pending Amount</span>
            </div>
            <span className="font-bold text-gray-900">₹{pending.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 bg-gradient-to-r from-red-50 to-amber-50 border border-red-100/50 rounded-xl px-4 py-3 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-600 flex justify-center items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          ₹{pending.toLocaleString("en-IN")} still pending from {defaulters} {defaulters === 1 ? 'flat' : 'flats'}
        </p>
      </div>
    </div>
  );
}