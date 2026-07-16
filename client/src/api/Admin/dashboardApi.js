    import API from "../axios";

export const getDashboardStats = async () => {
  const { data } = await API.get("/dashboard");
  return data;
};  