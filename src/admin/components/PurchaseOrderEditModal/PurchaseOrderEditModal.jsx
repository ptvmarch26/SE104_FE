import { useEffect, useState } from "react";
import { Modal, Select, InputNumber, Button, Table } from "antd";
import { useSupplier } from "../../../context/SupplierContext";
import { usePurchaseOrder } from "../../../context/PurchaseOrderContext";
import { usePopup } from "../../../context/PopupContext";
import { useProduct } from "../../../context/ProductContext";

const { Option } = Select;

const PurchaseOrderEditModal = ({ open, onClose, order }) => {
  const { suppliers, fetchSuppliers } = useSupplier();
  const { products } = useProduct();
  const { handleUpdatePurchaseOrder } = usePurchaseOrder();
  const { showPopup } = usePopup();

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchSuppliers();

    if (order && open) {
      setSupplierId(order.supplier?._id);
      setItems(order.items.map((i) => ({ ...i })));
    }
  }, [order, open]);


  useEffect(() => {
    if (!open) {
      setSupplierId("");
      setItems([]);
    }
  }, [open]);

  const handleChangeItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "quantity" || field === "import_price") {
      updated[index].total =
        updated[index].quantity * updated[index].import_price;
    }

    setItems(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      supplier: supplierId,
      items: items.map((i) => ({
        product: i.product,
        color_name: i.color_name,
        variant_size: i.variant_size,
        quantity: i.quantity,
        import_price: i.import_price,
      })),
    };

    const result = await handleUpdatePurchaseOrder(order._id, payload);

    if (result.EC === 0) {
      showPopup(result.EM);
      onClose();
    } else {
      showPopup(result.EM, false);
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => {
        const p = products.find((prod) => prod._id === record.product);
        return p ? p.product_title : "Không tìm thấy";
      }
    },
    { title: "Màu", dataIndex: "color_name", key: "color_name" },
    { title: "Size", dataIndex: "variant_size", key: "variant_size" },
    {
      title: "Số lượng nhập",
      dataIndex: "quantity",
      key: "quantity",
      render: (value, record, index) => (
        <InputNumber
          min={10}
          value={value}
          onChange={(val) => handleChangeItem(index, "quantity", val)}
        />
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "import_price",
      key: "import_price",
      render: (value, record, index) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val) => handleChangeItem(index, "import_price", val)}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (v) => <span>{v.toLocaleString()}đ</span>,
    },
  ];

  return (
    <Modal
      title="Cập nhật phiếu nhập hàng"
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
      centered
    >
      <div className="mb-4">
        <label className="font-semibold">Nhà cung cấp</label>
        <Select
          value={supplierId}
          onChange={setSupplierId}
          className="w-full mt-1"
          placeholder="Chọn nhà cung cấp"
        >
          {suppliers?.map((sup) => (
            <Option key={sup._id} value={sup._id}>
              {sup.name}
            </Option>
          ))}
        </Select>
      </div>

      <Table
        dataSource={items}
        columns={columns}
        rowKey={(r) => r.quantity + r.color_name + r.variant_size}
        pagination={false}
        className="mb-4"
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Cập nhật
        </Button>
      </div>
    </Modal>
  );
};

export default PurchaseOrderEditModal;
