// Central config for notification types.
// Add a new type here and every component (bell, dropdown, card, filters,
// click-navigation) picks it up automatically.

export const NOTIFICATION_TYPES = {
  notice: {
    label: "Notice",
    icon: "📢",
    color: "purple",
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    leftBorder: "border-l-purple-500",
    iconBg: "bg-purple-50",
    route: null,
  },
  complaint: {
    label: "Complaint",
    icon: "📝",
    color: "orange",
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    leftBorder: "border-l-orange-500",
    iconBg: "bg-orange-50",
    route: null,
  },
  payment: {
    label: "Payment",
    icon: "💳",
    color: "emerald",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    leftBorder: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    route: null,
  },
  event: {
    label: "Event",
    icon: "📅",
    color: "indigo",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
    leftBorder: "border-l-indigo-500",
    iconBg: "bg-indigo-50",
    route: null,
  },
  maintenance: {
    label: "Maintenance",
    icon: "🔧",
    color: "red",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    leftBorder: "border-l-red-500",
    iconBg: "bg-red-50",
    route: null,
  },
  general: {
    label: "General",
    icon: "🔔",
    color: "slate",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    leftBorder: "border-l-slate-400",
    iconBg: "bg-slate-50",
    route: null,
  },
};

export const getTypeConfig = (type) =>
  NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.general;

export const FILTERS = [
  { key: "all", label: "All", emoji: "🔔" },
  { key: "unread", label: "Unread", emoji: "📬" },
  { key: "read", label: "Read", emoji: "✅" },
  { key: "notice", label: "Notices", emoji: "📢" },
  { key: "complaint", label: "Complaints", emoji: "📝" },
  { key: "event", label: "Events", emoji: "📅" },
  { key: "maintenance", label: "Maintenance", emoji: "🔧" },
  { key: "payment", label: "Payments", emoji: "💳" },
];

// Lightweight "x time ago" formatter — no extra dependency needed.
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (Number.isNaN(seconds) || seconds < 0) return "";
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

// Format a date to a friendly full string
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};