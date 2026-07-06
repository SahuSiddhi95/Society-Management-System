// pages/User/Event.jsx

import { useState, useEffect } from "react";

import Icon from "../../assets/icons";
import Sidebar from "../../components/User/Sidebar";

import { getAllEvents } from "../../api/Admin/Eventapi";

// Returns "Today", "Tomorrow", or a short date like "May 15"
const getDateLabel = (dateString) => {
  if (!dateString) return "No Date";

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const isPastEvent = (dateString) => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate < today;
};

export default function Event({
  activeNav,
  setActiveNav,
  user,
  complaints = [],
  fetchDashboardData,
  recentNotices = [],
}) {
  // States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH EVENTS
  // =========================
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const data = await getAllEvents();

      setEvents(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Events
  useEffect(() => {
    fetchEvents();
  }, []);

  // Sort: upcoming first (soonest first), then past events
  const sortedEvents = [...events].sort((a, b) => {
    const aPast = isPastEvent(a.date);
    const bPast = isPastEvent(b.date);

    if (aPast !== bPast) return aPast ? 1 : -1;

    return new Date(a.date) - new Date(b.date);
  });

  const upcomingCount = events.filter((e) => !isPastEvent(e.date)).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={complaints}
        fetchDashboardData={fetchDashboardData}
        recentNotices={recentNotices}
      />

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Events</h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Upcoming society events &amp; gatherings
            </p>
          </div>

          <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            {upcomingCount} Upcoming
          </span>
        </header>

        {/* Content */}
        <main className="p-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                All Events ({events.length})
              </h3>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400">Loading...</p>
            ) : events.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📅</div>

                <p className="text-sm text-slate-500 font-medium">
                  No events scheduled yet
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedEvents.map((e, i) => {
                  const past = isPastEvent(e.date);
                  const dateLabel = getDateLabel(e.date);
                  const isSoon =
                    dateLabel === "Today" || dateLabel === "Tomorrow";

                  return (
                    <div
                      key={e._id}
                      className={`flex items-start gap-4 py-4 ${
                        i < sortedEvents.length - 1
                          ? "border-b border-slate-100"
                          : ""
                      } ${past ? "opacity-50" : ""}`}
                    >
                      {/* Icon */}
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                        <Icon name="event" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800">
                            {e.title}
                          </p>
                        </div>

                        {e.description && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {e.description}
                          </p>
                        )}

                        {e.location && (
                          <p className="text-xs text-slate-400 mt-1">
                            📍 {e.location}
                          </p>
                        )}
                      </div>

                      {/* Date Badge */}
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shrink-0 ${
                          past
                            ? "bg-slate-100 text-slate-400"
                            : isSoon
                              ? "bg-indigo-50 text-indigo-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}