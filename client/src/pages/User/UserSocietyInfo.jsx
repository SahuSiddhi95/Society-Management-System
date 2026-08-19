import React, { useState, useEffect } from "react";
import { getSocietyConfig } from "../../api/Admin/societyApi";

export default function UserSocietyInfo({ type }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getSocietyConfig();
        setConfig(data);
      } catch (error) {
        console.error("Failed to load society config");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Loading information...</p>
      </div>
    );
  }

  if (!config) {
    return <p className="text-gray-500 p-4">Information unavailable.</p>;
  }

  const renderEmergency = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Emergency Contacts</h1>
        <p className="text-sm text-gray-500 mt-1">Important numbers for your society.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl mb-4">
            🚨
          </div>
          <p className="text-sm font-bold text-rose-900 uppercase tracking-wider mb-1">Emergency Help</p>
          <p className="text-2xl font-black text-rose-600">{config.emergencyContact || "Not Set"}</p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl mb-4">
            🛡️
          </div>
          <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-1">Security Gate</p>
          <p className="text-2xl font-black text-indigo-600">{config.securityContact || "Not Set"}</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center sm:col-span-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">
            📞
          </div>
          <p className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-1">Society Office</p>
          <p className="text-xl font-bold text-emerald-600">{config.contactNumber || "Not Set"}</p>
          <p className="text-sm font-medium text-emerald-700 mt-1">{config.contactEmail || "Not Set"}</p>
          <p className="text-xs font-semibold text-emerald-600/70 mt-3 bg-emerald-100/50 px-3 py-1 rounded-full">
            Timing: {config.officeTiming || "Not Set"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Maintenance Details</h1>
        <p className="text-sm text-gray-500 mt-1">Your society's maintenance configuration.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Financial Rules</h2>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="flex-1 text-center py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Monthly Amount</p>
            <p className="text-4xl font-black text-gray-900">₹{config.maintenanceAmount?.toLocaleString() || "0"}</p>
          </div>
          <div className="flex-1 text-center py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Due Date</p>
            <p className="text-4xl font-black text-indigo-600">{config.maintenanceDueDay || "1"}st</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">of every month</p>
          </div>
        </div>
      </div>
    </div>
  );

  return type === "emergency" ? renderEmergency() : renderMaintenance();
}
