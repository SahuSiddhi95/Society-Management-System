// src/components/complaints/ComplaintDetailsDrawer.jsx
import { X, ImageOff } from "lucide-react";
import StatusBadge from "./Statusbadge ";

export default function ComplaintDetailsDrawer({
  complaint,
  onClose,
  onStatusChange,
  statusUpdating,
}) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Complaint Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400">
              #{complaint._id.slice(-6).toUpperCase()}
            </span>
            <StatusBadge status={complaint.status} />
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-900">{complaint.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {complaint.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
            <div>
              <p className="text-xs text-slate-400">Resident</p>
              <p className="font-medium text-slate-700">{complaint.user?.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Flat No.</p>
              <p className="font-medium text-slate-700">{complaint.user?.flatNumber || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Category</p>
              <p className="font-medium text-slate-700">{complaint.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Date Filed</p>
              <p className="font-medium text-slate-700">
                {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-slate-400">Attached Image</p>
            {complaint.image ? (
              <img
                src={complaint.image}
                alt="Complaint attachment"
                className="w-full rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-32 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 text-slate-400">
                <ImageOff className="h-5 w-5" />
                <span className="text-xs">No image attached</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-500">
            Update Status
          </label>
          <select
            value={complaint.status}
            disabled={statusUpdating}
            onChange={(e) => onStatusChange(complaint._id, e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
          >
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
}