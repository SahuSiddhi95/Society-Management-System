import API from "../axios";

// Get All Users
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  const { data } = await API.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// Create User / Resident
export const createUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await API.post(
      "/admin/create-user",
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Something went wrong",
      }
    );
  }
};

// Update User
export const updateUser = async (id, userData) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await API.put(
      `/admin/users/${id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update user",
      }
    );
  }
};

// Delete User
export const deleteUser = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await API.delete(`/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete user",
      }
    );
  }
};