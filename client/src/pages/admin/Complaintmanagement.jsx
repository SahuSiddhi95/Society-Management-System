import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

// APIs
import {
  getAllComplaints,
  deleteComplaint as deleteComplaintApi,
  updateComplaintStatus as updateComplaintStatusApi,
} from "../../api/complaintApi";

// Components
import ComplaintFilters from "../../components/Admin/Complaintfilters";
import ComplaintTable from "../../components/Admin/Complainttable";
import ComplaintDetailsDrawer from "../../components/Admin/Complaintdetailsdrawer";
import DeleteConfirmModal from "../../components/Admin/Deleteconfirmmodal";
import Pagination from "../../components/Admin/Pagination";

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  status: "",
  page: 1,
  limit: 10,
};

const SEARCH_DEBOUNCE_MS = 350;

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 1,
  });

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const fetchComplaints = useCallback(
    async (showRefreshSpinner = false) => {
      showRefreshSpinner ? setRefreshing(true) : setLoading(true);

      try {
        const params = {
          page: filters.page,
          limit: filters.limit,
          ...(filters.search && { search: filters.search }),
          ...(filters.category && { category: filters.category }),
          ...(filters.status && { status: filters.status }),
        };

        const data = await getAllComplaints(params);

        setComplaints(data.complaints || []);

        setMeta({
          total: data.total || 0,
          pages: data.pages || 1,
        });
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            "Failed to load complaints"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints(false);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.page,
    fetchComplaints,
  ]);

  const refreshAll = () => {
    fetchComplaints(true);
  };

  const handleStatusChange = async (id, status) => {
    setStatusUpdatingId(id);

    try {
      await updateComplaintStatusApi(id, status);

      toast.success(`Complaint marked as ${status}`);

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );

      setSelectedComplaint((prev) =>
        prev && prev._id === id
          ? { ...prev, status }
          : prev
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteComplaintApi(deleteTarget._id);

      toast.success("Complaint deleted");

      setDeleteTarget(null);

      fetchComplaints(true);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete complaint"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Complaint Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review, track, and resolve resident complaints.
          </p>
        </div>

        {/* Filters */}
        <ComplaintFilters
          filters={filters}
          onChange={setFilters}
          onRefresh={refreshAll}
          refreshing={refreshing}
        />

        {/* Table */}
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          onView={setSelectedComplaint}
          onDelete={setDeleteTarget}
          onStatusChange={handleStatusChange}
          statusUpdatingId={statusUpdatingId}
        />

        {/* Pagination */}
        <Pagination
          page={filters.page}
          pages={meta.pages}
          total={meta.total}
          onPageChange={(page) =>
            setFilters((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>

      {/* Complaint Drawer */}
      {selectedComplaint && (
        <ComplaintDetailsDrawer
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={handleStatusChange}
          statusUpdating={
            statusUpdatingId === selectedComplaint._id
          }
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          complaint={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}