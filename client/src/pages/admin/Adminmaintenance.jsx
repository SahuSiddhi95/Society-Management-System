import React, { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Bell, Sparkles } from "lucide-react";

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
              Generate monthly dues, track payments, and send multi-channel reminders to ensure your society stays financially healthy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
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
    </div>
  );
};

export default AdminMaintenance;
