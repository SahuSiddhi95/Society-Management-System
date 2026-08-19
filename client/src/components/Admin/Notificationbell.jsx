import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./shared/Icon";
import NotificationDropdown from "./Notificationdropdown";
import { useNotifications } from "../../../context/Notificationcontext";

const bellPath =
  "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { unreadCount, fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) fetchNotifications();
      return next;
    });
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/admin-dashboard/notifications");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative cursor-pointer"
        title="Notifications"
      >
        <Icon d={bellPath} size={16} color="#6b7280" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-orange-400 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown container */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 origin-top-right transition-all duration-200 ease-out z-50 opacity-100 scale-100 translate-y-0"
        >
          <NotificationDropdown
            onClose={() => setOpen(false)}
            onViewAll={handleViewAll}
          />
        </div>
      )}
    </div>
  );
}