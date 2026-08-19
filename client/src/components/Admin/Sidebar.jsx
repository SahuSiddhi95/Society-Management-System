import { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Icon from "./shared/Icon";
import useNotifications from "../../hooks/useNotifications";
import API from "../../api/axios";

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  residents: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  notice: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8 M8 9h2",
  complaint: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  maintenance: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  events: "M8 2v4 M16 2v4 M3 10h18 M5 22h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
  payment: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  // Feather "log-out" — door + arrow, combined into one path so it
  // works with this Icon component's single-`d` stroke rendering.
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  // Feather "more-vertical" — three dots, used as the dropdown trigger
  menu: "M11,5 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0 M11,12 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0 M11,19 a1,1 0 1,0 2,0 a1,1 0 1,0 -2,0",
  // Bell — same path used by the Topbar notification bell, so both
  // stay visually identical.
  notification: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

const navItems = [
  { label: "Dashboard", icon: icons.dashboard, key: "dashboard", path: "/admin-dashboard" },
  { label: "Residents", icon: icons.residents, key: "Residents", path: "/admin-dashboard/residents" },
  { label: "Complaints", icon: icons.complaint, key: "Complaints", path: "/admin-dashboard/complaints" },
  { label: "Maintenance", icon: icons.maintenance, key: "maintenance", path: "/admin-dashboard/maintenance" },
  { label: "Events", icon: icons.events, key: "Events", path: "/admin-dashboard/events" },
  { label: "Notices", icon: icons.notice, key: "notices", path: "/admin-dashboard/notices" },
  { label: "Notifications", icon: icons.notification, key: "notification", path: "/admin-dashboard/notifications" },
];

const finItems = [
  { label: "Payment History", icon: icons.payment, key: "history", path: "/admin-dashboard/payment-history" },
];

export default function Sidebar({ admin = {}, isMobileOpen, onCloseMobile }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  // Dynamic counts for sidebar navigation
  const [residentsCount, setResidentsCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [noticesCount, setNoticesCount] = useState(0);

  useEffect(() => {
    const fetchSidebarCounts = async () => {
      try {
        const [residentsRes, complaintsRes, maintenanceRes, eventsRes, noticesRes] = await Promise.all([
          API.get("/admin/users").catch(() => ({ data: [] })),
          API.get("/complaints").catch(() => ({ data: { total: 0 } })),
          API.get("/maintenance").catch(() => ({ data: [] })),
          API.get("/events").catch(() => ({ data: [] })),
          API.get("/adminNotic").catch(() => ({ data: { data: [] } })),
        ]);

        const residentsList = residentsRes.data || [];
        setResidentsCount(residentsList.filter(u => u.role === "user").length || residentsList.length);

        const complaintsList = complaintsRes.data?.complaints || [];
        const pendingComplaints = complaintsList.filter(c => c.status?.toLowerCase() === "pending");
        setComplaintsCount(pendingComplaints.length);

        const maintenanceList = maintenanceRes.data || [];
        const pendingMaintenance = maintenanceList.filter(m => m.status === "Pending" || m.status === "Overdue");
        setMaintenanceCount(pendingMaintenance.length);

        const eventsList = eventsRes.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingEvents = eventsList.filter(e => new Date(e.date) >= today);
        setEventsCount(upcomingEvents.length);

        const noticesList = noticesRes.data?.data || noticesRes.data || [];
        setNoticesCount(noticesList.length);
      } catch (err) {
        console.error("Error fetching admin sidebar counts:", err);
      }
    };

    fetchSidebarCounts();
  }, []);

  const adminName = admin?.name || "Admin";
  const societyName = admin?.society || "Shree Ram Residency";
  const initials =
    adminName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown with Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Drives the enter/exit transition for the logout confirm modal
  useEffect(() => {
    if (confirmOpen) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setModalVisible(false);
  }, [confirmOpen]);

  // Close modal with Escape
  useEffect(() => {
    if (!confirmOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setConfirmOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={onCloseMobile}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-screen w-56 bg-[#3b3fa5] flex flex-col z-30 overflow-hidden transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Scoped custom scrollbar for the nav section only.
            Kept as a single inline <style> block instead of a global
            stylesheet edit so this component stays self-contained. */}
        <style>{`
          .sidebar-nav-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.28) transparent;
            overscroll-behavior: contain;
          }
          .sidebar-nav-scroll::-webkit-scrollbar {
            width: 6px;
            height: 0;
          }
          .sidebar-nav-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-nav-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.28);
            border-radius: 9999px;
          }
          .sidebar-nav-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.48);
          }
          .sidebar-nav-scroll::-webkit-scrollbar-corner {
            background: transparent;
          }
        `}</style>

        {/* Logo — pinned, never scrolls */}
        <div className="flex items-center justify-between px-5 py-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SocietyOS</span>
          </div>
          {/* Close button for mobile */}
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={onCloseMobile}
          >
            <Icon d="M18 6L6 18 M6 6l12 12" size={24} color="currentColor" />
          </button>
        </div>

        <nav
          className="sidebar-nav-scroll flex-1 min-h-0 px-3 overflow-y-auto overflow-x-hidden scroll-smooth focus:outline-none"
          tabIndex={0}
        >
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
            Main
          </p>
          {navItems.map((item) => {
            let badgeValue = 0;
            if (item.key === "Residents") badgeValue = residentsCount;
            else if (item.key === "Complaints") badgeValue = complaintsCount;
            else if (item.key === "maintenance") badgeValue = maintenanceCount;
            else if (item.key === "Events") badgeValue = eventsCount;
            else if (item.key === "notices") badgeValue = noticesCount;
            else if (item.key === "notification") badgeValue = unreadCount;

            const isActive = location.pathname === item.path || (item.path === "/admin-dashboard" && location.pathname === "/admin-dashboard/");

            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all
                  ${isActive ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <span className="flex items-center gap-3">
                  <Icon d={item.icon} size={16} color="currentColor" />
                  {item.label}
                </span>
                {badgeValue > 0 && (
                  <span className="bg-orange-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {badgeValue > 9 ? "9+" : badgeValue}
                  </span>
                )}
              </Link>
            );
          })}

          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2 mt-5">
            Financials
          </p>
          {finItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => onCloseMobile && onCloseMobile()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all
                  ${isActive ? "bg-white/15 text-white" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <Icon d={item.icon} size={16} color="currentColor" />
                {item.label}
              </Link>
            );
          })}

          {/* Bottom breathing room so the last item never sits flush
              against the scroll edge. */}
          <div className="h-2" aria-hidden="true" />
        </nav>

        {/* User + Dropdown — pinned, never scrolls */}
        <div className="relative px-3 pb-5 shrink-0" ref={ref}>
          {/* Dropdown — floating glass card above the user row.
              Always mounted, animated via opacity/scale/translate so
              both open and close transition smoothly. */}
          <div
            className={`absolute bottom-full left-3 right-3 mb-2 origin-bottom transition-all duration-200 ease-out ${open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              }`}
            aria-hidden={!open}
          >
            <div className="bg-white/95 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/60 ring-1 ring-black/5 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.25)] overflow-hidden">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gradient-to-br from-indigo-50/70 to-transparent">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {adminName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {societyName}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    onCloseMobile && onCloseMobile();
                    navigate("/admin-dashboard/settings");
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-150 transition-colors"
                >
                  <Icon d={icons.settings} size={16} color="currentColor" />
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConfirmOpen(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Icon d={icons.logout} size={16} color="currentColor" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* User row — click to toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-900 font-bold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-xs font-semibold truncate">{adminName}</p>
              <p className="text-white/40 text-[10px] truncate">{societyName}</p>
            </div>
            <span
              className={`transition-opacity duration-200 ${open ? "opacity-100" : "opacity-60"}`}
            >
              <Icon d={icons.menu} size={16} color="rgba(255,255,255,0.7)" />
            </span>
          </button>
        </div>

        {/* Logout confirmation modal */}
        {confirmOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 ${modalVisible ? "opacity-100" : "opacity-0"
                }`}
              onClick={() => setConfirmOpen(false)}
            />

            {/* Card */}
            <div
              className={`relative bg-white/95 backdrop-blur-xl rounded-2xl ring-1 ring-black/5 shadow-2xl w-full max-w-sm p-6 transition-all duration-200 ${modalVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-2"
                }`}
            >
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Icon d={icons.logout} size={20} color="currentColor" className="text-red-500" />
              </div>

              <h2
                id="logout-modal-title"
                className="text-base font-semibold text-gray-900"
              >
                Logout of your account?
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                You will need to sign in again to access your dashboard.
              </p>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}