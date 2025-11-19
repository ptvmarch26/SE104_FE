import { useEffect, useMemo, useState } from "react";
import { Table, Input, Select, Button } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useWarranty } from "../../context/WarrantyContext";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";

const { Option } = Select;

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "blue",
  "Từ chối": "red",
  "Hoàn tất": "green",
};

const TicketStatuses = Object.keys(statusColors);

const WarrantyTickets = () => {
  const { tickets, fetchWarrantyTickets, handleUpdateStatus } = useWarranty();
  const { showPopup } = usePopup();
  const { selectedUser } = useUser();
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarrantyTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus = filterStatus ? t.status === filterStatus : true;
      const matchesSearch = searchText
        ? t._id.toLowerCase().includes(searchText.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [tickets, filterStatus, searchText]);

  const handleStatusChange = async (id, status) => {
    const manager = selectedUser?._id || "Unknown";
    const res = await handleUpdateStatus(id, status, manager);
    showPopup(res.EM, res.EC === 0);
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "_id" },
    { title: "Khách hàng", dataIndex: "customer_name" },
    {
      title: "Sản phẩm",
      render: (_, r) =>
        `${r.product?.product_id?.product_title || "---"} — ${
          r.product?.color
        }/${r.product?.size}`,
    },
    { title: "Loại phiếu", dataIndex: "ticket_type" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => moment(d).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s, r) => (
        <Select
          value={s}
          className="min-w-[180px]"
          onClick={(e) => e.stopPropagation()}
          onChange={(val) => handleStatusChange(r._id, val)}
        >
          {TicketStatuses.map((x) => (
            <Option key={x} value={x}>
              {x}
            </Option>
          ))}
        </Select>
      ),
    },
    { title: "Lý do", dataIndex: "reason", ellipsis: true },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm phiếu..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<ExportOutlined />}>
            Xuất file
          </Button>
        </div>

        <Select
          placeholder="Trạng thái phiếu"
          allowClear
          className="w-[300px]"
          value={filterStatus}
          onChange={setFilterStatus}
        >
          {TicketStatuses.map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredTickets}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          onRow={(record) => ({
            onClick: () => navigate(`/admin/warranty-ticket/${record._id}`),
          })}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default WarrantyTickets;
