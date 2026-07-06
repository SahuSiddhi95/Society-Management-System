// src/components/complaints/Pagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, total, onPageChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-1 py-3">
      <p className="text-xs text-slate-500">
        Page <span className="font-medium text-slate-700">{page}</span> of{" "}
        <span className="font-medium text-slate-700">{pages}</span> · {total} total
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}