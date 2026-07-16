import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../src/components/Admin/Sidebar";
import Topbar from "../src/components/Admin/Topbar";

import { getAllUsers } from "../api/Admin/userApi";

export default function AdminLayout() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />

      <div className="ml-56 flex-1 flex flex-col">
        <Topbar users={users} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}