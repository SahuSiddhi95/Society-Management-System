import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import API from "../../api/axios";

// ─── helpers ────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDueDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Maintenance.status is ONLY ever "Pending" | "Paid" | "Overdue"
const STATUS_BADGE = {
  Paid: "bg-green-50 text-green-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-600",
};

const STATUS_ICON = {
  Paid: "✅",
  Pending: "⏳",
  Overdue: "⚠️",
};

// ─── component ──────────────────────────────────────────────
export default function MyDues() {
  const { fetchDashboardData, user, dues: propDues = [] } = useOutletContext();
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null); // tracks which due is being paid
  const [payError, setPayError] = useState(null);

  // ── fetch dues ───────────────────────────────────────────
  const fetchDues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/maintenance/my-dues");
      setDues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load dues");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDues();
  }, [fetchDues]);

  // ── pay a due with Razorpay Payment Gateway ───────────────
  const handlePay = async (maintenanceId) => {
    setPayingId(maintenanceId);
    setPayError(null);
    try {
      // 1. Create Razorpay order on backend
      const { data } = await API.post("/transactions/create-order", { maintenanceId });

      if (!data.success) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      // Check if Razorpay Checkout script is loaded
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }

      // 2. Configure Razorpay checkout options
      const options = {
        key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh",

        amount: data.amount,
        currency: data.currency || "INR",
        name: "Society Management System",
        description: `${data.maintenance?.month || "Maintenance"} Dues Payment`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            setPayingId(maintenanceId);
            toast.loading("Verifying payment...", { id: "razorpay-verify" });
            
            // 3. Verify Razorpay payment signature on backend
            const verifyRes = await API.post("/transactions/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              maintenanceId: data.maintenance?._id || maintenanceId,

            });

            if (verifyRes.data.success) {
              toast.success("Payment successful & verified!", { id: "razorpay-verify" });
              await fetchDues();
              if (fetchDashboardData) fetchDashboardData();
              window.dispatchEvent(new CustomEvent("dues-updated"));
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed!", { id: "razorpay-verify" });
            }
          } catch (verifyErr) {
            const msg = verifyErr?.response?.data?.message || verifyErr.message || "Payment verification failed";
            toast.error(msg, { id: "razorpay-verify" });
            setPayError(msg);
          } finally {
            setPayingId(null);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || user?.mobile || "",
        },
        notes: {
          maintenanceId: maintenanceId,
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            setPayingId(null);
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setPayingId(null);
        toast.error(`Payment Failed: ${response.error?.description || "Transaction failed"}`);
      });
      razorpayInstance.open();
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Payment initiation failed";
      setPayError(message);
      toast.error(message);
      setPayingId(null);
    }
  };


  // ── pay ALL dues with Razorpay Payment Gateway ────────────
  const handlePayAll = async () => {
    if (unpaid.length === 0) return;
    setPayingId("ALL");
    setPayError(null);
    try {
      const maintenanceIds = unpaid.map((d) => d._id);
      const { data } = await API.post("/transactions/create-all-order", { maintenanceIds });

      if (!data.success) {
        throw new Error(data.message || "Failed to initialize bulk payment");
      }

      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK failed to load. Please refresh the page and try again.");
      }

      const options = {
        key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Society Management System",
        description: `Pay All Dues (${data.duesCount} Months)`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            setPayingId("ALL");
            toast.loading("Verifying total payment...", { id: "razorpay-verify" });

            const verifyRes = await API.post("/transactions/verify-all-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              maintenanceIds: data.maintenanceIds,
            });

            if (verifyRes.data.success) {
              toast.success("All dues paid & verified successfully!", { id: "razorpay-verify" });
              await fetchDues();
              if (fetchDashboardData) fetchDashboardData();
              window.dispatchEvent(new CustomEvent("dues-updated"));
            } else {
              toast.error(verifyRes.data.message || "Bulk payment verification failed!", { id: "razorpay-verify" });
            }
          } catch (verifyErr) {
            const msg = verifyErr?.response?.data?.message || verifyErr.message || "Payment verification failed";
            toast.error(msg, { id: "razorpay-verify" });
            setPayError(msg);
          } finally {
            setPayingId(null);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || user?.mobile || "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            setPayingId(null);
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        setPayingId(null);
        toast.error(`Payment Failed: ${response.error?.description || "Transaction failed"}`);
      });
      razorpayInstance.open();
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Payment initiation failed";
      setPayError(message);
      toast.error(message);
      setPayingId(null);
    }
  };

  // ── derived stats ────────────────────────────────────────
  const unpaid = dues.filter((d) => d.status !== "Paid");
  const paid = dues.filter((d) => d.status === "Paid");
  const totalUnpaid = unpaid.reduce((s, d) => s + (d.amount || 0), 0);
  const totalPaid = paid.reduce((s, d) => s + (d.amount || 0), 0);
  const monthlyDue = dues[0]?.amount ?? 0;

  // ── skeleton row ─────────────────────────────────────────
  const SkeletonRow = () => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-40 bg-slate-200 rounded" />
          <div className="h-2.5 w-28 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
    </div>
  );

  return (
    <>
        <div className="flex flex-col gap-4 sm:gap-6 pb-10">
          {/* ── Pay error toast ── */}
          {payError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center justify-between">
              <p className="text-sm text-red-600 font-medium">⚠️ {payError}</p>
              <button
                onClick={() => setPayError(null)}
                className="text-red-400 hover:text-red-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Pending Dues
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {loading ? "—" : `₹${totalUnpaid.toLocaleString("en-IN")}`}
                </p>
                <p className="text-xs text-amber-600 font-medium mt-1">
                  {loading ? "" : `${unpaid.length} month${unpaid.length !== 1 ? "s" : ""} unpaid`}
                </p>
              </div>

              {!loading && unpaid.length > 0 && (
                <button
                  onClick={handlePayAll}
                  disabled={payingId !== null}
                  className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl py-2.5 px-4 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {payingId === "ALL" ? "Processing…" : `💳 Pay All Dues (₹${totalUnpaid.toLocaleString("en-IN")})`}
                </button>
              )}
            </div>


            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Paid This Year
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : `₹${totalPaid.toLocaleString("en-IN")}`}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                {loading ? "" : `${paid.length} months paid`}
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Monthly Due
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? "—" : monthlyDue ? `₹${monthlyDue.toLocaleString("en-IN")}` : "—"}
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                Due on last day of month
              </p>
            </div>
          </div>

          {/* ── Unpaid banner (first unpaid/overdue due) ── */}
          {!loading && !error && unpaid.length > 0 && (
            <div
              className={`bg-white border rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-sm ${unpaid[0].status === "Overdue" ? "border-red-300" : "border-amber-300"
                }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500 text-xl">
                    {STATUS_ICON[unpaid[0].status] || "⚠️"}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">
                    {unpaid[0].month} —{" "}
                    {unpaid[0].status === "Overdue" ? "Payment Overdue" : "Payment Pending"}
                  </h3>
                </div>

                {/* Breakdown — render only if present */}
                {unpaid[0].breakdown?.length > 0 && (
                  <div className="flex gap-6 mb-4">
                    {unpaid[0].breakdown.map((b) => (
                      <div key={b.label}>
                        <p className="text-xs text-slate-400">{b.label}</p>
                        <p className="text-sm font-semibold text-slate-700">
                          ₹{b.amt.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  Due by{" "}
                  <strong className="text-amber-600">
                    {formatDueDate(unpaid[0].dueDate)}
                  </strong>
                </p>
              </div>

              <div className="text-left md:text-right shrink-0">
                <p className="text-3xl font-bold text-slate-800 mb-3">
                  ₹{(unpaid[0].amount || 0).toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => handlePay(unpaid[0]._id)}
                  disabled={payingId === unpaid[0]._id}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white font-semibold text-sm rounded-xl px-6 py-2.5"
                >
                  {payingId === unpaid[0]._id ? "Processing…" : "💳 Pay Now"}
                </button>
              </div>
            </div>
          )}

          {/* ── All dues list ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Monthly Due History
            </h3>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">

            {loading ? (
              <div className="flex flex-col">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm font-semibold text-slate-700">
                  Failed to load dues
                </p>
                <p className="text-xs text-slate-400 max-w-xs">{error}</p>
                <button
                  onClick={fetchDues}
                  className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            ) : dues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-semibold text-slate-700">
                  No dues found
                </p>
                <p className="text-xs text-slate-400">
                  Your maintenance records will appear here once created.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {dues.map((d, i) => {
                  const isPaid = d.status === "Paid";
                  const isPaying = payingId === d._id;

                  return (
                    <div
                      key={d._id}
                      className={`flex items-center justify-between py-4 ${i < dues.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                    >
                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${isPaid
                              ? "bg-green-50"
                              : d.status === "Overdue"
                                ? "bg-red-50"
                                : "bg-amber-50"
                            }`}
                        >
                          {STATUS_ICON[d.status] || "⏳"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {d.month} Maintenance
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {isPaid
                              ? `Paid on ${formatDate(d.paidAt)}`
                              : `Due by ${formatDueDate(d.dueDate)}`}
                          </p>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">
                          ₹{(d.amount || 0).toLocaleString("en-IN")}
                        </span>

                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_BADGE[d.status] || "bg-slate-100 text-slate-500"
                            }`}
                        >
                          {d.status}
                        </span>

                        {!isPaid && (
                          <button
                            onClick={() => handlePay(d._id)}
                            disabled={isPaying}
                            className="text-indigo-600 text-xs font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isPaying ? "Paying…" : "Pay →"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
              </div>
            </div>
          </div>
        </div>
    </>
  );
}