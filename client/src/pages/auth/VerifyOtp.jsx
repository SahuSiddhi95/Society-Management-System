import { useEffect, useRef, useState } from "react";

import API from "../../api/axios";

import { useLocation, useNavigate } from "react-router-dom";

import { MdOutlineMail, MdAccessTime, MdArrowForward } from "react-icons/md";

import toast from "react-hot-toast";

const VerifyOtp = () => {
  // OTP STATE
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // TIMER
  const [timer, setTimer] = useState(30);

  // LOADING
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const navigate = useNavigate();

  const location = useLocation();

  // GET EMAIL FROM FORGOT PASSWORD PAGE
  const email = location.state?.email;

  // REDIRECT IF EMAIL NOT FOUND
  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // TIMER
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP CHANGE
  const handleChange = (value, index) => {
    // ALLOW ONLY NUMBERS
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);

    // MOVE TO NEXT INPUT
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // BACKSPACE MOVE
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    try {
      const res = await API.post("/auth/resend-otp", {
        email,
      });

      toast.success(res.data.message || "OTP resent successfully");

      // RESET TIMER
      setTimer(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  // VERIFY OTP
  const handleVerify = async () => {
    const finalOtp = otp.join("");

    // VALIDATION
    if (finalOtp.length !== 6) {
      toast.error("Please enter valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      // API CALL
      const res = await API.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success(res.data.message || "OTP verified successfully");

      // NAVIGATE RESET PASSWORD PAGE
      navigate("/reset-password", {
        state: {
          email,
          otp: finalOtp,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0b0b0f] flex items-center justify-center px-3">
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[420px]">
        {/* STEPS */}
        <div className="flex items-center justify-center mb-5">
          {/* STEP 1 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              ✓
            </div>

            <div className="w-12 h-[1px] bg-blue-600" />
          </div>

          {/* STEP 2 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
              2
            </div>

            <div className="w-12 h-[1px] bg-[#2d2d2d]" />
          </div>

          {/* STEP 3 */}
          <div className="w-8 h-8 rounded-full border border-[#3a3a3a] bg-[#171717] text-gray-400 text-xs flex items-center justify-center">
            3
          </div>
        </div>

        {/* CARD */}
        <div className="bg-[#151518] border border-[#252525] rounded-2xl p-5 shadow-2xl">
          {/* TITLE */}
          <h1 className="text-white text-2xl font-semibold mb-1">Verify OTP</h1>

          <p className="text-gray-400 text-sm mb-5">
            Enter the 6-digit code sent to your email
          </p>

          {/* EMAIL */}
          <div className="inline-flex items-center gap-2 bg-[#101014] border border-[#2f2f2f] rounded-full px-3 py-2 mb-5">
            <MdOutlineMail className="text-gray-400 text-sm" />

            <p className="text-gray-300 text-xs">{email}</p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-between gap-2 mb-5">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 bg-[#0f0f12] border border-[#343434] rounded-xl text-center text-lg text-white outline-none focus:border-blue-500 transition"
              />
            ))}
          </div>

          {/* TIMER + RESEND */}
          <div className="flex items-center justify-between mb-5">
            {/* TIMER */}
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <MdAccessTime />

              <span>
                00:
                {timer < 10 ? `0${timer}` : timer}
              </span>
            </div>

            {/* RESEND BUTTON */}
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`text-xs transition ${timer > 0
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-blue-400 hover:text-blue-300"
                }`}
            >
              Resend OTP
            </button>
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl py-3 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}

            {!loading && <MdArrowForward className="text-base" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
