import { useState, useEffect } from "react";
import { getAllEvents } from "../../api/Admin/Eventapi";
import { CalendarDays, MapPin, Clock, PartyPopper, Calendar as CalendarIcon, Info } from "lucide-react";

// Helpers
const isPastEvent = (dateString) => {
  if (!dateString) return false;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate < today;
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(':');
  if (!h || !m) return timeStr;
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export default function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  // Sort events: upcoming first (soonest first), then past events
  const sortedEvents = [...events].sort((a, b) => {
    const aPast = isPastEvent(a.date);
    const bPast = isPastEvent(b.date);
    if (aPast !== bPast) return aPast ? 1 : -1;
    return new Date(a.date) - new Date(b.date);
  });

  const upcomingEvents = sortedEvents.filter(e => !isPastEvent(e.date));
  const pastEvents = sortedEvents.filter(e => isPastEvent(e.date));

  const EventCard = ({ e, isPast }) => {
    const eventDate = new Date(e.date);
    const month = eventDate.toLocaleString('default', { month: 'short' });
    const day = eventDate.getDate();
    const year = eventDate.getFullYear();

    return (
      <div className={`bg-white border rounded-2xl p-5 flex flex-col sm:flex-row gap-5 transition-all duration-300 shadow-sm hover:shadow ${
        isPast ? "border-slate-200/60 opacity-70 hover:opacity-100" : "border-indigo-100/60"
      }`}>
        
        {/* Date Block */}
        <div className={`w-full sm:w-24 shrink-0 rounded-xl flex sm:flex-col items-center justify-center p-3 sm:py-4 border ${
          isPast 
            ? "bg-slate-50 border-slate-100 text-slate-500" 
            : "bg-indigo-50 border-indigo-100/50 text-indigo-700"
        }`}>
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:block mb-1">{month}</span>
          <span className="text-3xl font-black leading-none">{day}</span>
          <span className="text-xs font-semibold sm:hidden ml-2 uppercase tracking-widest">{month} {year}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className={`text-base sm:text-lg font-bold leading-tight ${isPast ? "text-slate-600" : "text-slate-900"}`}>
              {e.title}
            </h3>
            {!isPast && (
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                Upcoming
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
            {e.description || "Join us for this society event!"}
          </p>

          {/* Metadata */}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            {e.time && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatTime(e.time)}</span>
              </div>
            )}
            
            {e.location && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[150px]">{e.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Society Events</h1>
              <p className="text-sm text-slate-500 mt-0.5">Discover upcoming gatherings and celebrations.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold self-start sm:self-auto">
            <CalendarDays className="w-4 h-4" />
            <span>{upcomingEvents.length} Upcoming</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-8">
          
          {loading ? (
             <div className="text-center py-12">
               <p className="text-sm font-medium text-slate-400 animate-pulse">Loading events...</p>
             </div>
          ) : events.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">No events scheduled</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">There are no upcoming or past events in the system yet.</p>
            </div>
          ) : (
            <>
              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Upcoming Events
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {upcomingEvents.map(e => (
                      <EventCard key={e._id} e={e} isPast={false} />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Past Events
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {pastEvents.map(e => (
                      <EventCard key={e._id} e={e} isPast={true} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}