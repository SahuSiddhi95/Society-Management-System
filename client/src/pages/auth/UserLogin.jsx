import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [adminContact, setAdminContact] = useState(null);
  const [fetchingContact, setFetchingContact] = useState(false);

  const handleOpenContactModal = async () => {
    setShowContactModal(true);
    setFetchingContact(true);
    try {
      const { data } = await API.get("/auth/admin-contact");
      setAdminContact(data?.data || null);
    } catch (err) {
      setAdminContact(null);
    } finally {
      setFetchingContact(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/user-login", { email, password });
      if (res.data?.role === "admin") {
        toast.error("Admins must use Admin Login");
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      toast.success("Login successful");
      setTimeout(() => navigate("/user-dashboard", { replace: true }), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/google-login", { 
        token: credentialResponse.credential,
        role: "user"
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      toast.success("Google Login successful");
      setTimeout(() => navigate("/user-dashboard", { replace: true }), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="light" />

      <div className="flex h-screen overflow-hidden font-sans">

        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex w-[45%] bg-[#2c39f2] flex-col justify-between px-10 py-8 text-white relative overflow-hidden">

          {/* BG circles */}
          <div className="absolute w-80 h-80 rounded-full bg-white/5 -bottom-16 -left-16 pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full bg-white/5 -top-10 -right-10 pointer-events-none" />

          {/* Logo */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shrink-0">
              <span className="text-[#2c39f2] font-extrabold text-xl">S</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">SocietyOS</span>
          </div>

          {/* Middle */}
          <div className="z-10 space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3.5 py-1.5 text-xs">
              <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
              Trusted by 2+ societies across India
            </div>

            <h1 className="text-[2.2rem] font-extrabold leading-[1.15] tracking-tight">
              Manage your society{" "}
              <span className="text-blue-300">smarter,</span>{" "}
              not harder
            </h1>

            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Residents, dues, complaints, notices, and reports — all in one platform built for Indian residential societies.
            </p>

            <div className="flex flex-wrap gap-4">
              {["No credit card needed", "Setup in 5 minutes", "Free for small societies"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-[11px] text-white/70">
                  <span className="w-2.5 h-2.5 border border-white/50 rounded-sm shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="z-10">
            <div className="h-px bg-white/20 mb-5" />
            <div className="flex">
              {[
                { val: "2+", label: "Societies" },
                { val: "2+", label: "Residents" },
                { val: "₹40Cr+", label: "Dues collected" },
              ].map((s, i) => (
                <div key={s.label} className={`flex-1 ${i !== 0 ? "border-l border-white/20 pl-5" : ""}`}>
                  <div className="text-2xl font-extrabold tracking-tight">{s.val}</div>
                  <div className="text-[11px] text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center px-6 overflow-hidden">

          {/* Card */}
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg px-7 py-6">

            {/* Top logo */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-[#2c39f2] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-extrabold text-sm">S</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 tracking-tight">SocietyOS</span>
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-0.5">Welcome back</h2>
            <p className="text-xs text-gray-400 mb-4">Sign in to access your society account.</p>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => navigate("/admin-login")}
                className="py-2 text-xs font-medium rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                🔑 Admin
              </button>
              <button
                type="button"
                className="py-2 text-xs font-medium rounded-lg bg-white text-gray-900 shadow-sm"
              >
                👤 Resident
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-3">

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="resident@societyos.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none focus:border-[#2c39f2] focus:ring-1 focus:ring-[#2c39f2] transition-colors placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-gray-900 outline-none focus:border-[#2c39f2] focus:ring-1 focus:ring-[#2c39f2] transition-colors placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-[11px] text-[#2c39f2] font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-semibold text-gray-900 transition-colors"
              >
                {loading ? "Signing In..." : "Sign in as Resident"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google */}
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login Failed")}
                  width="100%"
                  theme="outline"
                  size="large"
                />
              </div>
            </form>

            {/* Footer */}
            <p className="mt-4 text-[11px] text-gray-400 text-center">
              New to SocietyOS?{" "}
              <button
                type="button"
                onClick={handleOpenContactModal}
                className="text-[#2c39f2] font-medium hover:underline"
              >
                Contact your admin
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Admin Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Contact Admin</h3>
                <p className="text-[10px] text-indigo-100 mt-0.5">Society Management System</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {fetchingContact ? (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400">Loading details...</p>
                </div>
              ) : adminContact ? (
                <div className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      👤
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Admin Name</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{adminContact.name}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      ✉️
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Email Address</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{adminContact.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                      📞
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Phone Number</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{adminContact.phone || "—"}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <a
                      href={`mailto:${adminContact.email}`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-xl transition-all text-center"
                    >
                      ✉️ Send Email
                    </a>
                    {adminContact.phone ? (
                      <a
                        href={`tel:${adminContact.phone}`}
                        className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all text-center"
                      >
                        📞 Call Admin
                      </a>
                    ) : (
                      <button
                        disabled
                        className="opacity-50 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed text-center"
                      >
                        📞 Call Admin
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-2xl mb-2">⚠️</div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Admin contact details are currently unavailable. Please check with your society office.
                  </p>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLogin;