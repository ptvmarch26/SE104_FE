import AxiosInstance from "./AxiosInstance";

export const getSuppliers = async () => {
  try {
    const res = await AxiosInstance.get("/supplier");
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};
