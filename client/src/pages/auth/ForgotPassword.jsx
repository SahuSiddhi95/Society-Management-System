import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://society-management-system-qcfx.onrender.com/api/auth/forgot-password",
        {
          email,
        }
      );

      toast.success(response.data.message || "OTP sent successfully");

      // Move to OTP page
      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#111111] flex items-center justify-center px-3">
      <div className="w-full max-w-[420px]">
        {/* Steps */}
        <div className="flex items-center justify-center mb-6">
          {/* Step 1 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
              ✓
            </div>

            <div className="w-12 h-[2px] bg-blue-600" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-blue-600 flex items-center justify-center text-blue-400 text-sm">
              2
            </div>

            <div className="w-12 h-[2px] bg-blue-600" />
          </div>

          {/* Step 3 */}
          <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-blue-600 flex items-center justify-center text-blue-400 text-sm">
            3
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
              <MdAdminPanelSettings className="text-white text-2xl" />
            </div>

            <div>
              <p className="text-gray-500 uppercase text-xs tracking-[3px]">
                Step 1 of 3
              </p>

              <h1 className="text-lg font-semibold text-white">
                Shri Ram Residency
              </h1>

              <p className="text-gray-400 text-xs">
                Society Management System
              </p>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Forgot password?
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Enter your email and we'll send you an OTP.
          </p>

          {/* Info Box */}
          <div className="bg-[#172554] border border-blue-700 rounded-xl p-4 mb-5">
            <p className="text-blue-200 text-sm">
              A password reset OTP will be sent to your registered email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleForgotPassword}>
            {/* Input */}
            <div className="mb-5">
              <label className="block text-gray-300 text-sm mb-2">
                Email address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#222222] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-sm font-medium text-white transition mb-5"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* Back */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;