import React from "react";
import { useOutletContext } from "react-router-dom";
import WelcomeBanner from "../../components/User/WelcomeBanner";
import StatCards from "../../components/User/StatCards";
import RecentNotices from "../../components/User/RecentNotices";
import MaintenanceDue from "../../components/User/MaintenanceDue";
import MyComplaints from "../../components/User/MyComplaints";
import PaymentHistoryCard from "../../components/User/PaymentHistoryCard";

export default function UserDashboardHome() {
  const { user, complaints, recentNotices, transactions, dues, society } = useOutletContext();

  return (
    <>
      {/* Welcome Banner */}
      <WelcomeBanner user={user} complaints={complaints} society={society} />

      {/* Stats — passes real dues + transaction data */}
      <StatCards
        complaints={complaints}
        recentNotices={recentNotices}
        transactions={transactions}
        dues={dues}
      />

      {/* Notices + Maintenance Due */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
        <RecentNotices
          complaints={complaints}
          recentNotices={recentNotices}
        />
        {/* MaintenanceDue fetches its own data internally */}
        <MaintenanceDue />
      </div>

      {/* Complaints + Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <MyComplaints
          complaints={complaints}
        />
        <PaymentHistoryCard
          transactions={transactions}
        />
      </div>
    </>
  );
}
