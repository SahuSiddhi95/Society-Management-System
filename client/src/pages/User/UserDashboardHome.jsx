import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import WelcomeBanner from "../../components/User/WelcomeBanner";
import StatCards from "../../components/User/StatCards";
import RecentNotices from "../../components/User/RecentNotices";
import MaintenanceDue from "../../components/User/MaintenanceDue";
import MyComplaints from "../../components/User/MyComplaints";
import PaymentHistoryCard from "../../components/User/PaymentHistoryCard";

function filterByDateRange(items = [], dateField = "createdAt", range = "ALL", start = "", end = "") {
  if (!Array.isArray(items) || range === "ALL") return items;

  const now = new Date();
  let minDate = null;

  if (range === "THIS_MONTH") {
    minDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (range === "1Y") {
    minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
  } else if (range === "5Y") {
    minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 5);
  } else if (range === "10Y") {
    minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 10);
  }

  return items.filter((item) => {
    const itemDateVal = item[dateField] || item.createdAt || item.date || item.paidAt;
    if (!itemDateVal) return true;
    const d = new Date(itemDateVal);

    if (range === "CUSTOM") {
      if (start && d < new Date(start)) return false;
      if (end && d > new Date(end + "T23:59:59.999Z")) return false;
      return true;
    }

    return minDate ? d >= minDate : true;
  });
}

export default function UserDashboardHome() {
  const { user, complaints = [], recentNotices = [], transactions = [], dues = [], society } = useOutletContext();

  const [timeRange, setTimeRange] = useState("ALL"); // ALL, THIS_MONTH, 1Y, 5Y, 10Y, CUSTOM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = filterByDateRange(transactions, "createdAt", timeRange, startDate, endDate);
  const filteredComplaints = filterByDateRange(complaints, "createdAt", timeRange, startDate, endDate);
  const filteredNotices = filterByDateRange(recentNotices, "createdAt", timeRange, startDate, endDate);
  const filteredDues = filterByDateRange(dues, "createdAt", timeRange, startDate, endDate);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} complaints={filteredComplaints} society={society} />

      {/* Analytics Date Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-2">
            📊 Analytics Filter:
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
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400 font-bold">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Stats — passes filtered dues + transaction data */}
      <StatCards
        complaints={filteredComplaints}
        recentNotices={filteredNotices}
        transactions={filteredTransactions}
        dues={filteredDues}
        timeRange={timeRange}
      />

      {/* Notices + Maintenance Due */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
        <RecentNotices
          complaints={filteredComplaints}
          recentNotices={filteredNotices}
        />
        {/* MaintenanceDue receives filtered dues */}
        <MaintenanceDue user={user} dues={filteredDues} />

      </div>

      {/* Complaints + Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <MyComplaints
          complaints={filteredComplaints}
        />
        <PaymentHistoryCard
          transactions={filteredTransactions}
        />
      </div>
    </div>
  );
}

