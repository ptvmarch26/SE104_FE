import { Modal, Input, Select, Button } from "antd";
import { useEffect, useState } from "react";
import { usePopup } from "../../../context/PopupContext";
import { useUser } from "../../../context/UserContext";

const { Option } = Select;

const CreateStaffModal = ({ open, setOpen, editData }) => {
  const { showPopup } = usePopup();
  const { handleCreateStaff } = useUser();

  const [form, setForm] = useState({
    user_name: "",
    email: "",
    password: "",
    role: "warehouse_staff",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        user_name: editData.user_name,
        email: editData.email,
        password: "",
        role: editData.role,
      });
    } else {
      setForm({
        user_name: "",
        email: "",
        password: "",
        role: "warehouse_staff",
      });
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!form.user_name || !form.email)
      return showPopup("Tên đăng nhập và email là bắt buộc!", false);

    if (!editData && !form.password)
      return showPopup("Mật khẩu là bắt buộc!", false);

    const sendData = { ...form };
    if (editData) delete sendData.password;

    const res = await handleCreateStaff(sendData);

    if (res?.EC === 0) {
      showPopup(editData ? "Cập nhật thành công" : "Tạo nhân viên thành công");
      setOpen(false);
    } else {
      showPopup(res?.EM || "Thao tác thất bại", false);
    }
  };

  return (
    <Modal
      title={editData ? "Cập nhật nhân viên" : "Tạo nhân viên"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={600}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <label className="font-semibold mb-1">Tên đăng nhập</label>
          <Input
            placeholder="nhanvien01"
            value={form.user_name}
            onChange={(e) => setForm({ ...form, user_name: e.target.value })}
          />
        </div>

        <div>
          <label className="font-semibold mb-1">Email</label>
          <Input
            placeholder="staff@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {!editData && (
          <div>
            <label className="font-semibold mb-1">Mật khẩu</label>
            <Input.Password
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        )}

        <div>
          <label className="font-semibold mb-1">Vai trò</label>
          <Select
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            className="w-full"
          >
            <Option value="warehouse_staff">Nhân viên kho</Option>
            <Option value="sales_staff">Nhân viên bán hàng</Option>
          </Select>
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

export default CreateStaffModal;
