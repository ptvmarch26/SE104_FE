import { useState } from "react";
import { Modal, Select, Input, Button } from "antd";
import { usePopup } from "../../../context/PopupContext";
import { useWarranty } from "../../../context/WarrantyContext";
import { useUser } from "../../../context/UserContext";

const { Option } = Select;

const WarrantyTicketCreateModal = ({ open, setOpen, order }) => {
  const { showPopup } = usePopup();
  const { handleCreateTicket } = useWarranty();
  const { selectedUser } = useUser();

  const [ticketType, setTicketType] = useState("Bảo hành");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [condition, setCondition] = useState("");
  const [reason, setReason] = useState("");
  const [solution, setSolution] = useState("");

  const selectedItem = selectedIndex !== null ? order.items[selectedIndex] : null;

  const resetForm = () => {
    setTicketType("Bảo hành");
    setSelectedIndex(null);
    setCondition("");
    setReason("");
    setSolution("");
  };

  const handleSubmit = async () => {
    if (!selectedItem || !condition || !reason || !solution) {
      return showPopup("Vui lòng nhập đầy đủ thông tin!", false);
    }

    const res = await handleCreateTicket({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      ticket_type: ticketType,

      // ---- PRODUCT OBJECT GỬI ĐÚNG ĐỊNH DẠNG BACKEND YÊU CẦU ----
      product: {
        invoice_id: order._id,                     // ⚡ BACKEND yêu cầu field này
        product_id: selectedItem.product._id,       // Chuẩn
        color: selectedItem.color_name,
        size: selectedItem.variant_size
      },

      condition,
      reason,
      solution,
      staff: selectedUser?._id
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
      {/* Loại phiếu + khách hàng */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="font-semibold">Loại phiếu</label>
          <Select value={ticketType} onChange={setTicketType} className="w-full">
            <Option value="Bảo hành">Bảo hành</Option>
            <Option value="Đổi trả">Đổi trả</Option>
          </Select>
        </div>

        <div>
          <label className="font-semibold">Khách hàng</label>
          <Input value={order.customer_name} disabled />
        </div>
      </div>

      {/* Chọn sản phẩm */}
      <div className="mb-4">
        <label className="font-semibold">Sản phẩm trong hóa đơn</label>
        <Select
          placeholder="Chọn sản phẩm đã mua"
          value={selectedIndex}
          onChange={setSelectedIndex}
          className="w-full"
        >
          {order.items.map((item, idx) => (
            <Option key={idx} value={idx}>
              {item.product.product_title} — {item.color_name}/{item.variant_size}
            </Option>
          ))}
        </Select>
      </div>

      {/* Hiển thị biến thể đã mua */}
      {selectedItem && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold">Màu</label>
            <Input value={selectedItem.color_name} disabled />
          </div>
          <div>
            <label className="font-semibold">Size</label>
            <Input value={selectedItem.variant_size} disabled />
          </div>
        </div>
      )}

      {/* Form nhập nội dung phiếu */}
      <div className="grid gap-4 mb-4">
        <div>
          <label className="font-semibold">Tình trạng</label>
          <Input
            placeholder="VD: lỗi keo, bung chỉ..."
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Lý do</label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold">Phương án xử lý</label>
          <Input.TextArea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => setOpen(false)}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Thêm phiếu
        </Button>
      </div>
    </Modal>
  );
};

export default WarrantyTicketCreateModal;
