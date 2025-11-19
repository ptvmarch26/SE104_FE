import { createContext, useContext, useState } from "react";

import {
  getSaleInvoices,
  getSaleInvoiceById,
  createSaleInvoice,
} from "../services/api/SaleInvoiceApi";

const SaleInvoiceContext = createContext();

export const SaleInvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceDetail, setInvoiceDetail] = useState(null);

  const fetchSaleInvoices = async () => {
    const data = await getSaleInvoices();
    setInvoices(data?.result || []);
    return data;
  };

  const fetchSaleInvoiceById = async (id) => {
    const data = await getSaleInvoiceById(id);
    setInvoiceDetail(data?.result || null);
    return data;
  };

  const handleCreateSaleInvoice = async (invoiceData) => {
    const res = await createSaleInvoice(invoiceData);

    if (res.EC === 0) {
      setInvoices((prev) => [res.result, ...prev]);
    }

    return res;
  };

  return (
    <SaleInvoiceContext.Provider
      value={{
        invoices,
        invoiceDetail,
        setInvoices,
        setInvoiceDetail,
        fetchSaleInvoices,
        fetchSaleInvoiceById,
        handleCreateSaleInvoice,
      }}
    >
      {children}
    </SaleInvoiceContext.Provider>
  );
};

export const useSaleInvoice = () => useContext(SaleInvoiceContext);
