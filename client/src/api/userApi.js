// src/api/userApi.js

import API from "./axios";


// Common Config
const getConfig = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ==============================
// GET USER DETAILS
// ==============================
export const getUserDetails =
  async () => {

    try {

      const res = await API.get(
        "/auth/details",
        getConfig()
      );

      return res.data;

    } catch (error) {

      throw (
        error.response?.data ||
        error.message
      );
    }
  };