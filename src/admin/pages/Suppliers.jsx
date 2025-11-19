import { useEffect, useState } from "react";
import { Table, Input, Button, Modal } from "antd";
import { useSupplier } from "../../context/SupplierContext";
import { usePopup } from "../../context/PopupContext";
import SupplierCreateModal from "../components/SupplierCreateModal/SupplierCreateModal";

const Suppliers = () => {
  const { suppliers, fetchSuppliers, removeSupplier } = useSupplier();
  const { showPopup } = usePopup();

  const [searchText, setSearchText] = useState("");
  const [supplierState, setSupplierState] = useState(suppliers);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    setSupplierState(suppliers);
  }, [suppliers]);

  const filteredSuppliers = supplierState.filter((s) =>
    searchText ? s.name?.toLowerCase().includes(searchText.toLowerCase()) : true
  );

  const openAddModal = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditData(record);
    setModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const res = await removeSupplier(deleteId);

    if (res.EC === 0) showPopup(res.EM, true);
    else showPopup(res.EM, false);

    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const columns = [
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    { title: "Số điện thoại", dataIndex: "phone" },
    { title: "Địa chỉ", dataIndex: "address" },

    {
      title: "Hành động",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button onClick={() => openEditModal(record)}>Sửa</Button>

          <Button danger onClick={() => openDeleteModal(record._id)}>
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-none"
          />

          <Button
            type="primary"
            onClick={openAddModal}
            className="rounded-none"
          >
            Thêm nhà cung cấp
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredSuppliers}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <SupplierCreateModal
        open={modalOpen}
        setOpen={setModalOpen}
        editData={editData}
      />

      <Modal
        title="Xác nhận xoá nhà cung cấp"
        open={deleteModalOpen}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xoá nhà cung cấp này?</p>
      </Modal>
    </div>
  );
};

export default Suppliers;
