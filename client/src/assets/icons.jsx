const Icon = ({ name }) => {

  const icons = {

    // Sidebar
     home: "🏠",
  notice: "📢",
  complaint: "🎫",
  dues: "💳",
  history: "📜",
  parking: "🚗",
  visitor: "👥",
  poll: "🗳️",
  amenity: "🔧",
  event: "📅", // Calendar Icon
  
    // Topbar
    search: "🔍",
    bell: "🔔",
    settings: "⚙️",
    menu: "☰", // Hamburger menu (mobile sidebar toggle)

    // Complaint Types
    water: "💧",
    electric: "⚡",
    lift: "🛗",
    party: "🎉",
    plumber: "🔧",
    tech: "🛠️",

    // Visitors
    guest: "🧑",
    delivery: "📦",

    // Payments / Stats
    pay: "💳",
    pending: "💳",
    paid: "✅",
    open: "🎫",
    unread: "📢",

    // Extra
    check: "✅",
    "chevron-up": "▲",

  };

  return (
    <span>
      {icons[name] || "•"}
    </span>
  );
};

export default Icon;