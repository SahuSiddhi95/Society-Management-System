import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../../api/complaintApi";

function ComplaintStatusCard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const data = await getAllComplaints();

      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(
        "Fetch Complaint Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Resolve Complaint
  const resolveComplaint = async (id) => {
    try {
      await updateComplaintStatus(id, "resolved");

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, status: "resolved" }
            : c
        )
      );
    } catch (error) {
      console.log(
        "Resolve Complaint Error:",
        error.response?.data || error.message
      );
    }
  };

  // Counts
  const pendingCount = complaints.filter(
    (c) => c.status === "pending"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status === "resolved"
  ).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600">📋</span>
          Complaint Status
        </h3>
      </div>

      {/* Status Cards */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-white border border-orange-100/50 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-200/40 rounded-full blur-xl group-hover:bg-orange-300/40 transition-colors"></div>
          <p className="text-3xl font-extrabold text-orange-600 relative z-10">
            {pendingCount}
          </p>
          <p className="text-xs font-medium text-gray-500 mt-1 relative z-10">
            Pending
          </p>
        </div>

        <div className="flex-1 bg-gradient-to-br from-green-50 to-white border border-green-100/50 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-200/40 rounded-full blur-xl group-hover:bg-green-300/40 transition-colors"></div>
          <p className="text-3xl font-extrabold text-green-600 relative z-10">
            {resolvedCount}
          </p>
          <p className="text-xs font-medium text-gray-500 mt-1 relative z-10">
            Resolved
          </p>
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-medium text-gray-500">No complaints found</p>
          </div>
        ) : (
          complaints.slice(0, 3).map((c, i) => (
            <div
              key={c._id}
              className={`flex justify-between gap-3 pb-4 ${i !== complaints.slice(0, 3).length - 1
                  ? "border-b border-gray-100"
                  : ""
                } hover:bg-gray-50/50 p-2 -mx-2 rounded-lg transition-colors`}
            >
              {/* Left */}
              <div className="flex gap-3 items-start">
                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${c.status === "pending"
                      ? "bg-orange-400 shadow-orange-200"
                      : "bg-green-400 shadow-green-200"
                    }`}
                ></span>

                <div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {c.title}
                  </p>

                  <p className="text-xs font-medium text-gray-400 mt-1 capitalize">
                    {c.status} • <span className="text-gray-500">{c.user?.name || "Resident"}</span>
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex-shrink-0 flex items-start">
                {c.status === "pending" ? (
                  <button
                    onClick={() => resolveComplaint(c._id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-md bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 hover:shadow-sm transition-all active:scale-95"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-green-50 text-green-600 border border-green-100 shadow-sm">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintStatusCard;