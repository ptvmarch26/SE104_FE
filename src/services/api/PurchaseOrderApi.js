import AxiosInstance from "./AxiosInstance";

export const getPurchaseOrders = async () => {
  try {
    const res = await AxiosInstance.get("/purchase_order");
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const getPurchaseOrderById = async (id) => {
  try {
    const res = await AxiosInstance.get(`/purchase_order/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const createPurchaseOrder = async (supplier, items) => {
  try {
    const res = await AxiosInstance.post("/purchase_order/create", {
      supplier,
      items,
    });
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const updatePurchaseOrder = async (id, data) => {
  try {
    const res = await AxiosInstance.patch(`/purchase_order/update/${id}`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};
