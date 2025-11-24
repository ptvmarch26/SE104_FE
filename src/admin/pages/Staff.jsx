import { useEffect, useState } from "react";
import { Table, Input, Select, Button } from "antd";
import { ExportOutlined, PlusOutlined } from "@ant-design/icons";

import { useUser } from "../../context/UserContext";
import CreateStaffModal from "../components/CreateStaffModal/CreateStaffModal";

const { Option } = Select;

const Staff = () => {
  const { staffList, fetchStaff } = useUser();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = (staffList || []).filter((s) => {
    const matchesSearch = search
      ? s.user_name?.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesRole = filterRole ? s.role === filterRole : true;

    return matchesSearch && matchesRole;
  });

  const roleLabels = {
    warehouse_staff: "Nhân viên kho",
    sales_staff: "Nhân viên bán hàng",
  };

  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => roleLabels[role] || role,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString("vi-VN") : "—"),
    },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            icon={<PlusOutlined />}
            className="rounded-none"
            onClick={() => setOpenCreate(true)}
          >
            Thêm nhân viên
          </Button>
        </div>

        <div className="flex justify-between">
          <Select
            placeholder="Lọc theo vai trò"
            value={filterRole}
            onChange={(v) => setFilterRole(v)}
            allowClear
            className="w-[300px]"
          >
            <Option value="warehouse_staff">Nhân viên kho</Option>
            <Option value="sales_staff">Nhân viên bán hàng</Option>
          </Select>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredStaff}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
      </div>

      <CreateStaffModal open={openCreate} setOpen={setOpenCreate} />
    </div>
  );
};

export default Staff;
