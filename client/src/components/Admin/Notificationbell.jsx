import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Icon from "./shared/Icon";
import NotificationDropdown from "./Notificationdropdown";
import { useNotifications } from "../../../context/Notificationcontext";

const bellPath =
  "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0";

export default function NotificationBell({ setActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { unreadCount } = useNotifications(); 

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
      >
        <Icon d={bellPath} size={16} color="#6b7280" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-orange-400 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown — always mounted, animated purely via opacity/scale so
          both open and close transition smoothly (same pattern as the
          Sidebar's profile dropdown). */}
      <div
        className={`absolute right-0 top-full mt-2 origin-top-right transition-all duration-200 ease-out z-50 ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <NotificationDropdown
          onClose={() => setOpen(false)}
          onViewAll={() => {
  setOpen(false);
  setActive("notification");
}}
        />
      </div>
    </div>
  );
}