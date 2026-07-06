import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/admin-login", formData);
      if (data.role !== "admin") {
        toast.error("Access denied. Admin only.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      toast.success("Admin login successful");
     navigate("/admin-dashboard", { replace: true });
    } catch (error) {
      if (error.response?.data?.message === "Invalid email") {
        toast.error("Email does not exist");
      } else if (error.response?.data?.message === "Wrong password") {
        toast.error("Incorrect password");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {/* Fills remaining space, centers the card, no scroll */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-6 overflow-hidden">

        {/* Card — fixed width, auto height, no scroll */}
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
          <p className="text-xs text-gray-400 mb-4">Sign in to manage your society</p>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-xl p-1 mb-5">
            <button
              type="button"
              className="py-2 text-xs font-medium rounded-lg bg-white text-gray-900 shadow-sm"
            >
              🔑 Admin
            </button>
            <button
              type="button"
              onClick={() => navigate("/user-login")}
              className="py-2 text-xs font-medium rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
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
                name="email"
                placeholder="admin@societyos.in"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#2c39f2] transition-colors placeholder:text-gray-600"
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
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1c1c1e] border border-[#2a2a2e] rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white outline-none focus:border-[#2c39f2] transition-colors placeholder:text-gray-600"
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
              {loading ? "Signing in..." : "Sign in as Admin"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
            >
              <FaGoogle size={12} color="#EA4335" />
              Sign in with Google
            </button>
          </form>

          {/* Footer */}
          <p className="mt-4 text-[11px] text-gray-400 text-center">
            New to SocietyOS?{" "}
            <button
              type="button"
              onClick={() => navigate("/contact-admin")}
              className="text-[#2c39f2] font-medium hover:underline"
            >
              Contact your admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;