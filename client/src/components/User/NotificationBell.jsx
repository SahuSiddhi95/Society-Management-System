import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const notificationState = useNotifications();
  const { unreadCount, refreshUnreadCount, fetchAll, fetchedOnce } =
    notificationState;

  // Refresh unread count on mount and every 60 seconds
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      // Lazy-load notifications the first time the dropdown opens
      if (next && !fetchedOnce.current) fetchAll();
      return next;
    });
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/user-dashboard/notifications");
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Bell Button ─────────────────────────────────────────────────── */}
      <button
        onClick={toggleOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`
          relative w-9 h-9 rounded-xl flex items-center justify-center
          border transition-all duration-200
          ${open
            ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
            : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300"
          }
        `}
      >
        <Bell className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[3px] rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <span className="text-[9px] font-bold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </span>
        )}

        {/* Subtle ping animation when there are unread notifications */}
        {unreadCount > 0 && !open && (
          <span
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-red-400 animate-ping opacity-40"
            aria-hidden="true"
          />
        )}
      </button>

      {/* ── Dropdown ────────────────────────────────────────────────────── */}
      {open && (
        <NotificationDropdown
          notificationState={notificationState}
          onViewAll={handleViewAll}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}