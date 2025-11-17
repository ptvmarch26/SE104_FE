import { createContext, useContext, useState } from "react";
import {
  getSuppliers,
//   createSupplier,
//   updateSupplier,
//   deleteSupplier,
} from "../services/api/SupplierApi";

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data?.result || []);
    return data;
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        setSuppliers,
        fetchSuppliers,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
