import  { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Pencil, Trash2, FileWarning, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../api/axios";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PAGE_SIZE = 10;

const StatusBadge = ({ status }) => {
  const isPaid = status === "Paid";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        isPaid ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
      }`}
    >
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
};

const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
        {[...Array(8)].map((__, j) => (
          <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
      <FileWarning className="w-9 h-9 text-indigo-300" />
    </div>
    <p className="text-gray-500 font-medium">No maintenance generated yet.</p>
    <p className="text-sm text-gray-400 mt-1">Use the form above to generate dues for all residents.</p>
  </div>
);

const MaintenanceTable = ({ maintenance, loading, onEdit, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const years = useMemo(() => {
    const ys = new Set(maintenance.map((m) => m.year));
    return Array.from(ys).sort((a, b) => b - a);
  }, [maintenance]);

  const filtered = useMemo(() => {
    return maintenance.filter((m) => {
      const matchesSearch =
        !search ||
        m.resident?.toLowerCase().includes(search.toLowerCase()) ||
        m.flat?.toLowerCase().includes(search.toLowerCase()) ||
        m.month?.toLowerCase().includes(search.toLowerCase());
      const matchesMonth = monthFilter === "All" || m.month === monthFilter;
      const matchesYear = yearFilter === "All" || String(m.year) === String(yearFilter);
      const matchesStatus = statusFilter === "All" || m.status === statusFilter;
      return matchesSearch && matchesMonth && matchesYear && matchesStatus;
    });
  }, [maintenance, search, monthFilter, yearFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this maintenance record?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/maintenance/${id}`);
      toast.success("Maintenance record deleted");
      onRefresh?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Generated Maintenance</h2>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by resident name, flat..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <select
            value={monthFilter}
            onChange={(e) => { setMonthFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          >
            <option value="All">All Months</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          >
            <option value="All">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">Resident</th>
                  <th className="px-6 py-3 font-medium">Flat</th>
                  <th className="px-6 py-3 font-medium">Month</th>
                  <th className="px-6 py-3 font-medium">Year</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((m) => (
                  <tr key={m._id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
  {m.resident?.name || "—"}
</td>
                    <td className="px-6 py-4 text-gray-600">
  {m.resident?.flatNo || "—"}
</td>
                    <td className="px-6 py-4 text-gray-600">{m.month}</td>
                    <td className="px-6 py-4 text-gray-600">{m.year}</td>
                    <td className="px-6 py-4 text-gray-600">{m.category || "Maintenance"}</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">₹{Number(m.amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {m.dueDate ? new Date(m.dueDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={m.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(m)}
                          className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          disabled={deletingId === m._id}
                          className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenanceTable;