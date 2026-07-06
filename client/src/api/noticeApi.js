// api/noticeApi.js

import API from "./axios";

export const getAllNotices = async () => {

  const token = localStorage.getItem("token");

  const res = await API.get(
    "/adminNotic/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  

  return res.data.data;
};

export const getNoticeByCategory = async (category) => {
  const { data } = await API.get(
    `/adminNotic/category/${category}`
  );

  return data;
};