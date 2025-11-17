import { createContext, useContext, useState } from "react";

import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
} from "../services/api/PurchaseOrderApi";

const PurchaseOrderContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchPurchaseOrders = async () => {
    const data = await getPurchaseOrders();
    setOrders(data?.result || []);
    return data;
  };

  const fetchPurchaseOrderById = async (id) => {
    const data = await getPurchaseOrderById(id);
    setOrderDetail(data?.result || null);
    return data;
  };

  const handleCreatePurchaseOrder = async (supplier, items) => {
    return await createPurchaseOrder(supplier, items);
  };

  const handleUpdatePurchaseOrder = async (id, updateData) => {
    return await updatePurchaseOrder(id, updateData);
  };

  return (
    <PurchaseOrderContext.Provider
      value={{
        orders,
        orderDetail,
        setOrders,
        setOrderDetail,
        fetchPurchaseOrders,
        fetchPurchaseOrderById,
        handleCreatePurchaseOrder,
        handleUpdatePurchaseOrder,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
};

export const usePurchaseOrder = () => useContext(PurchaseOrderContext);
