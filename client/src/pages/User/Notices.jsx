import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllNotices, getNoticeByCategory } from "../../api/noticeApi";
import { Megaphone, Wrench, Users, Info, Calendar, ChevronDown, ChevronUp, BellRing } from "lucide-react";

const CategoryConfig = {
  Maintenance: { bg: "bg-amber-100", text: "text-amber-700", icon: <Wrench className="w-4 h-4" /> },
  Meeting: { bg: "bg-indigo-100", text: "text-indigo-700", icon: <Users className="w-4 h-4" /> },
  Update: { bg: "bg-green-100", text: "text-green-700", icon: <Info className="w-4 h-4" /> },
  Event: { bg: "bg-purple-100", text: "text-purple-700", icon: <Calendar className="w-4 h-4" /> },
  General: { bg: "bg-slate-100", text: "text-slate-700", icon: <Megaphone className="w-4 h-4" /> },
};

export default function Notices() {
  const { user } = useOutletContext();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categories = ["All", "Maintenance", "Meeting", "Update", "Event"];

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await getAllNotices();
        setNotices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleFilter = async (cat) => {
    setFilter(cat);
    setLoading(true);
    try {
      if (cat === "All") {
        const data = await getAllNotices();
        setNotices(data);
      } else {
        const data = await getNoticeByCategory(cat);
        setNotices(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 pb-10">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notice Board</h1>
              <p className="text-sm text-slate-500 mt-0.5">Stay updated with society announcements.</p>
            </div>
          </div>
          
          {/* Segmented Filter Control */}
          <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar self-start sm:self-auto shrink-0 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  filter === cat
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice Cards List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-slate-400 animate-pulse">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                <Megaphone className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">No notices found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">There are currently no announcements matching your selected category.</p>
            </div>
          ) : (
            notices.map((n) => {
              const conf = CategoryConfig[n.category] || CategoryConfig.General;
              const isExpanded = expanded === n._id;
              
              return (
                <div
                  key={n._id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? "border-indigo-300 shadow-md ring-1 ring-indigo-100" : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <button
                    className="w-full text-left px-5 py-4 sm:p-6 flex items-start gap-4 sm:gap-5 relative outline-none"
                    onClick={() => setExpanded(isExpanded ? null : n._id)}
                  >
                    {/* Left Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${conf.bg} ${conf.text}`}>
                      {conf.icon}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${conf.bg} ${conf.text}`}>
                          {n.category}
                        </span>
                        {n.isNew && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wide animate-pulse">
                            New
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium ml-auto hidden sm:block">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className={`text-sm sm:text-base font-bold text-slate-800 leading-snug pr-2 ${!isExpanded && "truncate"}`}>
                        {n.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-400">
                        <span>By {n.postedBy || "Admin"}</span>
                        <span className="sm:hidden">•</span>
                        <span className="sm:hidden">{new Date(n.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                    
                    {/* Expand/Collapse Chevron */}
                    <div className="absolute right-5 top-6 sm:top-8 text-slate-400 transition-transform">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Body */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {n.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
