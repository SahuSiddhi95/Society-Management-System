import API from "../axios";

export const getPaymentHistory = async () => {
  const { data } = await API.get("/maintenance/history");
  return data.payments;
};