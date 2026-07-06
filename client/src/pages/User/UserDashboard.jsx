// pages/User/SocietyDashboard.jsx

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
// APIs
import { getMyComplaints } from "../../api/complaintApi";
import { getUserDetails } from "../../api/userApi";
import { getAllNotices } from "../../api/noticeApi";
import { getAllEvents } from "../../api/Admin/Eventapi";
export default function SocietyDashboard() {
  // Navigation
  const [activeNav, setActiveNav] = useState("dashboard");

  // States
  const [complaints, setComplaints] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
 const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllNotices();

        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentNotices(latest);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotices();
  }, []);
  // Fetch Dashboard Data
const fetchDashboardData = async () => {
  try {
    const [
      complaintData,
      userData,
      eventData,
      transactionResponse,
    ] = await Promise.all([
      getMyComplaints(),
      getUserDetails(),
      getAllEvents(),
      API.get("/transactions/my-transactions"),
    ]);

    setComplaints(complaintData || []);
    setUser(userData);
    setEvents(eventData || []);

    // Transaction History
    setTransactions(transactionResponse.data || []);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
  // Load Dashboard
  useEffect(() => {
  fetchDashboardData();
}, []);
  // Loading Screen
  if (loading) {
    return (
      <div >
        Loading Dashboard...
      </div>
    );
  }

  // =========================
  // PAGE ROUTES
  // =========================

  // Notices Page
  if (activeNav === "notices") {
    return (
      <Notices activeNav={activeNav} setActiveNav={setActiveNav} user={user} 
        complaints={complaints} recentNotices={recentNotices}
      />
    );
  }
  // Notices Page
  if (activeNav === "notification") {
    return (
      <Notifications 
      activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Refresh Dashboard
       complaints={complaints}
      fetchDashboardData={fetchDashboardData}
      recentNotices={recentNotices}
      />
    );
  }

  // Complaints Page
  if (activeNav === "complaint") {
    return (
      <Complaints
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Refresh Dashboard
       complaints={complaints}
      fetchDashboardData={fetchDashboardData}
      recentNotices={recentNotices}
      />
    );
  }

  // Dues Page
  if (activeNav === "dues") {
    return (
      <MyDues 
       activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Refresh Dashboard
       complaints={complaints}
      fetchDashboardData={fetchDashboardData}
      recentNotices={recentNotices}
      />
    );
  }

  // Payment History Page
  if (activeNav === "history") {
    return (
      <PaymentHistory
         activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Refresh Dashboard
       complaints={complaints}
      fetchDashboardData={fetchDashboardData}
      recentNotices={recentNotices}
     

      />
    );
  }
   // Payment History Page
  if (activeNav === "events") {
    return (
      <Event
         activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Refresh Dashboard
       complaints={complaints}
      fetchDashboardData={fetchDashboardData}
      recentNotices={recentNotices}
      events={events}
      />
    );
  }

  // =========================
  // DASHBOARD UI
  // =========================
 

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        // Add These
        complaints={complaints}
        recentNotices={recentNotices}
      />

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar user={user} />

        {/* Content */}
        <main className="p-8 flex flex-col gap-6">
          {/* Welcome Banner */}
          <WelcomeBanner user={user} complaints={complaints} />

          {/* Stats */}
          <StatCards complaints={complaints} setActiveNav={setActiveNav} recentNotices={recentNotices}/>

          {/* Notices + Maintenance */}
          <div className="grid grid-cols-5 gap-4">
            <RecentNotices
              complaints={complaints}
              recentNotices={recentNotices}
              setActiveNav={setActiveNav}
            />
            <MaintenanceDue />
          </div>

          {/* Complaints + Payment */}
          <div className="grid grid-cols-2 gap-4">
            <MyComplaints complaints={complaints} setActiveNav={setActiveNav} />

            <PaymentHistoryCard setActiveNav={setActiveNav}  transactions={transactions}/>
          </div>
        </main>
      </div>
    </div>
  );
}
