import API from "../../api/axios";

/**
 * Society AI Knowledge Base & Intent Recognition Engine
 * Provides intelligent, instant answers to common society management queries,
 * navigation assistance, and automatic dashboard tab switching.
 * Can seamlessly delegate to a backend LLM/AI API when connected.
 */

// Quick reply suggestion presets
export const INITIAL_SUGGESTIONS = [
  { label: "💳 How to pay maintenance?", query: "How do I pay maintenance?" },
  { label: "⚠️ Track complaints", query: "Show open complaints" },
  { label: "📢 Recent notices", query: "What are the latest notices?" },
  { label: "📅 Upcoming events", query: "Are there any upcoming events?" },
  { label: "🏢 Resident directory", query: "How to view residents?" },
];

/**
 * Primary message processing entry point.
 */
export async function processChatMessage(input, activeTab) {
  const text = input.trim();
  const lower = text.toLowerCase();

  // Simulate subtle AI processing latency for natural feel
  await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));

  // -------------------------------------------------------------------
  // 1. Direct Navigation Intents ("take me to X", "open Y", "go to Z")
  // -------------------------------------------------------------------
  if (lower.includes("take me to") || lower.includes("open ") || lower.includes("go to") || lower.includes("show me ")) {
    if (lower.includes("resident") || lower.includes("flat") || lower.includes("user")) {
      return {
        text: "Sure! Navigating you to the **Residents & Flats Directory** now.",
        targetTab: "Residents",
        actionLabel: "Open Residents",
        autoNavigate: true,
        suggestions: ["How to add a resident?", "Filter by flat type"],
      };
    }
    if (lower.includes("complaint") || lower.includes("issue") || lower.includes("ticket")) {
      return {
        text: "Taking you directly to **Complaint Management**.",
        targetTab: "Complaints",
        actionLabel: "Open Complaints",
        autoNavigate: true,
        suggestions: ["How to resolve a complaint?", "Filter pending complaints"],
      };
    }
    if (lower.includes("maintenance") || lower.includes("due") || lower.includes("bill")) {
      return {
        text: "Opening **Maintenance Dues & Billing**.",
        targetTab: "maintenance",
        actionLabel: "Open Maintenance",
        autoNavigate: true,
        suggestions: ["Generate maintenance bill", "View defaulter list"],
      };
    }
    if (lower.includes("notice") || lower.includes("announcement")) {
      return {
        text: "Redirecting to **Society Notice Management**.",
        targetTab: "notices",
        actionLabel: "Open Notices",
        autoNavigate: true,
        suggestions: ["Publish new notice", "Meeting notices"],
      };
    }
    if (lower.includes("event") || lower.includes("activity") || lower.includes("festival")) {
      return {
        text: "Switching to **Society Events Management**.",
        targetTab: "Events",
        actionLabel: "Open Events",
        autoNavigate: true,
        suggestions: ["Create an event", "Upcoming festivals"],
      };
    }
    if (lower.includes("history") || lower.includes("payment")) {
      return {
        text: "Opening **Payment History & Receipts**.",
        targetTab: "history",
        actionLabel: "View Payment History",
        autoNavigate: true,
        suggestions: ["Filter paid receipts", "Export payment logs"],
      };
    }
    if (lower.includes("rating") || lower.includes("qr") || lower.includes("feedback")) {
      return {
        text: "Navigating to **QR Ratings & Visitor Feedback**.",
        targetTab: "ratings",
        actionLabel: "Open QR Ratings",
        autoNavigate: true,
        suggestions: ["Generate QR code", "Average rating score"],
      };
    }
    if (lower.includes("dashboard") || lower.includes("home")) {
      return {
        text: "Returning to the main **Society Command Center** dashboard.",
        targetTab: "dashboard",
        actionLabel: "Return to Dashboard",
        autoNavigate: true,
        suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
      };
    }
  }

  // -------------------------------------------------------------------
  // 2. Knowledge Base Matching
  // -------------------------------------------------------------------

  // Maintenance & Payments
  if (lower.includes("maintenance") || lower.includes("pay") || lower.includes("bill") || lower.includes("fee") || lower.includes("due")) {
    return {
      text: "💰 **Maintenance & Financial Management**:\n\n• Society maintenance is billed monthly (due by the 10th of every month).\n• Residents can pay directly online using UPI, Razorpay, or credit/debit cards.\n• Admins can generate maintenance bills and mark offline cash/cheque payments.\n\nWould you like to view maintenance collections or pending dues?",
      targetTab: "maintenance",
      actionLabel: "Go to Maintenance Page →",
      suggestions: ["View defaulter list", "Check payment history", "How to generate bill?"],
    };
  }

  // Complaints
  if (lower.includes("complaint") || lower.includes("issue") || lower.includes("problem") || lower.includes("leak") || lower.includes("repair") || lower.includes("resolve")) {
    return {
      text: "⚠️ **Complaint Handling & Resolution**:\n\n• Residents submit complaints under categories: Water, Electric, Lift, Plumber, or General.\n• Pending complaints display an orange indicator on the dashboard.\n• Click 'Resolve' on any complaint card to update its status instantly.\n\nWould you like to manage open complaints now?",
      targetTab: "Complaints",
      actionLabel: "Manage Complaints →",
      suggestions: ["Filter pending complaints", "How to resolve complaint?", "Emergency contacts"],
    };
  }

  // Notices
  if (lower.includes("notice") || lower.includes("announcement") || lower.includes("circular") || lower.includes("meeting")) {
    return {
      text: "📢 **Society Notices & Circulars**:\n\n• Publish official society announcements for all residents.\n• Categories include: Meetings, Maintenance schedules, Rules updates, and Event announcements.\n• Pin important notices to keep residents informed.\n\nWould you like to post or manage notices?",
      targetTab: "notices",
      actionLabel: "Open Notice Management →",
      suggestions: ["Publish new notice", "Filter by category", "Recent notices"],
    };
  }

  // Events
  if (lower.includes("event") || lower.includes("activity") || lower.includes("festival") || lower.includes("celebration") || lower.includes("party")) {
    return {
      text: "📅 **Society Events & Cultural Programs**:\n\n• Schedule and promote society events such as Diwali, Holi, Sports Meets, and AGM meetings.\n• Track participant RSVPs and event locations.\n• Event countdowns display directly on the resident portal.\n\nWould you like to explore society events?",
      targetTab: "Events",
      actionLabel: "View Events Schedule →",
      suggestions: ["Create new event", "Upcoming festivals", "Event locations"],
    };
  }

  // Residents & Flats
  if (lower.includes("resident") || lower.includes("flat") || lower.includes("member") || lower.includes("owner") || lower.includes("tenant")) {
    return {
      text: "🏢 **Resident Directory & Flat Management**:\n\n• View all registered society residents organized by Flat Number, Floor, and Flat Type (1BHK, 2BHK, 3BHK).\n• Add new residents with instant login credentials.\n• Easily search residents by name, phone, or email.\n\nWould you like to open the Resident Directory?",
      targetTab: "Residents",
      actionLabel: "Open Resident Directory →",
      suggestions: ["How to add a resident?", "Filter occupied flats", "Search flat number"],
    };
  }

  // Payment History
  if (lower.includes("history") || lower.includes("receipt") || lower.includes("transaction") || lower.includes("log")) {
    return {
      text: "💳 **Payment History & Transaction Records**:\n\n• View chronological audit logs of all settled maintenance payments.\n• Filter receipts by month or payment status.\n• Download digital payment acknowledgments.",
      targetTab: "history",
      actionLabel: "Open Payment History →",
      suggestions: ["How to export receipts?", "Check pending dues", "Total collected this month"],
    };
  }

  // Dashboard Stats & Features
  if (lower.includes("dashboard") || lower.includes("stat") || lower.includes("sync") || lower.includes("counter") || lower.includes("feature")) {
    return {
      text: "✨ **Dashboard Features Overview**:\n\n• **Live Counters**: Real-time stats for Flats, Residents, Collections, Pending Dues, Complaints, Events, and Notices.\n• **Clickable Cards**: Click any card to navigate directly to its module.\n• **Live Sync**: Click the 'Live Refresh' button in the hero banner to synchronize metrics instantly.",
      targetTab: "dashboard",
      actionLabel: "Go to Dashboard →",
      suggestions: ["How to pay maintenance?", "Track complaints", "Recent notices"],
    };
  }

  // Greetings
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey") || lower.includes("greetings")) {
    return {
      text: "Hello! 👋 Welcome to **Society AI Assistant**.\n\nI can help you navigate the dashboard, check maintenance collections, track complaints, review notices, and find resident details.\n\nWhat would you like assistance with today?",
      suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
    };
  }

  // Help
  if (lower.includes("help") || lower.includes("support") || lower.includes("contact") || lower.includes("admin")) {
    return {
      text: "🤝 **Admin Support & Assistance**:\n\nI am your automated society co-pilot! You can ask me questions or tell me commands like:\n\n• *\"Take me to complaints\"*\n• *\"How do I pay maintenance?\"*\n• *\"Show me residents\"*\n• *\"What are the upcoming events?\"*",
      suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
    };
  }

  // -------------------------------------------------------------------
  // 3. Fallback to external Backend AI endpoint if available, or smart fallback
  // -------------------------------------------------------------------
  try {
    const res = await API.post("/chatbot/ask", { prompt: text }).catch(() => null);
    if (res?.data?.reply) {
      return {
        text: res.data.reply,
        suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
      };
    }
  } catch (e) {
    // Ignore endpoint error and use fallback
  }

  // Default intelligent fallback response
  return {
    text: `I've analyzed your question regarding **"${text}"**.\n\nYou can manage this directly using the dashboard sidebar or click one of the quick shortcuts below to navigate immediately!`,
    targetTab: "dashboard",
    actionLabel: "Explore Dashboard Modules →",
    suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
  };
}
