import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";
import { getDashboardStats } from "../../api/Admin/dashboardApi";
import { getAllUsers } from "../../api/Admin/userApi";

export default function AdminDashboard() {
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar users={users} />

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <Outlet context={{ users, stats, setUsers, setStats }} />
        </main>
      </div>
    </div>
  );
}     