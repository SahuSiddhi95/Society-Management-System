import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Pencil, Trash2, FileWarning, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
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
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
        isPaid ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-700 border border-amber-100"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
};

const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-6 py-5 border-b border-gray-50">
        {[...Array(8)].map((__, j) => (
          <div key={j} className="h-4 bg-gray-100 rounded-lg flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-24 h-24 rounded-full bg-indigo-50/50 flex items-center justify-center mb-5 ring-8 ring-indigo-50/30">
      <FileWarning className="w-10 h-10 text-indigo-400" />
    </div>
    <p className="text-gray-900 font-bold text-lg">No maintenance records found</p>
    <p className="text-sm text-gray-400 mt-2 max-w-sm">Use the filters above to find specific records, or generate new dues using the form.</p>
  </div>
);

const MaintenanceTable = ({ maintenance, loading, onEdit, onRecordPayment, onRefresh }) => {
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
        m.resident?.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.resident?.flatNo?.toLowerCase().includes(search.toLowerCase()) ||
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

  const exportCSV = () => {
    if (filtered.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Resident Name", "Flat No", "Month", "Year", "Category", "Amount", "Due Date", "Status"];
    const csvContent = [
      headers.join(","),
      ...filtered.map((m) => [
        m.resident?.name || "N/A",
        m.resident?.flatNo || "N/A",
        m.month,
        m.year,
        m.category || "Maintenance",
        m.amount,
        m.dueDate ? new Date(m.dueDate).toLocaleDateString("en-IN") : "N/A",
        m.status
      ].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `maintenance_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported!");
  };

  const selectClasses = "px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white hover:bg-gray-50 transition-colors shadow-sm cursor-pointer appearance-none outline-none";

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Filter className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Records Directory</h2>
              <p className="text-sm text-gray-400 mt-0.5">Filter, search, and export maintenance dues</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative w-full sm:w-72 group">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search resident or flat..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm transition-all outline-none"
              />
            </div>
            <button
              onClick={exportCSV}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="relative inline-block">
            <select value={monthFilter} onChange={(e) => { setMonthFilter(e.target.value); setPage(1); }} className={selectClasses}>
              <option value="All">🗓️ All Months</option>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="relative inline-block">
            <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className={selectClasses}>
              <option value="All">📅 All Years</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="relative inline-block">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className={selectClasses}>
              <option value="All">📊 All Status</option>
              <option value="Paid">✅ Paid</option>
              <option value="Pending">⏳ Pending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 bg-white border-b border-gray-100 uppercase tracking-wider text-[11px] font-bold">
                  <th className="px-8 py-4">Resident</th>
                  <th className="px-6 py-4">Flat</th>
                  <th className="px-6 py-4">Month/Year</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((m) => (
                  <tr key={m._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{m.resident?.name || "—"}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                        {m.resident?.flatNo || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-600">
                      {m.month} {m.year}
                    </td>
                    <td className="px-6 py-5 text-gray-500">{m.category || "Maintenance"}</td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-gray-900">₹{Number(m.amount).toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      {m.dueDate ? new Date(m.dueDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={m.status} /></td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {m.status !== "Paid" && (
                          <button
                            onClick={() => onRecordPayment?.(m)}
                            className="px-3 py-1.5 h-9 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center justify-center hover:bg-green-100 hover:border-green-300 shadow-sm transition-all"
                            title="Record Manual Payment"
                          >
                            Record Pay
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(m)}
                          className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          disabled={deletingId === m._id}
                          className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-500 flex items-center justify-center hover:border-red-200 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all disabled:opacity-50"
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

          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 border-t border-gray-100 bg-gray-50/30 gap-4">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="font-bold text-gray-900">{(page - 1) * PAGE_SIZE + 1}</span> to <span className="font-bold text-gray-900">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-bold text-gray-900">{filtered.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-gray-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenanceTable;