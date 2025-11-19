import { createContext, useContext, useState } from "react";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/api/SupplierApi";

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierDetail, setSupplierDetail] = useState(null);

  const fetchSuppliers = async () => {
    const res = await getSuppliers();
    if (res?.EC === 0) {
      setSuppliers(res.result);
    }
    return res;
  };

  const fetchSupplierDetail = async (id) => {
    const res = await getSupplierById(id);
    if (res?.EC === 0) {
      setSupplierDetail(res.result);
    }
    return res;
  };

  const addSupplier = async (supplierData) => {
    const res = await createSupplier(supplierData);
    if (res?.EC === 0) {
      setSuppliers((prev) => [res.result, ...prev]);
    }
    return res;
  };

  const editSupplier = async (id, updateData) => {
    const res = await updateSupplier(id, updateData);
    if (res?.EC === 0) {
      setSuppliers((prev) => prev.map((s) => (s._id === id ? res.result : s)));
    }
    return res;
  };

  const removeSupplier = async (id) => {
    const res = await deleteSupplier(id);
    console.log("res", res)
    if (res?.EC === 0) {
      setSuppliers((prev) => prev.filter((s) => s._id !== id));
    }
    return res;
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        supplierDetail,

        fetchSuppliers,
        fetchSupplierDetail,
        addSupplier,
        editSupplier,
        removeSupplier,

        setSuppliers,
        setSupplierDetail,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
