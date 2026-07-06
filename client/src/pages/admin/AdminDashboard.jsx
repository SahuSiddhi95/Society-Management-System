import { useState ,useEffect} from "react";
import Sidebar               from "../../components/Admin/Sidebar";
import Topbar                from "../../components/Admin/Topbar";
import HeroBanner            from "../../components/Admin/HeroBanner";
import StatCards             from "../../components/Admin/StatCard";
import MaintenanceDue        from "../../components/Admin/MaintenanceDue";
import ComplaintStatusCard   from "../../components/Admin/ComplaintStatusCard";
import PlaceholderPage       from "../../components/Admin/shared/PlaceholderPage";

// /Api
 import { getAllUsers } from "../../api/Admin/userApi";
import Residents from "./AllResident";
import EventManagement from "./EventManagement";
import ComplaintManagement from "./Complaintmanagement";
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
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
  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return (
          <>
            <HeroBanner users={users}/>
            <StatCards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
              <ComplaintStatusCard />
              <MaintenanceDue />
            </div>
          </>
        );
      case "Residents":   return <Residents/> ;
      case "Complaints":  return <ComplaintManagement users={users}/>;
      case "maintenance": return <PlaceholderPage title="Maintenance" />;
      case "Events":      return <EventManagement/>;
      case "notices":     return <PlaceholderPage title="Notices" />;
      case "payment":     return <PlaceholderPage title="Payment History" />;
      default:            return <PlaceholderPage title={active} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar active={active} setActive={setActive} />
      <div className="ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}