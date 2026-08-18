import { useState, useEffect } from "react";

import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";
import HeroBanner from "../../components/Admin/HeroBanner";
import StatCards from "../../components/Admin/StatCard";
import MaintenanceDue from "../../components/Admin/MaintenanceDue";
import ComplaintStatusCard from "../../components/Admin/ComplaintStatusCard";
import PlaceholderPage from "../../components/Admin/shared/PlaceholderPage";
import { getDashboardStats } from "../../api/Admin/dashboardApi";
import Residents from "./AllResident";
import EventManagement from "./EventManagement";
import ComplaintManagement from "./Complaintmanagement";
import AdminMaintenance from "./Adminmaintenance";
import NotificationPage from "./Notificationpage";
import NoticeManagementPage from "./Noticemanagement";

import { getAllUsers } from "../../api/Admin/userApi";
import PaymentHistory from "./PaymentHistory";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalFlats: 0,
    occupiedFlats: 0,
    vacantFlats: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersData = await getAllUsers();
        const statsData = await getDashboardStats();

        setUsers(usersData);
        // Merge with defaults so fields absent from the API
        // (occupiedFlats, vacantFlats, etc.) are never undefined
        setStats((prev) => ({ ...prev, ...statsData }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================
  // PAGE NAVIGATION
  // ==========================

  if (active === "Residents") {
    return (
      <Residents
        active={active}
        setActive={setActive}
        users={users}
      />
    );
  }

  if (active === "Complaints") {
    return (
      <ComplaintManagement
        active={active}
        setActive={setActive}
        users={users}
      />
    );
  }

  if (active === "maintenance") {
    return (
      <AdminMaintenance
        active={active}
        setActive={setActive}
      />
    );
  }

  if (active === "Events") {
    return (
      <EventManagement
        active={active}
        setActive={setActive}
      />
    );
  }

  if (active === "notices") {
    return (
      <NoticeManagementPage
        active={active}
        setActive={setActive}
        users={users}
      />
    );
  }

  if (active === "notification") {
    return (
      <NotificationPage
        active={active}
        setActive={setActive}
      />
    );
  }

  if (active === "history") {
    return (
      <PaymentHistory
        active={active}
        setActive={setActive}
      />
    );
  }

  // ==========================
  // DASHBOARD
  // ==========================

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

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <HeroBanner users={users} stats={stats} />

          <StatCards
            stats={stats}
            users={users}
            setActive={setActive}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
            <ComplaintStatusCard />
            <MaintenanceDue />
          </div>
        </main>
      </div>
    </div>
  );
}     