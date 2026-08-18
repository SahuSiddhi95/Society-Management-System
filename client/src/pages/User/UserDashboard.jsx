// pages/User/UserDashboard.jsx

import { useState, useEffect } from "react";

import Sidebar from "../../components/User/Sidebar";
import Topbar from "../../components/User/Topbar";
import WelcomeBanner from "../../components/User/WelcomeBanner";
import StatCards from "../../components/User/StatCards";
import RecentNotices from "../../components/User/RecentNotices";
import MaintenanceDue from "../../components/User/MaintenanceDue";
import MyComplaints from "../../components/User/MyComplaints";
import PaymentHistoryCard from "../../components/User/PaymentHistoryCard";
import API from "../../api/axios";
import Notices from "./Notices";
import Complaints from "./Complaints";
import MyDues from "./Mydues";
import PaymentHistory from "./Paymenthistory";
import Event from "./Event";
import Notifications from "./Notifications";

// API helpers
import { getMyComplaints } from "../../api/complaintApi";
import { getUserDetails } from "../../api/userApi";
import { getAllNotices } from "../../api/noticeApi";
import { getAllEvents } from "../../api/Admin/Eventapi";

export default function SocietyDashboard() {
  // SPA navigation state
  const [activeNav, setActiveNav] = useState("dashboard");

  // Data states
  const [complaints, setComplaints] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashError, setDashError] = useState(null);

  // ── Fetch notices separately (they don't change often) ──────────────────
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllNotices();
        const latest = (Array.isArray(data) ? data : data?.notices || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentNotices(latest);
      } catch (err) {
        console.error("Notices fetch failed:", err?.response?.data || err.message);
      }
    };
    fetchNotices();
  }, []);

  // ── Fetch core dashboard data ────────────────────────────────────────────
  const fetchDashboardData = async () => {
    setLoading(true);
    setDashError(null);
    try {
      const [complaintData, userData, eventData, transactionRes, duesRes] =
        await Promise.all([
          getMyComplaints().catch((err) => { console.error("Complaints load failed:", err); return []; }),
          getUserDetails().catch((err) => { console.error("User details load failed:", err); return null; }),
          getAllEvents().catch((err) => { console.error("Events load failed:", err); return []; }),
          API.get("/transactions/my-transactions").catch((err) => { console.error("Transactions load failed:", err); return { data: [] }; }),
          API.get("/maintenance/my-dues").catch((err) => { console.error("Dues load failed:", err); return { data: [] }; }),
        ]);

      setComplaints(Array.isArray(complaintData) ? complaintData : []);
      setUser(userData || null);
      setEvents(Array.isArray(eventData) ? eventData : []);

      // Normalize transaction data — handle { data: [...] } or raw array
      const txList = transactionRes?.data?.data || transactionRes?.data || [];
      setTransactions(Array.isArray(txList) ? txList : []);

      // Normalize dues list data
      const duesList = duesRes?.data?.data || duesRes?.data || [];
      setDues(Array.isArray(duesList) ? duesList : []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err?.response?.data || err.message);
      setDashError("Failed to load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading Screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // ── Error Screen ─────────────────────────────────────────────────────────
  if (dashError) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-base font-bold text-slate-800">
            Something went wrong
          </p>
          <p className="text-sm text-slate-500">{dashError}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Page Routes (SPA navigation) ─────────────────────────────────────────

  // Shared props passed to every sub-page
  const sharedProps = {
    activeNav,
    setActiveNav,
    user,
    complaints,
    fetchDashboardData,
    recentNotices,
    events,
    dues,
    transactions,
  };

  if (activeNav === "notices") return <Notices {...sharedProps} />;
  if (activeNav === "notification") return <Notifications {...sharedProps} />;
  if (activeNav === "complaint") return <Complaints {...sharedProps} />;
  if (activeNav === "dues") return <MyDues {...sharedProps} />;
  if (activeNav === "history") return <PaymentHistory {...sharedProps} />;
  if (activeNav === "events") return <Event {...sharedProps} events={events} />;

  // ── Dashboard UI ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={complaints}
        recentNotices={recentNotices}
        events={events}
        dues={dues}
        transactions={transactions}
      />

      {/* Main */}
      <div className="md:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar with setActiveNav so bell "View all" navigates correctly */}
        <Topbar user={user} setActiveNav={setActiveNav} />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 lg:gap-6">
          {/* Welcome Banner */}
          <WelcomeBanner user={user} complaints={complaints} />

          {/* Stats — passes real dues + transaction data */}
          <StatCards
            complaints={complaints}
            setActiveNav={setActiveNav}
            recentNotices={recentNotices}
            transactions={transactions}
            dues={dues}
          />

          {/* Notices + Maintenance Due */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
            <RecentNotices
              complaints={complaints}
              recentNotices={recentNotices}
              setActiveNav={setActiveNav}
            />
            {/* MaintenanceDue fetches its own data internally */}
            <MaintenanceDue setActiveNav={setActiveNav} />
          </div>

          {/* Complaints + Payment History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <MyComplaints
              complaints={complaints}
              setActiveNav={setActiveNav}
            />
            <PaymentHistoryCard
              setActiveNav={setActiveNav}
              transactions={transactions}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
