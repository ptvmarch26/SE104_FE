import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";
import { createStaff } from "../../services/api/UserApi";

const { Option } = Select;

const CreateStaff = () => {
  const [form] = Form.useForm();
  const { fetchUser } = useUser();
  const { showPopup } = usePopup();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ensureAdmin = async () => {
      const user = await fetchUser();
      if (user?.result?.role !== "admin") {
        window.location.href = "/sign-in";
      }
    };

    ensureAdmin();
  }, []);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await createStaff(values);
      if (res?.EC === 0) {
        showPopup("Tạo nhân viên thành công");
        form.resetFields();
      } else {
        showPopup(res?.EM || "Tạo nhân viên thất bại", false);
      }
    } catch {
      showPopup("Tạo nhân viên thất bại", false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white shadow-lg border border-gray-100 rounded-lg p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Tạo nhân viên</h2>
          <p className="text-gray-600">
            Nhập thông tin để thêm nhân viên kho hoặc nhân viên bán hàng.
          </p>
        </div>

        <Form
          layout="vertical"
          form={form}
          initialValues={{ role: "warehouse_staff" }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="user_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập" },
              { min: 4, message: "Tên đăng nhập tối thiểu 4 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: nhanvien01" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="staff@example.com" autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="••••••••" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="warehouse_staff">Nhân viên kho</Option>
              <Option value="sales_staff">Nhân viên bán hàng</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="rounded-none"
            >
              Tạo nhân viên
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateStaff;
