import { useEffect, useState } from "react";
import Sidebar from "../../components/User/Sidebar";
import { getAllNotices ,getNoticeByCategory} from "../../api/noticeApi";

const DotColor = {
  blue: "bg-indigo-500",
  amber: "bg-amber-400",
  green: "bg-green-500",
};

const CategoryBadge = {
  Maintenance: "bg-amber-100 text-amber-700",
  Meeting: "bg-indigo-100 text-indigo-700",
  Update: "bg-green-100 text-green-700",
  Event: "bg-purple-100 text-purple-700",
};

export default function Notices({
  activeNav,
  setActiveNav,
  user,
  complaints = [],
  recentNotices = [],
}) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [notices, setNotices] = useState([]);
  const categories = ["All", "Maintenance", "Meeting", "Update", "Event"];
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAllNotices();
        setNotices(data);
      } catch (error) {
        console.log(error);
      } 
    };

    fetchNotices();
  }, []);

  const filtered = notices;
  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        complaints={complaints}
        recentNotices={recentNotices}
      />

      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Notices</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Shree Ram Residency · All announcements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              2 New
            </span>
          </div>
        </header>

        <main className="p-8 flex flex-col gap-6">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={async () => {
  setFilter(cat);

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
  }
}}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === cat
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notice Cards */}
          <div className="flex flex-col gap-3">
            {filtered.map((n) => (
              <div
                key={n._id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                  expanded === n._id
                    ? "border-indigo-300 shadow-md"
                    : "border-slate-200 hover:shadow-sm"
                }`}
              >
                <button
                  className="w-full text-left px-6 py-4 flex items-start gap-4"
                  onClick={() => setExpanded(expanded === n._id ? null : n._id)}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${DotColor[n.dot] || "bg-indigo-500"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${CategoryBadge[n.category] || "bg-slate-100 text-slate-700"}`}
                      >
                        {n.category}
                      </span>
                      {n.isNew && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-500 uppercase tracking-wide">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Posted {new Date(n.createdAt).toLocaleDateString()} ·{" "}
                      {n.postedBy || "Admin"}
                    </p>
                  </div>
                  <span className="text-slate-400 text-lg mt-0.5 shrink-0">
                    {expanded === n._id ? "▲" : "▼"}
                  </span>
                </button>

                {expanded === n._id && (
                  <div className="px-6 pb-5 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
