import AxiosInstance from "./AxiosInstance";

export const getSaleInvoices = async () => {
  try {
    const res = await AxiosInstance.get("/sale_invoice");
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const getSaleInvoiceById = async (id) => {
  try {
    const res = await AxiosInstance.get(`/sale_invoice/${id}`);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};

export const createSaleInvoice = async (invoiceData) => {
  try {
    const res = await AxiosInstance.post("/sale_invoice/create", invoiceData);
    return res.data;
  } catch (error) {
    return error.response?.data || "Lỗi kết nối server";
  }
};
