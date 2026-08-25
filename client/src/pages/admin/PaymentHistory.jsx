import { useEffect, useState, useMemo } from "react";
import { getPaymentHistory } from "../../api/Admin/paymentApi";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Search,
  RotateCcw,
  Eye,
  Download,
  Printer,
  Receipt,
  Wallet,
  CalendarCheck,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import PrintableReceipt from "../../components/Admin/PrintableReceipt";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ROWS_PER_PAGE = 8;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchName, setSearchName] = useState("");
  const [searchFlat, setSearchFlat] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Bulk Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState("1Y"); // 1Y, 5Y, 10Y, CUSTOM
  const [delStartDate, setDelStartDate] = useState("");
  const [delEndDate, setDelEndDate] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Table
  const [sortOrder, setSortOrder] = useState("desc"); // desc = latest first
  const [currentPage, setCurrentPage] = useState(1);

  // View details modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [printingPayment, setPrintingPayment] = useState(null);


  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPaymentHistory();
      const data = Array.isArray(res?.data) ? res.data : res || [];
      // Only successfully paid records
      const paidOnly = data.filter(
        (item) => item?.status?.toLowerCase() === "paid"
      );
      setPayments(paidOnly);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError(
        err?.response?.data?.message ||
        "Failed to load payment history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- Derived / Filtered Data ----------
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (searchName.trim()) {
      result = result.filter((p) =>
        p?.resident?.name?.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    }

    if (searchFlat.trim()) {
      result = result.filter((p) =>
        p?.resident?.flatNo?.toLowerCase().includes(searchFlat.trim().toLowerCase())
      );
    }

    if (filterMonth) {
      result = result.filter((p) => String(p?.month) === String(filterMonth));
    }

    if (filterYear) {
      result = result.filter((p) => String(p?.year) === String(filterYear));
    }

    if (startDate) {
      result = result.filter(
        (p) => p?.paymentDate && new Date(p.paymentDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      result = result.filter(
        (p) => p?.paymentDate && new Date(p.paymentDate) <= new Date(endDate)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.paymentDate).getTime() || 0;
      const dateB = new Date(b.paymentDate).getTime() || 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [payments, searchName, searchFlat, filterMonth, filterYear, startDate, endDate, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ROWS_PER_PAGE));

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredPayments.slice(start, start + ROWS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchFlat, filterMonth, filterYear, startDate, endDate]);

  // ---------- Statistics ----------
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const todayStr = now.toDateString();

    const totalTransactions = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const paymentsThisMonth = payments.filter((p) => {
      const d = p.paymentDate ? new Date(p.paymentDate) : null;
      return d && d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    });

    const todaysPayments = payments.filter((p) => {
      const d = p.paymentDate ? new Date(p.paymentDate) : null;
      return d && d.toDateString() === todayStr;
    });

    const todaysAmount = todaysPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return {
      totalTransactions,
      totalAmount,
      paymentsThisMonthCount: paymentsThisMonth.length,
      todaysCollection: todaysAmount,
      averagePayment: totalTransactions ? totalAmount / totalTransactions : 0,
    };
  }, [payments]);

  const availableYears = useMemo(() => {
    const years = new Set(payments.map((p) => p.year).filter(Boolean));
    return Array.from(years).sort((a, b) => b - a);
  }, [payments]);

  const resetFilters = () => {
    setSearchName("");
    setSearchFlat("");
    setFilterMonth("");
    setFilterYear("");
    setStartDate("");
    setEndDate("");
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const monthLabel = (month) => {
    if (!month) return "—";
    const idx = Number(month) - 1;
    return MONTH_NAMES[idx] || month;
  };

  useEffect(() => {
    if (printingPayment) {
      const timer = setTimeout(() => {
        window.print();
        setPrintingPayment(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printingPayment]);

  const handlePrint = (payment) => {
    setPrintingPayment(payment);
  };

  const handleBulkDelete = async () => {
    try {
      setDeleting(true);
      let payload = {};
      if (deleteOption === "1Y") payload = { olderThanYears: 1 };
      else if (deleteOption === "5Y") payload = { olderThanYears: 5 };
      else if (deleteOption === "10Y") payload = { olderThanYears: 10 };
      else if (deleteOption === "CUSTOM") {
        if (!delStartDate && !delEndDate) {
          toast.error("Please select a date range to delete");
          setDeleting(false);
          return;
        }
        payload = { startDate: delStartDate, endDate: delEndDate };
      }

      const { data } = await API.delete("/transactions/admin/delete-range", { data: payload });
      toast.success(data.message || "Transaction records deleted successfully!");
      setShowDeleteModal(false);
      fetchPayments();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete transaction records");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={printingPayment ? "hidden print:hidden" : "block"}>
        {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Payment History
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                View all successful maintenance payments made by residents.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-semibold transition self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              Delete Records by Date Range
            </button>
          </div>


          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              icon={<Receipt className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="Total Paid Transactions"
              value={loading ? "—" : stats.totalTransactions}
            />
            <SummaryCard
              icon={<Wallet className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              label="Total Amount Collected"
              value={loading ? "—" : formatCurrency(stats.totalAmount)}
            />
            <SummaryCard
              icon={<CalendarCheck className="w-6 h-6 text-indigo-600" />}
              iconBg="bg-indigo-100"
              label="Payments This Month"
              value={loading ? "—" : stats.paymentsThisMonthCount}
            />
            <SummaryCard
              icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
              iconBg="bg-orange-100"
              label="Today's Collections"
              value={loading ? "—" : formatCurrency(stats.todaysCollection)}
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4 mb-6">
            <h2 className="text-base font-bold text-gray-800">Search & Filters</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Resident Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Flat Number"
                  value={searchFlat}
                  onChange={(e) => setSearchFlat(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
                />
              </div>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
              >
                <option value="">All Months</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
              >
                <option value="">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">
                Payment Records
                {!loading && (
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({filteredPayments.length} results)
                  </span>
                )}
              </h2>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchPayments} />
            ) : filteredPayments.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70 text-left text-gray-500 uppercase text-xs tracking-wide">
                        <th className="px-5 sm:px-6 py-3.5 font-semibold whitespace-nowrap">Resident Name</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Flat No.</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Amount Paid</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Month</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Year</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                          <button
                            onClick={toggleSort}
                            className="flex items-center gap-1 hover:text-gray-700 transition"
                          >
                            Payment Date
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>
                        </th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Method</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Receipt No.</th>
                        <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPayments.map((payment, idx) => (
                        <tr
                          key={payment._id || idx}
                          className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                        >
                          <td className="px-5 sm:px-6 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                            {payment?.resident?.name || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">
                            {payment?.resident?.flatNo || "—"}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                            {monthLabel(payment.month)}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.year || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.paymentMethod || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.receiptNumber || "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <ActionButton
                                title="View Details"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <Eye className="w-4 h-4" />
                              </ActionButton>
                              <ActionButton
                                title="Download Receipt"
                                onClick={() =>
                                  alert("Download receipt — feature coming soon.")
                                }
                              >
                                <Download className="w-4 h-4" />
                              </ActionButton>
                              <ActionButton title="Print Receipt" onClick={() => handlePrint(payment)}>
                                <Printer className="w-4 h-4" />
                              </ActionButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {(currentPage - 1) * ROWS_PER_PAGE + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-gray-700">
                      {Math.min(currentPage * ROWS_PER_PAGE, filteredPayments.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {filteredPayments.length}
                    </span>{" "}
                    records
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600 px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
      {/* View Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          monthLabel={monthLabel}
        />
      )}

      {/* Bulk Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full border border-gray-100 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-bold text-lg text-gray-800">Delete Payment History</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Select the date range criterion to permanently delete historical payment records:
            </p>

            <div className="space-y-3 mb-5">
              {[
                { id: "1Y", label: "Older than 1 Year" },
                { id: "5Y", label: "Older than 5 Years" },
                { id: "10Y", label: "Older than 10 Years" },
                { id: "CUSTOM", label: "Custom Date Range" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    deleteOption === opt.id
                      ? "border-red-500 bg-red-50/50 text-red-700 font-semibold"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delOpt"
                    value={opt.id}
                    checked={deleteOption === opt.id}
                    onChange={(e) => setDeleteOption(e.target.value)}
                    className="accent-red-600"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}

              {deleteOption === "CUSTOM" && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">From Date</label>
                    <input
                      type="date"
                      value={delStartDate}
                      onChange={(e) => setDelStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 block mb-1">To Date</label>
                    <input
                      type="date"
                      value={delEndDate}
                      onChange={(e) => setDelEndDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
      <PrintableReceipt payment={printingPayment} />
    </>
  );
};

// ---------------- Sub Components ----------------

const SummaryCard = ({ icon, iconBg, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ children, title, onClick }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
  >
    {children}
  </button>
);

const TableSkeleton = () => (
  <div className="p-5 sm:p-6 space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-12 w-full rounded-xl bg-gray-100 animate-pulse"
        style={{ animationDelay: `${i * 60}ms` }}
      />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <Receipt className="w-12 h-12 mb-3 opacity-40" />
    <p className="text-sm font-medium text-gray-600">No Payment History Found</p>
    <p className="text-xs mt-1 max-w-sm text-center">
      Residents who successfully pay their maintenance bills will appear here.
    </p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <X className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-sm font-semibold text-gray-700">Something went wrong</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
    >
      Try Again
    </button>
  </div>
);

const PaymentDetailsModal = ({ payment, onClose, formatCurrency, formatDate, monthLabel }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Payment Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Transaction summary</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-3">
        <DetailRow label="Resident Name" value={payment?.resident?.name} />
        <DetailRow label="Flat Number" value={payment?.resident?.flatNo} />
        <DetailRow label="Email" value={payment?.resident?.email} />
        <DetailRow label="Amount Paid" value={formatCurrency(payment.amount)} />
        <DetailRow label="Month" value={monthLabel(payment.month)} />
        <DetailRow label="Year" value={payment.year} />
        <DetailRow label="Payment Date" value={formatDate(payment.paidAt || payment.paymentDate)} />
        <DetailRow label="Payment Method" value={payment.paymentMethod || "—"} />
        <DetailRow label="Receipt Number" value={payment.receiptNumber || "—"} />
        {payment.paymentProof && (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 mt-4">
            <span className="text-xs font-semibold text-gray-400">Payment Proof</span>
            <a 
              href={payment.paymentProof} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-1 relative group block w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-white hover:border-indigo-300 transition-colors"
            >
              <img 
                src={payment.paymentProof} 
                alt="Payment Proof" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">Click to View Full</span>
              </div>
            </a>
          </div>
        )}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
          <span className="text-xs font-semibold text-gray-400">Status</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Paid
          </span>
        </div>
      </div>

      <div className="px-6 pb-5">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
    <span className="text-xs font-semibold text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-700 text-right">{value || "—"}</span>
  </div>
);

export default PaymentHistory;