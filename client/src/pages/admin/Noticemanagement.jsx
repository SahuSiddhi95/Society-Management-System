import { useState, useEffect, useMemo, useCallback } from "react";
import API from "../../api/axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";
import {
  FileText, Calendar, Tag, Megaphone, Plus, Search, X, Pencil, Trash2, Eye,
  ChevronDown, AlertTriangle, User, Info, Loader2, RotateCcw, Inbox
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "meeting",
  "maintenance",
  "update",
  "event",
];
const CATEGORY_STYLES = {
  meeting: "bg-blue-50 text-blue-700 ring-blue-600/20",
  maintenance: "bg-orange-50 text-orange-700 ring-orange-600/20",
  update: "bg-green-50 text-green-700 ring-green-600/20",
  event: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

const CATEGORY_DOT = {
  meeting: "bg-blue-500",
  maintenance: "bg-orange-500",
  update: "bg-green-500",
  event: "bg-purple-500",
};

/* ------------------------------------------------------------------ */
/*  API layer — real Axios integration                                 */
/*  Backend mount: /api/adminNotic                                     */
/* ------------------------------------------------------------------ */

const http = API.create({
  baseURL: "/api/adminNotic",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.notices)) return data.notices;
  return [];
};

const unwrapItem = (data) => data?.data ?? data?.notice ?? data;

const api = {
  async list() {
    const res = await API.get("/adminNotic");
    return unwrapList(res.data);
  },

  async listByCategory(category) {
    const res = await API.get(`/adminNotic/category/${category}`);
    return unwrapList(res.data);
  },

  async create(payload) {
    const res = await API.post("/adminNotic", payload);
    return unwrapItem(res.data);
  },

  async update(id, payload) {
    const res = await API.put(`/adminNotic/${id}`, payload);
    return unwrapItem(res.data);
  },

  async remove(id) {
    await API.delete(`/adminNotic/${id}`);
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};
const createdByName = (createdBy) => {
  if (!createdBy) return "Unknown";
  if (typeof createdBy === "string") return createdBy;
  return createdBy.name || createdBy.fullName || createdBy.email || "Unknown";
};

/* ------------------------------------------------------------------ */
/*  Badge                                                               */
/* ------------------------------------------------------------------ */

function NoticeCategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${CATEGORY_STYLES[category] ||
        "bg-gray-100 text-gray-700 ring-gray-600/20"
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[category] || "bg-gray-400"
          }`}
      />
      {category}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                               */
/* ------------------------------------------------------------------ */

function NoticeStatsCard({ icon: Icon, label, value, sub, accent }) {
  const accents = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100" },
    green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
  }[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
          {sub && <p className="mt-1 truncate text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents.bg} ${accents.ring} ring-1 transition-transform group-hover:scale-105`}>
          <Icon className={`h-5 w-5 ${accents.text}`} />
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="h-6 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="h-11 w-11 rounded-xl bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Search & Filter Bar                                                 */
/* ------------------------------------------------------------------ */

function SearchFilterBar({ filters, setFilters }) {
  const setSearch = (v) => setFilters((f) => ({ ...f, search: v }));
  const setCategory = (v) => setFilters((f) => ({ ...f, category: v }));
  const setSort = (v) => setFilters((f) => ({ ...f, sort: v }));
  const reset = () => setFilters({ search: "", category: "All", sort: "newest" });
  const hasActive = filters.search || filters.category !== "All" || filters.sort !== "newest";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 min-w-[200px] lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-700 shadow-sm outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ring-1 ring-inset ${filters.category === c
                  ? "bg-indigo-600 text-white ring-indigo-600"
                  : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 pl-3.5 pr-9 text-sm text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          {hasActive && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ onCreate, filtered }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-gray-100">
      <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50">
        <Inbox className="h-11 w-11 text-indigo-300" strokeWidth={1.5} />
        <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-100">
          <Megaphone className="h-3.5 w-3.5 text-indigo-500" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-gray-900">
        {filtered ? "No notices match your filters" : "No Notices Found"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">
        {filtered ? "Try adjusting your search or filters to find what you're looking for." : "Create your first notice to notify society residents."}
      </p>
      {!filtered && (
        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Create Notice
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table skeleton                                                     */
/* ------------------------------------------------------------------ */

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="divide-y divide-gray-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse hidden sm:block" />
            <div className="h-6 w-16 rounded bg-gray-100 animate-pulse hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4 px-6 py-5">
      <div className="h-5 w-2/3 rounded bg-gray-100 animate-pulse" />
      <div className="h-5 w-24 rounded-full bg-gray-100 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
        <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table                                                               */
/* ------------------------------------------------------------------ */

function ActionButtons({ notice, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onView(notice)} title="View" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
        <Eye className="h-4 w-4" />
      </button>
      <button onClick={() => onEdit(notice)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={() => onDelete(notice)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function NoticeTable({ notices, onView, onEdit, onDelete }) {
  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Notice Title</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hidden xl:table-cell">Created By</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hidden xl:table-cell">Updated</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notices.map((n) => (
                <tr key={n._id || n.id} className="group transition-colors hover:bg-indigo-50/30">
                  <td className="px-5 py-3.5">
                    <p className="max-w-[220px] truncate text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="mt-0.5 text-xs text-gray-400 lg:hidden">{fmtDate(n.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3.5"><NoticeCategoryBadge category={n.category} /></td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="max-w-[280px] truncate text-sm text-gray-600">{n.description}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <User className="h-3.5 w-3.5 text-gray-400" /> {createdByName(n.createdBy)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">{fmtDate(n.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell">
                    <span className="text-sm text-gray-500">{fmtDate(n.updatedAt)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end">
                      <ActionButtons notice={n} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-3 md:hidden">
        {notices.map((n) => (
          <div key={n._id || n.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">{n.title}</p>
              <NoticeCategoryBadge category={n.category} />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{n.description}</p>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="text-xs text-gray-400">
                <p className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {createdByName(n.createdBy)}</p>
                <p className="mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmtDate(n.createdAt)}</p>
              </div>
              <ActionButtons notice={n} onView={onView} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal shell                                                         */
/* ------------------------------------------------------------------ */

function ModalShell({ open, onClose, title, subtitle, children, footer, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] animate-[fadeIn_.15s_ease-out]" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-[popIn_.2s_ease-out] flex flex-col`}>
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { opacity: 0; transform: scale(.97) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notice Form (react-hook-form, shared by Create / Edit)              */
/* ------------------------------------------------------------------ */

const inputCls = "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2";
const okBorder = "border-gray-200 hover:border-gray-300 focus:border-indigo-400 focus:ring-indigo-100";
const errBorder = "border-red-300 focus:border-red-400 focus:ring-red-100";

function NoticeForm({ register, errors }) {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Notice Title <span className="text-red-400">*</span></span>
        <input
          placeholder="e.g. Water Supply Interruption Notice"
          className={`${inputCls} ${errors.title ? errBorder : okBorder}`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Category <span className="text-red-400">*</span></span>
        <div className="relative">
          <select
            defaultValue=""
            className={`${inputCls} ${errors.category ? errBorder : okBorder} appearance-none pr-9 cursor-pointer`}
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-gray-700">Description <span className="text-red-400">*</span></span>
        <textarea
          rows={4}
          placeholder="Write the notice details residents need to know..."
          className={`${inputCls} ${errors.description ? errBorder : okBorder} resize-none`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create / Edit Modals                                               */
/* ------------------------------------------------------------------ */

function CreateNoticeModal({ open, onClose, onCreated }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: "", category: "", description: "" },
  });

  useEffect(() => { if (open) reset({ title: "", category: "", description: "" }); }, [open, reset]);

  const onSubmit = async (values) => {
    try {
      const created = await api.create(values); // POST /api/adminNotic
      onCreated(created);
      toast.success("Notice published successfully.");
      onClose();
    } catch (err) {
      toast.error(err?.response ? "Failed to publish notice." : "Network error.");
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Create Notice"
      subtitle="Publish a new notice for all residents"
      footer={
        <>
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-60">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Publish Notice
          </button>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <NoticeForm register={register} errors={errors} />
      </form>
    </ModalShell>
  );
}

function EditNoticeModal({ open, onClose, onUpdated, notice }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: "", category: "", description: "" },
  });

  useEffect(() => {
    if (open && notice) reset({ title: notice.title, category: notice.category, description: notice.description });
  }, [open, notice, reset]);

  const onSubmit = async (values) => {
    try {
      const id = notice._id || notice.id;
      const updated = await api.update(id, values); // PUT /api/adminNotic/:id
      onUpdated({ ...notice, ...updated });
      toast.success("Notice updated successfully.");
      onClose();
    } catch (err) {
      toast.error(err?.response ? "Failed to update notice." : "Network error.");
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Edit Notice"
      subtitle="Update the notice details"
      footer={
        <>
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:opacity-60">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Save Changes
          </button>
        </>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <NoticeForm register={register} errors={errors} />
      </form>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Modal                                          */
/* ------------------------------------------------------------------ */

function DeleteNoticeModal({ open, onClose, onDeleted, notice }) {
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      const id = notice._id || notice.id;
      await api.remove(id); // DELETE /api/adminNotic/:id
      onDeleted(id);
      toast.success("Notice deleted successfully.");
      onClose();
    } catch (err) {
      toast.error(err?.response ? "Failed to delete notice." : "Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-[popIn_.2s_ease-out]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900">Delete Notice?</h3>
        <p className="mt-1.5 text-sm text-gray-500">
          Are you sure you want to permanently delete <span className="font-medium text-gray-700">"{notice?.title}"</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100">Cancel</button>
          <button onClick={handleDelete} disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition-colors hover:bg-red-700 disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Delete Notice
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notice Details Drawer                                              */
/* ------------------------------------------------------------------ */

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}

function NoticeDetailsDrawer({ open, onClose, notice, loading, onEdit, onDelete, }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-base font-semibold text-gray-900">Notice Details</h3>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading || !notice ? (
              <DrawerSkeleton />
            ) : (
              <div className="px-6 py-5">
                <NoticeCategoryBadge category={notice.category} />
                <h2 className="mt-3 text-lg font-semibold text-gray-900">{notice.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-500">{notice.description}</p>

                <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow icon={User} label="Created By" value={createdByName(notice.createdBy)} />
                  <DetailRow icon={Calendar} label="Created Date" value={fmtDateTime(notice.createdAt)} />
                  <DetailRow icon={Info} label="Last Updated" value={fmtDateTime(notice.updatedAt)} />
                </div>
              </div>
            )}
          </div>

          {notice && (
            <div className="flex items-center gap-3 border-t border-gray-100 px-6 py-4">
              <button onClick={() => onEdit(notice)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                <Pencil className="h-4 w-4" /> Edit Notice
              </button>
              <button onClick={() => onDelete(notice)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100">
                <Trash2 className="h-4 w-4" /> Delete Notice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function NoticeManagementPage({ category, active,
  setActive,
  users, }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "All", sort: "newest" });

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = filters.category !== "All"
        ? await api.listByCategory(filters.category) // GET /api/adminNotic/category/:category
        : await api.list(); // GET /api/adminNotic
      setNotices(data);
    } catch (err) {
      toast.error(err?.response ? "Failed to load notices." : "Network error.");
    } finally {
      setLoading(false);
    }
  }, [filters.category]);

  useEffect(() => { loadNotices(); }, [loadNotices]);

  const stats = useMemo(() => {
    const latest = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return {
      total: notices.length,
      publishedToday: notices.filter((n) => isToday(n.createdAt)).length,
      categories: CATEGORIES.length,
      latest,
    };
  }, [notices]);

  const filteredNotices = useMemo(() => {
    let list = [...notices];
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((n) => n.title?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q));
    }
    list.sort((a, b) => (filters.sort === "oldest"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)));
    return list;
  }, [notices, filters.search, filters.sort]);

  const openView = (n) => { setActiveNotice(n); setDrawerOpen(true); };
  const openEdit = (n) => { setActiveNotice(n); setDrawerOpen(false); setEditOpen(true); };
  const openDelete = (n) => { setActiveNotice(n); setDrawerOpen(false); setDeleteOpen(true); };

  const handleCreated = (created) => setNotices((prev) => [created, ...prev]);
  const handleUpdated = (updated) => {
    setNotices((prev) => prev.map((n) => ((n._id || n.id) === (updated._id || updated.id) ? updated : n)));
    setActiveNotice(updated);
  };
  const handleDeleted = (id) => {
    setNotices((prev) => prev.filter((n) => (n._id || n.id) !== id));
    setDrawerOpen(false);
  };

  const isFiltering = filters.search || filters.category !== "All";

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
      />

      {/* Main */}
      <div className="ml-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar
          users={users}
          setActive={setActive}
        />

        {/* Page */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-gray-50/60">
          <Toaster position="top-right" toastOptions={{
            className: "rounded-2xl! shadow-lg! text-sm!",
            success: { iconTheme: { primary: "#4f46e5", secondary: "#fff" } },
          }} />

          <div className="mx-auto max-w-7xl space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Notice Management</h1>
                <p className="mt-1 text-sm text-gray-500">Create, publish, organize, and manage society notices to keep all residents informed.</p>
              </div>
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[.98]"
              >
                <Plus className="h-4 w-4" /> Create Notice
              </button>
            </div>

            {/* Stats */}
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NoticeStatsCard icon={FileText} label="Total Notices" value={stats.total} accent="indigo" />
                <NoticeStatsCard icon={Calendar} label="Published Today" value={stats.publishedToday} accent="green" />
                <NoticeStatsCard icon={Tag} label="Categories" value={stats.categories} accent="purple" />
                <NoticeStatsCard
                  icon={Megaphone}
                  label="Latest Notice"
                  value={stats.latest ? stats.latest.title : "—"}
                  sub={stats.latest ? fmtDate(stats.latest.createdAt) : undefined}
                  accent="orange"
                />
              </div>
            )}

            {/* Filters */}
            <SearchFilterBar filters={filters} setFilters={setFilters} />

            {/* Table / Empty / Loading */}
            {loading ? (
              <TableSkeleton />
            ) : filteredNotices.length === 0 ? (
              <EmptyState onCreate={() => setCreateOpen(true)} filtered={!!isFiltering} />
            ) : (
              <NoticeTable notices={filteredNotices} onView={openView} onEdit={openEdit} onDelete={openDelete} />
            )}
          </div>

          {/* Modals & Drawer */}
          <CreateNoticeModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
          <EditNoticeModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={handleUpdated} notice={activeNotice} />
          <DeleteNoticeModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onDeleted={handleDeleted} notice={activeNotice} />
          <NoticeDetailsDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            notice={activeNotice}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </main>
      </div>
    </div>
  );
}   