import { useState, useEffect } from "react";
import { Modal, Select, Input, Button } from "antd";
import { useProduct } from "../../../context/ProductContext";
import { usePopup } from "../../../context/PopupContext";
import { useWarranty } from "../../../context/WarrantyContext";
import { useUser } from "../../../context/UserContext";

const { Option } = Select;

const WarrantyTicketCreateModal = ({ open, setOpen, order }) => {
  const { fetchProducts } = useProduct();
  const { handleCreateTicket } = useWarranty();
  const { showPopup } = usePopup();
  const { selectedUser } = useUser();

  const [ticketType, setTicketType] = useState("Bảo hành");

  const [selectedProductIndex, setSelectedProductIndex] = useState(null); // dùng index
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [condition, setCondition] = useState("");
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setTicketType("Bảo hành");
    setSelectedProductIndex(null);
    setSelectedProduct(null);
    setCondition("");
    setReason("");
    setSolution("");
  };

  const handleSelectProduct = (index) => {
    const p = order.products[index];

    setSelectedProductIndex(index);

    setSelectedProduct({
      product_id: p.product_id._id,
      color: p.color,
      size: p.variant,
    });
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !condition || !reason || !solution) {
      return showPopup("Vui lòng nhập đầy đủ thông tin!", false);
    }

    const res = await handleCreateTicket({
      customer_name: order?.shipping_address.name,
      customer_phone: order?.shipping_address.phone,
      ticket_type: ticketType,
      product: {
        order_id: order._id,
        product_id: selectedProduct.product_id,
        color: selectedProduct.color,
        size: selectedProduct.size,
      },
      condition,
      reason,
      solution,
      staff: selectedUser?._id,
    });

    if (res.EC === 0) {
      showPopup("Tạo phiếu bảo hành / đổi trả thành công!");
      resetForm();
      setOpen(false);
    } else {
      showPopup(res.EM, false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Tạo Phiếu Bảo Hành / Đổi Trả"
      width={700}
      footer={null}
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold mb-1">Loại phiếu</label>
          <Select
            value={ticketType}
            onChange={setTicketType}
            className="w-full"
          >
            <Option value="Bảo hành">Bảo hành</Option>
            <Option value="Đổi trả">Đổi trả</Option>
          </Select>
        </div>

        <div>
          <label className="font-semibold mb-1">Khách hàng</label>
          <Input value={order?.shipping_address.name} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 mb-4">
        <label className="font-semibold mb-1">Sản phẩm</label>
        <Select
          placeholder="Chọn sản phẩm trong đơn"
          value={selectedProductIndex}
          onChange={handleSelectProduct}
          className="w-full"
        >
          {order?.products.map((p, idx) => (
            <Option key={idx} value={idx}>
              {p.product_id.product_title} — {p.color}/{p.variant}
            </Option>
          ))}
        </Select>
      </div>

      {selectedProduct && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold mb-1">Màu (đã mua)</label>
            <Input value={selectedProduct.color} disabled />
          </div>
          <div>
            <label className="font-semibold mb-1">Size (đã mua)</label>
            <Input value={selectedProduct.size} disabled />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="font-semibold mb-1">Tình trạng</label>
          <Input
            placeholder="VD: lỗi đường may, bung chỉ..."
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1">Lý do</label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold mb-1">Phương án xử lý</label>
          <Input.TextArea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={() => setOpen(false)}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Thêm
        </Button>
      </div>
    </Modal>
  );
};

export default WarrantyTicketCreateModal;
