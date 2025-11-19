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
    const res = await createPurchaseOrder(supplier, items);

    if (res.EC === 0) {
      setOrders((prev) => [res.result, ...prev]);
    }

    return res;
  };

  const handleUpdatePurchaseOrder = async (id, updateData) => {
    const res = await updatePurchaseOrder(id, updateData);

    if (res.EC === 0) {
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? res.result : order))
      );
    }

    return res;
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
