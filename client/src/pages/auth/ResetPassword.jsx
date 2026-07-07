import { useState, useEffect } from "react";
import API from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MdLockReset,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
} from "react-icons/md";

import toast from "react-hot-toast";

const ResetPassword = () => {
  // PASSWORD STATES
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // SHOW / HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // LOADING
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // GET EMAIL + OTP FROM VERIFY OTP PAGE
  const email = location.state?.email;
  const otp = location.state?.otp;

  // REDIRECT IF DATA NOT FOUND
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  // RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // PASSWORD LENGTH
    if (password.length < 8) {
      toast.error("Password must be minimum 8 characters");
      return;
    }

    try {
      setLoading(true);

      // API CALL
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        password,
        confirmPassword,
      });

      toast.success(res.data.message || "Password reset successful");

      // REDIRECT LOGIN PAGE
      navigate("/user-login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password reset failed"
      );  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md">
        {/* PROGRESS STEPS */}
        <div className="flex items-center justify-center mb-6">
          {/* STEP 1 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
              ✓
            </div>

            <div className="w-12 h-[2px] bg-blue-600" />
          </div>

          {/* STEP 2 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
              ✓
            </div>

            <div className="w-12 h-[2px] bg-blue-600" />
          </div>

          {/* STEP 3 */}
          <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-blue-600 flex items-center justify-center text-blue-400 text-sm">
            3
          </div>
        </div>

        {/* CARD */}
        <div className="bg-[#1b1b1f] border border-[#2d2d2d] rounded-2xl p-5 shadow-xl">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-5">
            {/* ICON */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <MdLockReset className="text-white text-2xl" />
            </div>

            {/* TEXT */}
            <div>
              <p className="text-gray-500 uppercase text-xs tracking-[3px]">
                Step 3 of 3
              </p>

              <h1 className="text-white text-2xl font-semibold">
                Reset Password
              </h1>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-400 text-sm mb-5">
            Create a strong password for your account.
          </p>

          {/* FORM */}
          <form onSubmit={handleResetPassword}>
            {/* NEW PASSWORD */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#151515] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500"
                />

                {/* TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#151515] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500"
                />

                {/* TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                >
                  {showConfirmPassword ? (
                    <MdVisibilityOff />
                  ) : (
                    <MdVisibility />
                  )}
                </button>
              </div>
            </div>

            {/* PASSWORD RULES */}
            <div className="bg-[#151515] border border-[#2f2f2f] rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <MdCheckCircle className="text-green-500 text-lg" />
                <p className="text-gray-300 text-sm">
                  Minimum 8 characters
                </p>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <MdCheckCircle className="text-green-500 text-lg" />
                <p className="text-gray-300 text-sm">
                  One uppercase letter
                </p>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <MdCheckCircle className="text-green-500 text-lg" />
                <p className="text-gray-300 text-sm">
                  One number
                </p>
              </div>

              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-green-500 text-lg" />
                <p className="text-gray-300 text-sm">
                  One special character
                </p>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-white text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;