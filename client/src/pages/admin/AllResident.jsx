import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { createUser, getAllUsers, updateUser, deleteUser } from "../../api/Admin/userApi";
import hotToast, { Toaster } from "react-hot-toast";
// ── mock API shim – replace with your real API calls ──────────────────────────
// const mockResidents = [
//   { id: 1, name: "Priya Sharma",    unit: "A-101", phone: "98765 43210", email: "priya@mail.com",   status: "active",  joinDate: "2023-01-15", avatar: "PS" },
//   { id: 2, name: "Rajan Mehta",     unit: "B-204", phone: "91234 56789", email: "rajan@mail.com",   status: "active",  joinDate: "2022-08-22", avatar: "RM" },
//   { id: 3, name: "Sneha Tiwari",    unit: "C-305", phone: "99001 23456", email: "sneha@mail.com",   status: "inactive",joinDate: "2021-11-03", avatar: "ST" },
//   { id: 4, name: "Arjun Verma",     unit: "A-202", phone: "87654 32109", email: "arjun@mail.com",   status: "active",  joinDate: "2023-05-10", avatar: "AV" },
//   { id: 5, name: "Divya Nair",      unit: "D-401", phone: "93456 78901", email: "divya@mail.com",   status: "active",  joinDate: "2024-02-28", avatar: "DN" },
//   { id: 6, name: "Karan Patel",     unit: "B-103", phone: "96543 21098", email: "karan@mail.com",   status: "inactive",joinDate: "2022-04-17", avatar: "KP" },
// ];

const avatarColors = [
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#FBEAF0", text: "#72243E" },
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#FAECE7", text: "#712B13" },
];

const colorFor = (i) => avatarColors[i % avatarColors.length];

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  flatNo: "",
  floor: "",
  flatType: "2BHK",
  familyMembersCount: 0,
  familyMembers: [],
};

export default function Residents() {
  const { users } = useOutletContext();
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [viewResident, setView] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editResidentId, setEditResidentId] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const data = await getAllUsers();
      // Keep admin details out of resident panel
      setResidents(data.filter((u) => u.role !== "admin"));
    } catch (error) {
      console.log(error);
    }
  };

  // ── helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = residents.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.flatNo?.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!editResidentId && !form.password.trim()) e.password = "Password is required";
    if (!form.flatNo.trim()) e.flatNo = "Flat No is required";
    if (!form.phone.trim()) e.phone = "Phone is required";

    // No longer validating family member details as they've been removed

    return e;
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const newMembers = [...form.familyMembers];
    if (!newMembers[index]) {
      newMembers[index] = { name: "", age: "", relation: "" };
    }
    newMembers[index][field] = value;
    setForm({ ...form, familyMembers: newMembers });
  };

  const handleSave = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        flatNo: form.flatNo,
        floor: Number(form.floor),
        flatType: form.flatType,
        familyMembersCount: Number(form.familyMembersCount),
        familyMembers: form.familyMembers.slice(0, form.familyMembersCount),
        role: "user",
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (editResidentId) {
        await updateUser(editResidentId, payload);
        showToast("Resident updated successfully");
      } else {
        await createUser(payload);
        showToast("Resident added successfully");
      }

      setForm(EMPTY_FORM);
      setErrors({});
      setShowModal(false);
      setEditResidentId(null);

      // Refresh resident list
      const users = await getAllUsers();
      setResidents(users.filter((u) => u.role !== "admin"));
    } catch (error) {
      showToast(
        error?.message ||
        error?.response?.data?.message ||
        "Failed to add resident",
        "danger",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    const r = residents.find((x) => x._id === id);
    
    hotToast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-800">
          Are you sure you want to remove <strong>{r?.name}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            onClick={() => hotToast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            onClick={async () => {
              hotToast.dismiss(t.id);
              try {
                await deleteUser(id);
                showToast(`${r?.name} removed.`, "danger");
                
                const users = await getAllUsers();
                setResidents(users.filter((u) => u.role !== "admin"));
                setView(null);
              } catch (error) {
                showToast(
                  error?.message || "Failed to remove resident",
                  "danger"
                );
              }
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: "top-center" });
  };

  const inputCls = (field) =>
    `w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all ${errors[field]
      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
    }`;

  return (
    <>
      <Toaster />
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "danger"
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
        >
          <span className="text-base">
            {toast.type === "danger" ? "🗑️" : "✅"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Residents
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all society members
          </p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setErrors({});
            setEditResidentId(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Resident
        </button>
      </div>

      {/* ── Stat pills ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          {
            label: "Total",
            value: residents.length,
            color: "bg-indigo-50 text-indigo-700 border-indigo-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${s.color}`}
          >
            <span className="text-lg font-bold">{s.value}</span>
            <span className="font-medium opacity-75">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Search + Filter bar ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, unit or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition text-gray-700"
        >
          <option value="all">All Status</option>
        </select>
      </div>

      {/* ── Residents Table ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-12 h-12 mb-3 opacity-40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
              />
            </svg>
            <p className="text-sm font-medium">No residents found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  Resident
                </th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                  flatNo
                </th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                  Phone
                </th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">
                  Joined
                </th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  flatType
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const clr = colorFor(i);
                return (
                  <tr
                    key={r._id}
                    className="border-b border-gray-50 hover:bg-indigo-50/30 cursor-pointer transition-colors"
                    onClick={() => setView(r)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: clr.bg, color: clr.text }}
                        >
                          {r.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {r.name}
                          </p>
                          <p className="text-xs text-gray-400">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-mono text-xs hidden sm:table-cell">
                      {r.flatNo}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">
                      {r.phone}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-medium">
                      {r.flatType || "-"}
                    </td>
                    <td
                      className="px-4 py-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setView(r)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="View details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setForm({
                              name: r.name || "",
                              email: r.email || "",
                              password: "",
                              phone: r.phone || "",
                              flatNo: r.flatNo || "",
                              floor: r.floor || "",
                              flatType: r.flatType || "2BHK",
                              familyMembersCount: r.familyMembersCount || 0,
                              familyMembers: r.familyMembers || [],
                            });
                            setEditResidentId(r._id);
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-right">
        Showing {filtered.length} of {residents.length} residents
      </p>

      {/* ══ ADD RESIDENT MODAL ════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            {/* header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Add New Resident
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditResidentId(null);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* body */}
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    placeholder="Priya Sharma"
                    className={inputCls("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    placeholder="email@example.com"
                    className={inputCls("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="0000000000"
                    className={inputCls("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Password {editResidentId ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    placeholder={editResidentId ? "Enter new password..." : "Enter Password"}
                    className={inputCls("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Flat No *
                  </label>
                  <input
                    type="text"
                    value={form.flatNo}
                    onChange={(e) => {
                      setForm({ ...form, flatNo: e.target.value });
                      setErrors({ ...errors, flatNo: "" });
                    }}
                    placeholder="e.g. A-101"
                    className={inputCls("flatNo")}
                  />
                  {errors.flatNo && (
                    <p className="text-xs text-red-500 mt-1">{errors.flatNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Floor *
                  </label>
                  <div className="relative">
                    <select
                      value={form.floor}
                      onChange={(e) => setForm({ ...form, floor: e.target.value })}
                      className={`appearance-none ${inputCls("floor")}`}
                    >
                      <option value="" disabled>Select Floor</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}{i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Floor
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Flat Type *
                  </label>
                  <div className="relative">
                    <select
                      value={form.flatType}
                      onChange={(e) => setForm({ ...form, flatType: e.target.value })}
                      className={`appearance-none ${inputCls("flatType")}`}
                    >
                      <option value="1BHK">1 BHK</option>
                      <option value="2BHK">2 BHK</option>
                      <option value="3BHK">3 BHK</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Family Members Section */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Members in Your Family
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.familyMembersCount}
                  onChange={(e) => {
                    const count = Number(e.target.value);
                    setForm({ ...form, familyMembersCount: count });
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border text-sm text-gray-800 outline-none transition-all border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Family member details block removed per request */}

            </div>
            {/* footer */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditResidentId(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Saving…
                  </>
                ) : (
                  editResidentId ? "Save Changes" : "Add Resident"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ VIEW RESIDENT DRAWER ══════════════════════════════════════════ */}
      {viewResident && (
        <div className="fixed inset-0 z-40 flex items-center justify-end p-4">
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setView(null)}
          />
          <div className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 h-fit">
            <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">
                Resident Details
              </h2>
              <button
                onClick={() => setView(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6">
              {/* avatar + name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={colorFor(
                    residents.findIndex((r) => r.id === viewResident.id),
                  )}
                >
                  {viewResident.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg leading-tight">
                    {viewResident.name}
                  </p>
                </div>
              </div>
              {/* detail rows */}
              <div className="space-y-3">
                {[
                  {
                    icon: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM3 7l9 6 9-6",
                    label: "Email",
                    value: viewResident.email,
                  },
                  {
                    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                    label: "Phone",
                    value: viewResident.phone,
                  },
                  {
                    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                    label: "flatNo",
                    value: viewResident.flatNo,
                  },
                  {
                    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                    label: "Floor",
                    value: viewResident.floor || "-",
                  },
                  {
                    icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
                    label: "Flat Type",
                    value: viewResident.flatType || "-",
                  },
                  {
                    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                    label: "Joined",
                    value: viewResident.createdAt
                      ? new Date(viewResident.createdAt).toLocaleDateString(
                        "en-IN",
                      )
                      : "-",
                  },
                ].map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {viewResident.familyMembers && viewResident.familyMembers.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Family Members ({viewResident.familyMembersCount})</h4>
                  <div className="space-y-2">
                    {viewResident.familyMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-100/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                            {member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{member.name}</p>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{member.relation}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                          {member.age} yrs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-5 flex gap-2">
              <button
                onClick={() => setView(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(viewResident.id)}
                className="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-sm font-semibold transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}