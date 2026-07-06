// src/components/common/BackButton.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DASHBOARD_PATH = "/admin/dashboard";

export default function BackButton({ fallbackPath = DASHBOARD_PATH, className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // React Router gives the very first history entry in a session the key
    // "default". If that's where we are (e.g. the page was opened directly
    // via URL, a refresh, or a new tab), there's nothing to go back to —
    // navigate(-1) would just leave the app. Fall back to the dashboard then.
    const hasPreviousPage = location.key !== "default";

    if (hasPreviousPage) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      title="Back"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}