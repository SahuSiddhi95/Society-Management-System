import axios from "../axios";

export const getSocietyConfig = async () => {
  const { data } = await axios.get("/society");
  return data.data; // Server returns { success: true, data: { ... } }
};

export const updateSocietyConfig = async (config) => {
  const { data } = await axios.put("/society", config);
  return data.data;
};
