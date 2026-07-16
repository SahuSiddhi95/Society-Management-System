import React, { useCallback, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

import API from "../../api/axios";

// Layout
import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";

// Components
import MaintenanceStats from "../../components/Admin/Maintenancestats";
import GenerateMaintenanceForm from "../../components/Admin/Generatemaintenanceform";
import MaintenanceTable from "../../components/Admin/Maintenancetable";
import EditMaintenanceModal from "../../components/Admin/Editmaintenancemodal";

const AdminMaintenance = ({ active, setActive, users }) => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

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

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
      />

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar
          users={users}
          setActive={setActive}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Maintenance Management
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Generate and manage monthly maintenance dues for all residents.
              </p>
            </div>

            <button
              onClick={scrollToForm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Generate Dues
            </button>
          </div>

          <MaintenanceStats
            maintenance={maintenance}
            loading={loading}
          />

          <div ref={formRef}>
            <GenerateMaintenanceForm
              onGenerated={fetchMaintenance}
            />
          </div>

          <MaintenanceTable
            maintenance={maintenance}
            loading={loading}
            onEdit={setEditingRecord}
            onRefresh={fetchMaintenance}
          />

          {editingRecord && (
            <EditMaintenanceModal
              record={editingRecord}
              onClose={() => setEditingRecord(null)}
              onUpdated={fetchMaintenance}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminMaintenance;