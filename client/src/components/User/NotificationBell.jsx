import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const notificationState = useNotifications();
  const { unreadCount, refreshUnreadCount, fetchAll, fetchedOnce } = notificationState;

  // Badge count loads on mount and refreshes periodically, independent of
  // whether the dropdown is open — so the bell is always accurate.
  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && !fetchedOnce.current) fetchAll();
      return next;
    });
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors text-lg relative"
      >
        🔔

        {/* Badge hides entirely at 0, per spec */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-[3px] -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
            <span className="text-[9px] font-bold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </span>
        )}
      </button>

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