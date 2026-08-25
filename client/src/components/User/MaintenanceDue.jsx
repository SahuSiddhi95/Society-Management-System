import API from "../../api/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * MaintenanceDue — fetches and displays the current user's pending maintenance
 * dues from GET /api/maintenance/my-dues with direct Razorpay payment integration.
 */
export default function MaintenanceDue({ setActiveNav, user, dues: duesProp }) {
  const [fetchedDues, setFetchedDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const navigate = useNavigate();

  const fetchDues = async () => {
    try {
      setLoading(true);
      const res = await API.get("/maintenance/my-dues");
      const list = Array.isArray(res.data) ? res.data : res.data?.dues || [];
      // Only show pending / unpaid dues
      const pending = list.filter(
        (d) => d.status === "Pending" || d.status === "Unpaid" || d.status === "Overdue" || !d.status
      );
      setFetchedDues(pending);
    } catch (err) {
      setError("Could not load dues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!duesProp) fetchDues();
    else setLoading(false);
  }, [duesProp]);

  const dues = Array.isArray(duesProp)
    ? duesProp.filter((d) => d.status === "Pending" || d.status === "Unpaid" || d.status === "Overdue" || !d.status)
    : fetchedDues;


  const handlePayAll = async () => {
    if (dues.length === 0) return;

    setPayingId("ALL");
    try {
      const maintenanceIds = dues.map((d) => d._id);
      const { data } = await API.post("/transactions/create-all-order", { maintenanceIds });

      if (!data.success) {
        throw new Error(data.message || "Failed to initialize bulk payment");
      }

      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK failed to load. Please refresh the page.");
      }

      const options = {
        key: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TTxYjBQ1SKwckh",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Society Management System",
        description: `Pay All Pending Dues (${data.duesCount} Months)`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            setPayingId("ALL");
            toast.loading("Verifying payment...", { id: "razorpay-verify" });
            const verifyRes = await API.post("/transactions/verify-all-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              maintenanceIds: data.maintenanceIds,
            });

            if (verifyRes.data.success) {
              toast.success("All dues paid & verified successfully!", { id: "razorpay-verify" });
              fetchDues();
              window.dispatchEvent(new CustomEvent("dues-updated"));
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed!", { id: "razorpay-verify" });
            }
          } catch (verifyErr) {
            toast.error("Payment verification failed", { id: "razorpay-verify" });
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
      toast.error(err?.response?.data?.message || err.message || "Payment initiation failed");
      setPayingId(null);
    }
  };

  // Calculate total
  const total = dues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

  // Next due date from the earliest due
  const nextDue = dues
    .map((d) => d.dueDate)
    .filter(Boolean)
    .sort()
    .at(0);

  const nextDueStr = nextDue
    ? new Date(nextDue).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="col-span-2 relative bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 rounded-3xl p-7 flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
      {/* Decorative pulse glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-400/20 transition-all duration-700" />
      
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600/80">
          Maintenance Due
        </h3>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col gap-3 animate-pulse relative z-10 mt-2">
          <div className="h-10 w-32 rounded-lg bg-orange-200 mt-2" />
          <div className="h-4 w-40 rounded bg-orange-100" />
          <div className="border-t border-orange-200/50 pt-5 space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-28 rounded bg-orange-100" />
                <div className="h-3 w-16 rounded bg-orange-100" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-4 relative z-10">
          <p className="text-sm font-medium text-slate-500">{error}</p>
        </div>
      ) : dues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 gap-3 relative z-10">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl shadow-inner">
            ✅
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">All dues cleared!</p>
            <p className="text-sm text-slate-500 mt-1">No pending maintenance dues.</p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col flex-1">
          <p className="text-sm font-medium text-orange-700/70 mb-2">
            {dues[0]?.month
              ? `${dues[0].month} ${dues[0].year || ""}`
              : "Current Period"}
          </p>

          <div className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">
            {fmt(total)}
          </div>

          {nextDueStr && (
            <p className="text-sm font-medium text-slate-500 mb-6">
              Pay by{" "}
              <strong className="text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-md">{nextDueStr}</strong>
            </p>
          )}

          <div className="border-t border-orange-200/50 pt-5 flex flex-col gap-3 mb-6">
            {dues.slice(0, 4).map((d, i) => (
              <div key={d._id || i} className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium truncate max-w-[65%]">
                  {d.description || d.month || `Due #${i + 1}`}
                </span>
                <span className="text-slate-800 font-bold">{fmt(d.amount || 0)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handlePayAll}
            disabled={payingId !== null}
            className="mt-auto w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:opacity-60 transition-all text-white font-bold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-orange-500/40"
          >
            {payingId ? "Processing…" : `💳 Pay All Dues (${fmt(total)})`}
          </button>
        </div>
      )}
    </div>
  );

}