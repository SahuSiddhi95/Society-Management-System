import { FILTERS } from "../../../utils/notificationConfig";
import { Search, LayoutGrid, List, ArrowUpDown, X } from "lucide-react";

export default function NotificationFilters({
  activeFilter = "all",
  onFilterChange,
  searchQuery = "",
  onSearchChange,
  sortOrder = "newest",
  onSortChange,
  viewMode = "card",
  onViewModeChange,
  counts = {},
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Top Bar: Search Input + Sort Dropdown + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or message content..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & View Toggle */}
        <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end">
          {/* Sort Selector */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent border-none text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="unread">Unread First</option>
            </select>
          </div>

          {/* View Mode Toggle (Cards vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange("card")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "card"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips Carousel */}
      <div
        className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          const count = counts[f.key];
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                border whitespace-nowrap shrink-0 transition-all duration-200 active:scale-[0.98]
                ${
                  isActive
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                }
              `}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}