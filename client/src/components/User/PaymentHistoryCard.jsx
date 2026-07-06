import Icon from "../../assets/icons";
import { PAYMENTS } from "../User/shared/constants";

export default function PaymentHistoryCard({ setActiveNav }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Payment History
        </h3>
        <button
          onClick={() => setActiveNav("history")}
          className="text-indigo-600 text-xs font-medium hover:underline"
        >
          View all →
        </button>
      </div>
      {PAYMENTS.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center justify-between py-3 ${
            i < PAYMENTS.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0">
              <Icon name={p.icon} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{p.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{p.date}</p>
            </div>
          </div>
          <span className="text-sm font-bold text-green-600">{p.amt}</span>
        </div>
      ))}
    </div>
  );
}