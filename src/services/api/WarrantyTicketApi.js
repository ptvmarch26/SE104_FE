import AxiosInstance from "./AxiosInstance";

export const getWarrantyTickets = async (status) => {
  try {
    const res = await AxiosInstance.get("/warranty/tickets", {
      params: { status },
    });
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const createWarrantyTicket = async (ticketData) => {
  try {
    const res = await AxiosInstance.post("/warranty/ticket", ticketData);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const updateWarrantyStatus = async (id, status, manager) => {
  try {
    const res = await AxiosInstance.patch(`/warranty/ticket/${id}/status`, {
      status,
      manager,
    });
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};
