import { Modal, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { usePopup } from "../../../context/PopupContext";
import { useSupplier } from "../../../context/SupplierContext";

const SupplierCreateModal = ({ open, setOpen, editData }) => {
  const { addSupplier, editSupplier } = useSupplier();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      });
    } else {
      setForm({ name: "", phone: "", address: "" });
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!form.name || !form.phone)
      return showPopup("Tên và số điện thoại là bắt buộc!", false);

    let res;
    if (editData) {
      res = await editSupplier(editData._id, form);
    } else {
      res = await addSupplier(form);
    }

    if (res.EC === 0) {
      showPopup(res.EM, true);
      setOpen(false);
    } else {
      showPopup(res.EM, false);
    }
  };

  return (
    <Modal
      title={editData ? "Cập nhật Nhà Cung Cấp" : "Thêm Nhà Cung Cấp"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={600}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col col-span-2">
          <label className="font-semibold mb-1">Tên nhà cung cấp</label>
          <Input
            placeholder="Nhập tên nhà cung cấp"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Số điện thoại</label>
          <Input
            placeholder="Nhập số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Địa chỉ</label>
          <Input
            placeholder="Nhập địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={() => setOpen(false)}>Hủy</Button>

        <Button type="primary" onClick={handleSubmit}>
          {editData ? "Cập nhật" : "Thêm"}
        </Button>
      </div>
    </Modal>
  );
};

export default SupplierCreateModal;
