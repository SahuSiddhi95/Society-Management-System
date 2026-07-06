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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
          Complaint Status
        </h3>
      </div>

      {/* Status Cards */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-orange-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-orange-600">
            {pendingCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Pending
          </p>
        </div>

        <div className="flex-1 bg-green-50 rounded-xl p-3">
          <p className="text-2xl font-bold text-green-600">
            {resolvedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Resolved
          </p>
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <p className="text-sm text-gray-500">
            No complaints found
          </p>
        ) : (
          complaints.slice(0, 3).map((c, i) => (
            <div
              key={c._id}
              className={`flex justify-between gap-3 pb-4 ${
                i !== complaints.slice(0, 3).length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              {/* Left */}
              <div className="flex gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    c.status === "pending"
                      ? "bg-orange-400"
                      : "bg-green-400"
                  }`}
                ></span>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {c.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {c.status} • {c.user?.name || "Resident"}
                  </p>
                </div>
              </div>

              {/* Right */}
              {c.status === "pending" ? (
                <button
                  onClick={() => resolveComplaint(c._id)}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100"
                >
                  Resolve
                </button>
              ) : (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600 h-fit">
                  Resolved
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintStatusCard;