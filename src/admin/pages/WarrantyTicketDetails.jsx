import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tag, Table } from "antd";
import moment from "moment";
import { useWarranty } from "../../context/WarrantyContext";

const statusColors = {
  "Chờ duyệt": "orange",
  "Đã duyệt": "blue",
  "Từ chối": "red",
  "Hoàn tất": "green",
};

const WarrantyTicketDetails = () => {
  const { id } = useParams();
  const { ticketDetail, fetchWarrantyTicketById } = useWarranty();
  console.log("dl", ticketDetail);
  useEffect(() => {
    fetchWarrantyTicketById(id);
  }, [id]);

  if (!ticketDetail) {
    return (
      <p className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen text-gray-500">
        Loading...
      </p>
    );
  }

  const {
    _id,
    ticket_type,
    status,
    createdAt,
    manager,
    staff,
    reason,
    condition,
    solution,
    customer_name,
    customer_phone,
    product,
  } = ticketDetail;

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      render: (img) => (
        <img src={img} className="w-14 h-14 rounded object-cover" alt="img" />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_title",
    },
    {
      title: "Màu",
      dataIndex: "color",
    },
    {
      title: "Size",
      dataIndex: "size",
    },
  ];

  const colorData = product?.product_id?.colors?.find(
    (c) => c.color_name === product.color
  );

  const productImg =
    colorData?.imgs?.img_main || product?.product_id?.product_img;
  const productData = [
    {
      img: productImg,
      product_title:
        typeof product?.product_id?.product_title === "object"
          ? JSON.stringify(product?.product_id?.product_title)
          : product?.product_id?.product_title,
      color: product?.color,
      size: product?.size,
      condition,
    },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen bg-gray-100">
      <div className="bg-white flex flex-col sm:flex-row gap-5 justify-between sm:items-center p-6 shadow-lg rounded-lg">
        <p>
          <strong>Mã phiếu:</strong> {_id}
        </p>
        <p>
          <strong>Loại phiếu:</strong> {ticket_type}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <Tag color={statusColors[status]}>{status}</Tag>
        </p>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg mt-4 space-y-5">
        <h3 className="font-semibold">Thông tin phiếu</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10 border rounded px-4 py-5">
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {moment(createdAt).format("YYYY-MM-DD HH:mm")}
          </p>

          <p>
            <strong>Khách hàng:</strong> {customer_name} ({customer_phone})
          </p>

          <p>
            <strong>Người tạo:</strong> {staff?.user_name || "Chưa có"}
          </p>

          <p>
            <strong>Người duyệt:</strong> {manager?.user_name || "Chưa có"}
          </p>

          <p>
            <strong>Lý do:</strong> {reason || "Không có"}
          </p>

          <p>
            <strong>Tình trạng sản phẩm:</strong> {condition}
          </p>

          <p className="sm:col-span-2">
            <strong>Giải pháp:</strong> {solution || "---"}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg mt-4">
        <h3 className="font-semibold mb-3">Sản phẩm</h3>

        <Table
          dataSource={productData}
          columns={columns}
          pagination={false}
          rowKey={() => product._id}
          bordered
        />
      </div>
    </div>
  );
};

export default WarrantyTicketDetails;
