import { useState, useRef, useEffect } from "react";
import Icon from "../../assets/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";

export default function Sidebar({
  user = {},
  complaints = [],
  recentNotices = [],
  events = [],
  dues = [],
  transactions = [],
  isOpen = false,
  onClose = () => { },
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef(null);
  const { unreadCount } = useNotifications();

  const pendingDuesCount = dues.filter(
    (d) => d.status === "Pending" || d.status === "Unpaid" || d.status === "Overdue"
  ).length;

  const successfulTxnsCount = transactions.filter(
    (t) => t.status === "Success" || t.status === "paid" || t.status === "Paid"
  ).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (confirmOpen) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
  }, [confirmOpen]);

  useEffect(() => {
    if (!confirmOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setConfirmOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/user-login");
  };

  const location = useLocation();

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          flex flex-col fixed inset-y-0 left-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.1)] bg-gradient-to-b from-indigo-700 to-indigo-950
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-20" : "w-60"} lg:w-60
        `}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10 relative z-10">
          <div className="w-9 h-9 bg-gradient-to-br from-white to-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-700 text-lg shrink-0 shadow-sm shadow-black/20">
            S
          </div>
          {(!collapsed || isOpen) && (
            <span className="text-white font-extrabold text-xl tracking-tight lg:inline hidden md:hidden lg:block drop-shadow-sm">
              SocietyOS
            </span>
          )}
          <span className="text-white font-extrabold text-xl tracking-tight md:hidden drop-shadow-sm">
            SocietyOS
          </span>
          {!collapsed && (
            <span className="text-white font-extrabold text-xl tracking-tight hidden md:inline lg:hidden drop-shadow-sm">
              SocietyOS
            </span>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="hidden md:flex lg:hidden ml-auto w-7 h-7 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors shrink-0 shadow-sm"
          >
            <span
              className={`text-sm font-bold transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              ‹
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
          <p
            className={`text-[10px] font-bold tracking-[0.2em] text-indigo-200/60 uppercase px-2 mb-1 ${collapsed ? "md:text-center lg:text-left" : ""
              }`}
          >
            {collapsed ? <span className="md:hidden lg:inline">Main</span> : "Main"}
            {collapsed && <span className="hidden md:inline lg:hidden">•</span>}
          </p>
          {[
            { key: "dashboard", path: "/user-dashboard", icon: "home", label: "Dashboard", badgeCount: 0 },
            { key: "notices", path: "/user-dashboard/notices", icon: "notice", label: "Notices", badgeCount: recentNotices?.length || 0 },
            { key: "complaint", path: "/user-dashboard/complaints", icon: "complaint", label: "Complaints", badgeCount: complaints?.length || 0 },
            { key: "events", path: "/user-dashboard/events", icon: "event", label: "Events", badgeCount: events?.length || 0 },
            { key: "notification", path: "/user-dashboard/notifications", icon: "bell", label: "Notification", badgeCount: unreadCount || 0 },
          ].map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/user-dashboard" && location.pathname === "/user-dashboard/");
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={onClose}
                title={item.label}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${collapsed ? "md:justify-center lg:justify-between" : ""
                  } ${isActive
                    ? "bg-white/15 text-white font-bold backdrop-blur-md shadow-sm border border-white/10 ring-1 ring-white/5"
                    : "text-indigo-100/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? "text-white" : "text-indigo-200"}><Icon name={item.icon} /></span>
                  <span className={collapsed ? "md:hidden lg:inline" : ""}>{item.label}</span>
                </div>
                {item.badgeCount > 0 && (
                  <span
                    className={`bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm ${collapsed ? "md:hidden lg:inline-block" : ""
                      }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
          
          <p
            className={`text-[10px] font-bold tracking-[0.2em] text-indigo-200/60 uppercase px-2 mt-4 mb-1 ${collapsed ? "md:text-center lg:text-left" : ""
              }`}
          >
            {collapsed ? <span className="md:hidden lg:inline">Financials</span> : "Financials"}
            {collapsed && <span className="hidden md:inline lg:hidden">•</span>}
          </p>

          {[
            { key: "dues", path: "/user-dashboard/dues", icon: "dues", label: "My Dues", badgeCount: pendingDuesCount || 0 },
            { key: "history", path: "/user-dashboard/history", icon: "history", label: "Payment History", badgeCount: successfulTxnsCount || 0 },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={onClose}
                title={item.label}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${collapsed ? "md:justify-center lg:justify-between" : ""
                  } ${isActive
                    ? "bg-white/15 text-white font-bold backdrop-blur-md shadow-sm border border-white/10 ring-1 ring-white/5"
                    : "text-indigo-100/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? "text-white" : "text-indigo-200"}><Icon name={item.icon} /></span>
                  <span className={collapsed ? "md:hidden lg:inline" : ""}>{item.label}</span>
                </div>
                {item.badgeCount > 0 && (
                  <span
                    className={`bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm ${collapsed ? "md:hidden lg:inline-block" : ""
                      }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Dropdown */}
        <div className="relative z-20 p-4 border-t border-white/10 bg-indigo-950/20 backdrop-blur-md" ref={ref}>
          <div
            className={`absolute bottom-full left-4 right-4 mb-3 origin-bottom transition-all duration-200 ease-out ${open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              }`}
            aria-hidden={!open}
          >
            <div className="bg-white/95 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/60 ring-1 ring-black/5 shadow-2xl overflow-hidden">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50/70 to-transparent">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    {user?.flatNo} · Resident
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setOpen(false);
                    onClose();
                    navigate("/user-dashboard/settings");
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/50 active:bg-indigo-100/50 transition-all group"
                >
                  <span className="text-slate-400 group-hover:text-indigo-500 transition-colors text-lg flex items-center justify-center">
                    <Icon name="settings" />
                  </span>
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConfirmOpen(true);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 active:bg-rose-100 transition-all group"
                >
                  <span className="text-rose-400 group-hover:text-rose-500 group-hover:scale-110 transition-all text-lg flex items-center justify-center">
                    🚪
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* User bar — click to toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="true"
            className={`flex items-center gap-3 w-full bg-white/10 backdrop-blur-md rounded-2xl px-3 py-3 border border-white/10 hover:bg-white/20 transition-all shadow-sm ${collapsed ? "md:justify-center lg:justify-start" : ""
              }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 border border-white/30 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner">
              {initials}
            </div>
            <div
              className={`flex-1 min-w-0 text-left ${collapsed ? "md:hidden lg:block" : ""}`}
            >
              <p className="text-white text-sm font-bold truncate">
                {user?.name}
              </p>
              <p className="text-indigo-200 text-[10px] font-semibold uppercase tracking-wider mt-0.5 truncate">{user?.flatNo} · Resident</p>
            </div>
            <span
              className={`text-indigo-200 text-sm transition-transform duration-300 ${open ? "rotate-180 text-white" : ""
                } ${collapsed ? "md:hidden lg:inline" : ""}`}
            >
              <Icon name="chevron-up" />
            </span>
          </button>
        </div>

      </aside>

      {/* Logout confirmation modal - Rendered outside of aside to fix CSS transform context */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div
            className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${modalVisible ? "opacity-100" : "opacity-0"
              }`}
            onClick={() => setConfirmOpen(false)}
          />

          <div
            className={`relative bg-white/95 backdrop-blur-xl rounded-3xl ring-1 ring-black/5 shadow-2xl w-full max-w-sm p-7 transition-all duration-300 ease-out ${modalVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
              }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-5 text-2xl shadow-sm">
              🚪
            </div>

            <h2
              id="logout-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              Logout of your account?
            </h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              You will need to sign in again to access your resident dashboard and payments.
            </p>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  onClose();
                  handleLogout();
                }}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md shadow-rose-500/20 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}