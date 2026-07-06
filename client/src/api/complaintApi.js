import API from "./axios";

const BASE = "/complaints";

// ================= USER =================

// Create Complaint
export const createComplaint = (data) =>
  API.post(BASE, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res.data);

// Get Logged In User Complaints
export const getMyComplaints = () =>
  API.get(`${BASE}/my`).then((res) => res.data);

// ================= ADMIN =================

// Get All Complaints
export const getAllComplaints = (params = {}) =>
  API.get(BASE, { params }).then((res) => res.data);

// Get Complaint By Id
export const getComplaintById = (id) =>
  API.get(`${BASE}/${id}`).then((res) => res.data);

// Update Complaint
export const updateComplaint = (id, data) =>
  API.put(`${BASE}/${id}`, data).then((res) => res.data);

// Update Complaint Status
export const updateComplaintStatus = (id, status) =>
  API.put(`${BASE}/${id}/status`, {
    status,
  }).then((res) => res.data);

// Delete Complaint
export const deleteComplaint = (id) =>
  API.delete(`${BASE}/${id}`).then((res) => res.data);

// Get Complaints By Category
export const getComplaintsByCategory = (category) =>
  API.get(`${BASE}/category/${category}`).then((res) => res.data);

// Get Complaint Dashboard Stats
export const getComplaintStats = () =>
  API.get(`${BASE}/stats`).then((res) => res.data);