import AxiosInstance from "./AxiosInstance";

export const getSuppliers = async () => {
  try {
    const res = await AxiosInstance.get("/supplier");
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const getSupplierById = async (id) => {
  try {
    const res = await AxiosInstance.get(`/supplier/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const createSupplier = async (supplierData) => {
  try {
    const res = await AxiosInstance.post(`/supplier/create`, supplierData);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const updateSupplier = async (id, updateData) => {
  try {
    const res = await AxiosInstance.patch(`/supplier/${id}`, updateData);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const deleteSupplier = async (id) => {
  try {
    const res = await AxiosInstance.delete(`/supplier/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};
