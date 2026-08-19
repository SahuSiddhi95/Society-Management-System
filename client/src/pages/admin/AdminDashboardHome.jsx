import React from "react";
import { useOutletContext } from "react-router-dom";
import HeroBanner from "../../components/Admin/HeroBanner";
import StatCards from "../../components/Admin/StatCard";
import MaintenanceDue from "../../components/Admin/MaintenanceDue";
import ComplaintStatusCard from "../../components/Admin/ComplaintStatusCard";

export default function AdminDashboardHome() {
  const { users, stats } = useOutletContext();

  return (
    <div className="space-y-6">
      <HeroBanner users={users} stats={stats} />

      <StatCards
        stats={stats}
        users={users}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ComplaintStatusCard />
        <MaintenanceDue stats={stats} />
      </div>
    </div>
  );
}
