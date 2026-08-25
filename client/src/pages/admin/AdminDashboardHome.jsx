import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import HeroBanner from "../../components/Admin/HeroBanner";
import StatCards from "../../components/Admin/StatCard";
import MaintenanceDue from "../../components/Admin/MaintenanceDue";
import ComplaintStatusCard from "../../components/Admin/ComplaintStatusCard";
import API from "../../api/axios";

export default function AdminDashboardHome() {
  const { users, stats, society } = useOutletContext();
  const [timeRange, setTimeRange] = useState("ALL"); // ALL, THIS_MONTH, 1Y, 5Y, 10Y, CUSTOM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [maintenanceList, setMaintenanceList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [mRes, tRes] = await Promise.all([
          API.get("/maintenance").catch(() => ({ data: [] })),
          API.get("/transactions/admin/transactions").catch(() => ({ data: [] })),
        ]);
        setMaintenanceList(Array.isArray(mRes.data) ? mRes.data : mRes.data?.maintenance || []);
        setTransactionsList(Array.isArray(tRes.data) ? tRes.data : []);
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      }
    };
    loadAllData();
  }, []);

  // Filter items by timeRange
  const filterItemByRange = (item, dateKey = "createdAt") => {
    if (timeRange === "ALL") return true;
    const dateVal = item[dateKey] || item.createdAt || item.date || item.paidAt;
    if (!dateVal) return true;
    const d = new Date(dateVal);
    const now = new Date();
    let minDate = null;
    if (timeRange === "THIS_MONTH") minDate = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (timeRange === "1Y") { minDate = new Date(); minDate.setFullYear(minDate.getFullYear() - 1); }
    else if (timeRange === "5Y") { minDate = new Date(); minDate.setFullYear(minDate.getFullYear() - 5); }
    else if (timeRange === "10Y") { minDate = new Date(); minDate.setFullYear(minDate.getFullYear() - 10); }

    if (timeRange === "CUSTOM") {
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate + "T23:59:59.999Z")) return false;
      return true;
    }
    return minDate ? d >= minDate : true;
  };

  const filteredMaint = maintenanceList.filter((m) => filterItemByRange(m, "createdAt"));
  const filteredTxns = transactionsList.filter((t) => filterItemByRange(t, "createdAt"));

  const filteredCollected = filteredTxns
    .filter((t) => t.status === "paid" || t.status === "Paid" || t.status === "Success")
    .reduce((sum, t) => sum + (t.amount || 0), 0) ||
    filteredMaint
      .filter((m) => m.status === "Paid")
      .reduce((sum, m) => sum + (m.amount || 0), 0);

  const filteredPendingDues = filteredMaint.filter((m) => m.status !== "Paid");
  const filteredPendingAmount = filteredPendingDues.reduce((sum, m) => sum + (m.amount || 0), 0);
  const defaulterFlats = new Set(filteredPendingDues.map((m) => m.resident?._id || m.resident)).size;

  const dynamicStats = {
    ...stats,
    maintenanceCollected: (timeRange === "ALL" && !filteredCollected && stats?.maintenanceCollected)
      ? stats.maintenanceCollected
      : filteredCollected,
    pendingPayments: (timeRange === "ALL" && !filteredPendingAmount && stats?.pendingPayments)
      ? stats.pendingPayments
      : filteredPendingAmount,
    defaulters: defaulterFlats || stats?.defaulters || 0,
  };

  return (
    <div className="space-y-6">
      <HeroBanner users={users} stats={dynamicStats} society={society} />

      {/* Analytics Date Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 mr-2">
            📊 Home Screen Analytics Filter:
          </span>
          {[
            { id: "ALL", label: "All Time" },
            { id: "THIS_MONTH", label: "This Month" },
            { id: "1Y", label: "1 Year" },
            { id: "5Y", label: "5 Years" },
            { id: "10Y", label: "10 Years" },
            { id: "CUSTOM", label: "Custom Range" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimeRange(btn.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                timeRange === btn.id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {timeRange === "CUSTOM" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-gray-400 font-bold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <StatCards
        stats={dynamicStats}
        users={users}
        timeRange={timeRange}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ComplaintStatusCard timeRange={timeRange} startDate={startDate} endDate={endDate} />
        <MaintenanceDue stats={dynamicStats} timeRange={timeRange} />
      </div>
    </div>
  );
}


