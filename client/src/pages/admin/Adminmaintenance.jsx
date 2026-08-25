import React, { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Bell, Sparkles, Trash2, X } from "lucide-react";

import API from "../../api/axios";

// Components
import MaintenanceStats from "../../components/Admin/Maintenancestats";
import GenerateMaintenanceForm from "../../components/Admin/Generatemaintenanceform";
import MaintenanceTable from "../../components/Admin/Maintenancetable";
import EditMaintenanceModal from "../../components/Admin/Editmaintenancemodal";
import RecordPaymentModal from "../../components/Admin/Recordpaymentmodal";

const AdminMaintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reminding, setReminding] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordingPayment, setRecordingPayment] = useState(null);

  // Bulk Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState("1Y"); // 1Y, 5Y, 10Y, CUSTOM
  const [delStartDate, setDelStartDate] = useState("");
  const [delEndDate, setDelEndDate] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  const { users } = useOutletContext(); // Get residents from the dashboard context

  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const fetchMaintenance = useCallback(async () => {
    setLoading(true);

    try {
      const res = await API.get("/maintenance");
      setMaintenance(res.data?.maintenance || res.data || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Failed to load maintenance records"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const handleSendReminders = async () => {
    if (!window.confirm("Are you sure you want to send reminders to all pending and overdue residents? This will consume SMS/Email quota.")) return;

    setReminding(true);
    try {
      const res = await API.post("/maintenance/send-reminders");
      if (res.data.success) {
        toast.success(`Reminders sent! Emails: ${res.data.emailsSent}, SMS: ${res.data.smsSent}, In-App: ${res.data.inAppSent}`);
      } else {
        toast.error("Failed to send reminders");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending reminders");
    } finally {
      setReminding(false);
    }
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

      const { data } = await API.delete("/maintenance/admin/delete-range", { data: payload });
      toast.success(data.message || "Maintenance records deleted successfully!");
      setShowDeleteModal(false);
      fetchMaintenance();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete maintenance records");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Financial Hub
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Maintenance Management
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
              Generate monthly dues, track payments, send multi-channel reminders, and clean historical records by date range.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              Delete by Range
            </button>

            <button
              onClick={handleSendReminders}
              disabled={reminding}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <Bell className={`w-4 h-4 text-amber-500 ${reminding ? "animate-pulse" : "group-hover:animate-[wiggle_1s_ease-in-out_infinite]"}`} />
              {reminding ? "Sending..." : "Send Reminders"}
            </button>

            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Generate Dues
            </button>
          </div>
        </div>
      </div>

      <MaintenanceStats
        maintenance={maintenance}
        loading={loading}
      />

      <div ref={formRef} className="scroll-mt-8">
        <GenerateMaintenanceForm
          onGenerated={fetchMaintenance}
          users={users}
        />
      </div>

      <MaintenanceTable
        maintenance={maintenance}
        loading={loading}
        onEdit={setEditingRecord}
        onRecordPayment={setRecordingPayment}
        onRefresh={fetchMaintenance}
      />

      {editingRecord && (
        <EditMaintenanceModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onUpdated={fetchMaintenance}
        />
      )}

      {recordingPayment && (
        <RecordPaymentModal
          record={recordingPayment}
          onClose={() => setRecordingPayment(null)}
          onUpdated={fetchMaintenance}
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
                <h3 className="font-bold text-lg text-gray-800">Delete Maintenance Records</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Select date range criterion to permanently delete maintenance records:
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
                    name="maintDelOpt"
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
  );

};

export default AdminMaintenance;
