import { createContext, useContext, useState } from "react";
import {
  getWarrantyTickets,
  createWarrantyTicket,
  updateWarrantyStatus,
} from "../services/api/WarrantyTicketApi";

const WarrantyContext = createContext();

export const WarrantyProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketDetail, setTicketDetail] = useState(null);

  const fetchWarrantyTickets = async (status = "") => {
    const data = await getWarrantyTickets(status);
    setTickets(data?.data || []);
    return data;
  };

  const handleCreateTicket = async (ticketData) => {
    return await createWarrantyTicket(ticketData);
  };

  const handleUpdateStatus = async (id, status, manager) => {
    const data = await updateWarrantyStatus(id, status, manager);

    if (data.EC === 0) {
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status, manager } : t))
      );
    }

    return data;
  };

  return (
    <WarrantyContext.Provider
      value={{
        tickets,
        ticketDetail,
        setTickets,
        setTicketDetail,
        fetchWarrantyTickets,
        handleCreateTicket,
        handleUpdateStatus,
      }}
    >
      {children}
    </WarrantyContext.Provider>
  );
};

export const useWarranty = () => useContext(WarrantyContext);
