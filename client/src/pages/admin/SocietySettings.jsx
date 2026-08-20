import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getSocietyConfig, updateSocietyConfig } from "../../api/Admin/societyApi";
import { toast } from "react-hot-toast";

export default function SocietySettings() {
  const { setSociety } = useOutletContext();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await getSocietyConfig();
      setConfig(data);
      setFormData(data);
    } catch (error) {
      toast.error("Failed to load society configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateSocietyConfig(formData);
      setConfig(updated);
      setFormData(updated);
      if (setSociety) setSociety(updated);
      setEditMode(false);
      toast.success("Society configuration updated successfully.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Occupied Flats", value: config?.occupiedFlats ?? 0, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Vacant Flats", value: config?.vacantFlats ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Residents", value: config?.totalResidents ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const editableFields = [
    { name: "societyName", label: "Society Name", type: "text" },
    { name: "logo", label: "Logo URL", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "contactNumber", label: "Contact Number", type: "text" },
    { name: "contactEmail", label: "Contact Email", type: "email" },
    { name: "totalWings", label: "Total Wings", type: "number" },
    { name: "totalFloors", label: "Total Floors", type: "number" },
    { name: "totalFlats", label: "Total Flats", type: "number" },
    { name: "maintenanceAmount", label: "Monthly Maintenance Amount", type: "number" },
    { name: "maintenanceDueDay", label: "Maintenance Due Day", type: "number" },
    { name: "emergencyContact", label: "Emergency Contact", type: "text" },
    { name: "securityContact", label: "Security Contact", type: "text" },
    { name: "officeTiming", label: "Office Timing", type: "text" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Edit Details</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global society configuration and statistics.</p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-colors shadow-sm"
          >
            Edit Settings
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(config); // Reset
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${stat.bg} ${stat.color}`}>
              {stat.value}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Society Information Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Society Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          {editableFields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                {field.label}
              </label>
              {editMode ? (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-gray-50 focus:bg-white"
                />
              ) : (
                <div className="px-4 py-2.5 rounded-xl border border-transparent bg-gray-50 text-sm font-semibold text-gray-800">
                  {config[field.name] || <span className="text-gray-400 font-normal">Not Set</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
