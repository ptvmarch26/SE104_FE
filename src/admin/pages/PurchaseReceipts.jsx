import { useEffect, useState } from "react";
import { Table, Input, Select, Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import moment from "moment";

import { usePurchaseOrder } from "../../context/PurchaseOrderContext";
import { useSupplier } from "../../context/SupplierContext";
import PurchaseOrderCreateModal from "../components/PurchaseOrderCreateModal/PurchaseOrderCreateModal";
import PurchaseOrderEditModal from "../components/PurchaseOrderEditModal/PurchaseOrderEditModal";

const { Option } = Select;

const PurchaseOrders = () => {
  const { orders, fetchPurchaseOrders } = usePurchaseOrder();
  const { suppliers, fetchSuppliers } = useSupplier();

  const [searchText, setSearchText] = useState("");
  const [filterSupplier, setFilterSupplier] = useState(null);
  const [ordersState, setOrdersState] = useState(orders);
  const [openCreate, setOpenCreate] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setOrdersState(orders);
  }, [orders]);

  const filteredOrders = ordersState.filter((order) => {
    const matchesSearch = searchText
      ? order._id.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const matchesSupplier = filterSupplier
      ? order.supplier?._id === filterSupplier
      : true;

    return matchesSearch && matchesSupplier;
  });

  const columns = [
    {
      title: "Mã phiếu nhập",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (sup) => <span>{sup?.name || "Không có dữ liệu"}</span>,
    },
    {
      title: "Số mặt hàng",
      dataIndex: "items",
      key: "items",
      render: (items) => <span>{items.length} mặt hàng</span>,
    },
    {
      title: "Ngày nhập",
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
    {
      title: "Hành động",
      render: (_, record) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(record);
            setEditModalOpen(true);
          }}
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo mã phiếu nhập..."
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
            Thêm phiếu nhập
          </Button>
        </div>

        <div className="flex justify-between">
          <Select
            placeholder="Lọc theo nhà cung cấp"
            value={filterSupplier}
            onChange={(value) => setFilterSupplier(value)}
            allowClear
            className="w-[300px]"
          >
            {suppliers?.map((sup) => (
              <Option key={sup._id} value={sup._id}>
                {sup.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredOrders}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
      </div>
      <PurchaseOrderCreateModal open={openCreate} setOpen={setOpenCreate} />
      <PurchaseOrderEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default PurchaseOrders;
