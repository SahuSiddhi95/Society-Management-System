import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";
import { getPaymentHistory } from "../../api/Admin/paymentApi";
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
} from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ROWS_PER_PAGE = 8;

const PaymentHistory = ({active,
  setActive}) => {
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

  // Table
  const [sortOrder, setSortOrder] = useState("desc"); // desc = latest first
  const [currentPage, setCurrentPage] = useState(1);

  // View details modal
  const [selectedPayment, setSelectedPayment] = useState(null);

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

  const handlePrint = () => window.print();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active}
      setActive={setActive}/>
      <div className="flex-1  flex flex-col lg:ml-64">
        <Topbar active={active}
          setActive={setActive}/>  

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Payment History
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              View all successful maintenance payments made by residents.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <SummaryCard
              icon={<Receipt className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              label="Total Paid Transactions"
              value={loading ? "—" : stats.totalTransactions}
            />
            <SummaryCard
              icon={<Wallet className="w-6 h-6 text-green-600" />}
              iconBg="bg-green-100"
              label="Total Amount Collected"
              value={loading ? "—" : formatCurrency(stats.totalAmount)}
            />
            <SummaryCard
              icon={<CalendarCheck className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
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
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Search & Filters</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Resident Name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Flat Number"
                  value={searchFlat}
                  onChange={(e) => setSearchFlat(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
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
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
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
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
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
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="text-left text-gray-500 uppercase text-xs tracking-wider">
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Resident Name</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Flat No.</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Amount Paid</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Month</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Year</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">
                          <button
                            onClick={toggleSort}
                            className="flex items-center gap-1 hover:text-gray-700 transition"
                          >
                            Payment Date
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>
                        </th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Status</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Method</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap">Receipt No.</th>
                        <th className="px-4 sm:px-6 py-3 font-semibold whitespace-nowrap text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedPayments.map((payment, idx) => (
                        <tr
                          key={payment._id || idx}
                          className={`transition-colors hover:bg-blue-50/50 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                          }`}
                        >
                          <td className="px-4 sm:px-6 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                            {payment?.resident?.name || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment?.resident?.flatNo || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 font-semibold text-gray-800 whitespace-nowrap">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {monthLabel(payment.month)}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.year || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.paymentMethod || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-gray-600 whitespace-nowrap">
                            {payment.receiptNumber || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center justify-end gap-2">
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
                              <ActionButton title="Print Receipt" onClick={handlePrint}>
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                      {(currentPage - 1) * ROWS_PER_PAGE + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-gray-700">
                      {Math.min(currentPage * ROWS_PER_PAGE, filteredPayments.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-700">
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
        </main>
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
    </div>
  );
};

// ---------------- Sub Components ----------------

const SummaryCard = ({ icon, iconBg, label, value }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ children, title, onClick }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
  >
    {children}
  </button>
);

const TableSkeleton = () => (
  <div className="p-4 sm:p-6 space-y-3">
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
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <Receipt className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700">No Payment History Found</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm">
      Residents who successfully pay their maintenance bills will appear here.
    </p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <X className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700">Something went wrong</h3>
    <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
    >
      Try Again
    </button>
  </div>
);

const PaymentDetailsModal = ({ payment, onClose, formatCurrency, formatDate, monthLabel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-[fadeIn_0.15s_ease-out]">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>

      <div className="space-y-3 text-sm">
        <DetailRow label="Resident Name" value={payment?.resident?.name} />
        <DetailRow label="Flat Number" value={payment?.resident?.flatNo} />
        <DetailRow label="Email" value={payment?.resident?.email} />
        <DetailRow label="Amount Paid" value={formatCurrency(payment.amount)} />
        <DetailRow label="Month" value={monthLabel(payment.month)} />
        <DetailRow label="Year" value={payment.year} />
        <DetailRow label="Payment Date" value={formatDate(payment.paymentDate)} />
        <DetailRow label="Payment Method" value={payment.paymentMethod || "—"} />
        <DetailRow label="Receipt Number" value={payment.receiptNumber || "—"} />
        <div className="flex items-center justify-between pt-1">
          <span className="text-gray-500">Status</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            Paid
          </span>
        </div>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800 text-right">{value || "—"}</span>
  </div>
);

export default PaymentHistory;