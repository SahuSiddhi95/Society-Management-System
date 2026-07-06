// src/components/complaints/ComplaintTable.jsx
import { Eye, Trash2, Loader2 } from "lucide-react";

export default function ComplaintTable({
  complaints,
  loading,
  onView,
  onDelete,
  onStatusChange,
  statusUpdatingId,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-500" />
        <p className="mt-2 text-sm text-slate-500">Loading complaints…</p>
      </div>
    );
  }
  
  if (!complaints || complaints.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-sm font-medium text-slate-600">No complaints found</p>
        <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Complaint ID</th>
              <th className="px-4 py-3 font-medium">Resident</th>
              <th className="px-4 py-3 font-medium">Flat No.</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <tr key={c._id} className="transition hover:bg-slate-50/70">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  #{c._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-slate-700">{c.user?.name || "—"}</td>
                <td className="px-4 py-3 text-slate-700">{c.user?.flatNo || "—"}</td>
                <td className="max-w-[220px] truncate px-4 py-3 text-slate-700" title={c.title}>
                  {c.title}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {c.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={c.status}
                    disabled={statusUpdatingId === c._id}
                    onChange={(e) => onStatusChange(c._id, e.target.value)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 outline-none focus:border-indigo-400 disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(c)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete complaint"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}