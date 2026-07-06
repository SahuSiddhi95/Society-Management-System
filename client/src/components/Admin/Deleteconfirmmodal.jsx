// src/components/complaints/DeleteConfirmModal.jsx
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({ complaint, onCancel, onConfirm, deleting }) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={onCancel} />

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900">Delete this complaint?</h3>
        <p className="mt-1.5 text-sm text-slate-500">
          "{complaint.title}" filed by {complaint.user?.name || "this resident"} will be
          permanently removed. This can't be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}