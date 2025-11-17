import { useEffect, useState } from "react";
import { Table, Input, Select, Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { useSaleInvoice } from "../../context/SaleInvoiceContext";
import SaleInvoiceCreateModal from "../components/SaleInvoiceCreateModal/SaleInvoiceCreateModal";

const { Option } = Select;

const SellReceipts = () => {
  const navigate = useNavigate();
  const { invoices, fetchSaleInvoices } = useSaleInvoice();
  const [searchText, setSearchText] = useState("");
  const [filterCustomer, setFilterCustomer] = useState(null);
  const [invoiceState, setInvoiceState] = useState(invoices);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchSaleInvoices();
  }, []);

  useEffect(() => {
    setInvoiceState(invoices);
  }, [invoices]);

  const filteredInvoices = invoiceState.filter((invoice) => {
    const matchesSearch = searchText
      ? invoice.invoice_number?.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const matchesCustomer = filterCustomer
      ? invoice.customer_name?.toLowerCase() === filterCustomer.toLowerCase()
      : true;

    return matchesSearch && matchesCustomer;
  });

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },

    {
      title: "Khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name) => <span>{name || "Không có"}</span>,
    },
    {
      title: "Số mặt hàng",
      dataIndex: "items",
      key: "items",
      render: (items) => <span>{items.length} mặt hàng</span>,
    },
    {
      title: "Ngày lập",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (val) => `${val.toLocaleString()}đ`,
    },
  ];

  const customers = [
    ...new Set(invoices.map((inv) => inv.customer_name).filter(Boolean)),
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo mã hóa đơn..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-none"
          />

          <Button
            type="primary"
            icon={<ExportOutlined />}
            className="rounded-none"
          >
            Xuất file
          </Button>
          <Button
            type="primary"
            className="rounded-none"
            onClick={() => setOpenCreate(true)}
          >
            Thêm phiếu bán
          </Button>
        </div>

        <div className="flex justify-between">
          <Select
            placeholder="Lọc theo khách hàng"
            value={filterCustomer}
            onChange={(value) => setFilterCustomer(value)}
            allowClear
            className="w-[300px]"
          >
            {customers.map((cus) => (
              <Option key={cus} value={cus}>
                {cus}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredInvoices}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () => navigate(`/admin/sell-receipt/${record._id}`),
          })}
          scroll={{ x: "max-content" }}
          className="cursor-pointer"
        />
      </div>
      <SaleInvoiceCreateModal open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default SellReceipts;
