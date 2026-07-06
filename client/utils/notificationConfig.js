// Central config for notification types.
// Icons are emoji (matching the dashboard's existing 🔔 / 👋 style — no icon
// library, no per-type colors). Add a new type here and every component
// (bell, dropdown, card, filters, click-navigation) picks it up automatically.

export const NOTIFICATION_TYPES = {
  notice: {
    label: "Notice",
    icon: "📢",
    route: "/user/notices",
  },
  complaint: {
    label: "Complaint",
    icon: "📝",
    route: "/user/complaints",
  },
  payment: {
    label: "Payment",
    icon: "💳",
    route: "/user/history",
  },
  event: {
    label: "Event",
    icon: "📅",
    route: "/user/events",
  },
  visitor: {
    label: "Visitor",
    icon: "👥",
    route: "/user/visitors",
  },
  maintenance: {
    label: "Maintenance",
    icon: "🔧",
    route: "/user/dues",
  },
  general: {
    label: "General",
    icon: "🔔",
    route: null, // stays on the notifications page
  },
};

export const getTypeConfig = (type) =>
  NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.general;

export const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "notice", label: "Notice" },
  { key: "complaint", label: "Complaint" },
  { key: "payment", label: "Payment" },
  { key: "event", label: "Event" },
  { key: "maintenance", label: "Maintenance" },
];

// Lightweight "x time ago" formatter — no extra dependency needed.
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (Number.isNaN(seconds)) return "";
  if (seconds < 60) return "just now";

  const intervals = [
    { unit: "year", secs: 31536000 },
    { unit: "month", secs: 2592000 },
    { unit: "day", secs: 86400 },
    { unit: "hour", secs: 3600 },
    { unit: "minute", secs: 60 },
  ];

  for (const { unit, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};