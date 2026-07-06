export default function MaintenanceDue() {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 h-full flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">
          Society Collection — May 2026
        </p>
        <p className="text-4xl font-bold text-gray-900">₹4,25,000</p>
        <p className="text-sm text-gray-500 mt-1">Collected this month</p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            ["Maintenance Charge", "₹3,00,000"],
            ["Water Charge",       "₹75,000"],
            ["Parking Fee",        "₹50,000"],
          ].map(([lbl, amt]) => (
            <div key={lbl} className="flex justify-between text-gray-600">
              <span>{lbl}</span>
              <span className="font-medium text-gray-800">{amt}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 bg-amber-100 rounded-xl px-4 py-2.5 text-center">
        <p className="text-xs font-semibold text-amber-700">
          ₹58,000 still pending from 15 flats
        </p>
      </div>
    </div>
  );
}