import { useState, useRef, useEffect } from "react";
import Icon from "../../assets/icons";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  activeNav,
  setActiveNav,
  user = [],
  complaints = [],
  recentNotices = [],
  events = [],
  
  // NEW: optional props for mobile drawer control (wired up from Topbar's
  // hamburger button). Both default to safe no-ops so existing usages of
  // <Sidebar /> that don't pass these keep working exactly as before.
  isOpen = false,
  onClose = () => {},
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // NEW: icon-only collapse mode, only toggleable on tablet widths (md–lg)
  const [collapsed, setCollapsed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the profile dropdown with Escape too
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
  }, [confirmOpen]);

  // Allow closing the modal with Escape
  useEffect(() => {
    if (!confirmOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setConfirmOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [confirmOpen]);

  // NEW: close the mobile drawer with Escape
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

    // Resident sidebar always returns to the resident login.
    // Add role-specific branches here if this sidebar is ever
    // shared across roles (e.g. admin -> /admin-login).
    navigate("/user-login");
  };

  // NEW: shared handler for nav item clicks — keeps existing setActiveNav
  // behavior untouched, and additionally closes the mobile drawer so
  // selecting a nav item on mobile auto-closes the sidebar (per spec).
  const handleNavClick = (nav) => {
    setActiveNav(nav);
    onClose();
  };

  // User initials
  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <>
      {/* Mobile backdrop — only rendered/visible below md, sits under the sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`
          flex flex-col fixed inset-y-0 left-0 z-50 shadow-xl bg-indigo-600
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "w-20" : "w-60"} lg:w-60
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center font-bold text-indigo-600 text-base shrink-0">
            S
          </div>
          {(!collapsed || isOpen) && (
            <span className="text-white font-bold text-lg tracking-tight lg:inline hidden md:hidden lg:block">
              SocietyOS
            </span>
          )}
          {/* On mobile the drawer is always full-width, so always show the label there */}
          <span className="text-white font-bold text-lg tracking-tight md:hidden">
            SocietyOS
          </span>
          {!collapsed && (
            <span className="text-white font-bold text-lg tracking-tight hidden md:inline lg:hidden">
              SocietyOS
            </span>
          )}

          {/* NEW: tablet-only collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="hidden md:flex lg:hidden ml-auto w-6 h-6 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors shrink-0"
          >
            <span
              className={`text-xs transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            >
              ‹
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          <p
            className={`text-[10px] font-semibold tracking-widest text-white/40 uppercase px-2.5 pt-1 pb-1 ${
              collapsed ? "md:text-center lg:text-left" : ""
            }`}
          >
            {collapsed ? <span className="md:hidden lg:inline">Main</span> : "Main"}
            {collapsed && <span className="hidden md:inline lg:hidden">•</span>}
          </p>
          <button
            onClick={() => handleNavClick("dashboard")}
            title="Dashboard"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-between" : ""
            } ${
              activeNav === "dashboard"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name="home" />
              <span className={collapsed ? "md:hidden lg:inline" : ""}>Dashboard</span>
            </div>
          </button>
          <button
            onClick={() => handleNavClick("notices")}
            title="Notices"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-between" : ""
            } ${
              activeNav === "notices"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name="notice" />
              <span className={collapsed ? "md:hidden lg:inline" : ""}>Notices</span>
            </div>
            <span
              className={`bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ${
                collapsed ? "md:hidden lg:inline-block" : ""
              }`}
            >
              {recentNotices?.length || 0}
            </span>
          </button>

          <button
            onClick={() => handleNavClick("complaint")}
            title="Complaints"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-between" : ""
            } ${
              activeNav === "complaint"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name="complaint" />
              <span className={collapsed ? "md:hidden lg:inline" : ""}>Complaints</span>
            </div>
            <span
              className={`bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ${
                collapsed ? "md:hidden lg:inline-block" : ""
              }`}
            >
              {complaints?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleNavClick("events")}
            title="Events"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-between" : ""
            } ${
              activeNav === "events"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon name="event" />
              <span className={collapsed ? "md:hidden lg:inline" : ""}>Events</span>
            </div>

            <span
              className={`bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ${
                collapsed ? "md:hidden lg:inline-block" : ""
              }`}
            >
              {events?.length || 0}
            </span>
          </button>
          <button
            onClick={() => handleNavClick("notification")}
            title="Notification"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-start" : ""
            } ${
              activeNav === "notification"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Icon name="bell" />
            <span className={collapsed ? "md:hidden lg:inline" : ""}>Notification</span>
          </button>
          <p
            className={`text-[10px] font-semibold tracking-widest text-white/40 uppercase px-2.5 pt-4 pb-1 ${
              collapsed ? "md:text-center lg:text-left" : ""
            }`}
          >
            {collapsed ? <span className="md:hidden lg:inline">Financials</span> : "Financials"}
            {collapsed && <span className="hidden md:inline lg:hidden">•</span>}
          </p>
          <button
            onClick={() => handleNavClick("dues")}
            title="My Dues"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-start" : ""
            } ${
              activeNav === "dues"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Icon name="dues" />
            <span className={collapsed ? "md:hidden lg:inline" : ""}>My Dues</span>
          </button>
          <button
            onClick={() => handleNavClick("history")}
            title="Payment History"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              collapsed ? "md:justify-center lg:justify-start" : ""
            } ${
              activeNav === "history"
                ? "bg-white text-indigo-600 font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Icon name="history" />
            <span className={collapsed ? "md:hidden lg:inline" : ""}>Payment History</span>
          </button>
        </nav>

        {/* User + Dropdown */}
        <div className="relative p-3 border-t border-white/10" ref={ref}>
          {/* Dropdown — floating glass card above the user bar.
              Always mounted, animated purely via opacity/scale/translate
              so open + close both transition smoothly. */}
          <div
            className={`absolute bottom-full left-3 right-3 mb-2 origin-bottom transition-all duration-200 ease-out ${
              open
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
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {user?.flatNo} · Resident
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    onClose();
                    navigate("/settings");
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-150 transition-colors"
                >
                  <Icon name="notice" className="text-gray-400" />
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConfirmOpen(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* User bar — click to toggle */}
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="true"
            className={`flex items-center gap-2.5 w-full bg-white/10 rounded-xl px-3 py-2.5 hover:bg-white/20 transition-colors ${
              collapsed ? "md:justify-center lg:justify-start" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-indigo-400 border-2 border-white/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div
              className={`flex-1 min-w-0 text-left ${collapsed ? "md:hidden lg:block" : ""}`}
            >
              <p className="text-white text-sm font-semibold truncate">
                {user?.name}
              </p>
              <p className="text-white/50 text-xs">{user?.flatNo} · Resident</p>
            </div>
            {/* Chevron flips when open */}
            <span
              className={`text-white/50 text-base transition-transform duration-200 ${
                open ? "rotate-180" : ""
              } ${collapsed ? "md:hidden lg:inline" : ""}`}
            >
              <Icon name="chevron-up" />
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
              className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 ${
                modalVisible ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setConfirmOpen(false)}
            />

            {/* Card */}
            <div
              className={`relative bg-white/95 backdrop-blur-xl rounded-2xl ring-1 ring-black/5 shadow-2xl w-full max-w-sm p-6 transition-all duration-200 ${
                modalVisible
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-2"
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4"></div>

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
                    onClose();
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