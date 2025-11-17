import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table } from "antd";
import moment from "moment";

import { useSaleInvoice } from "../../context/SaleInvoiceContext";

const SellReceiptDetails = () => {
  const { id } = useParams();
  const { invoiceDetail, fetchSaleInvoiceById } = useSaleInvoice();

  useEffect(() => {
    fetchSaleInvoiceById(id);
  }, [id]);

  if (!invoiceDetail) {
    return (
      <p className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen text-gray-500">
        Loading...
      </p>
    );
  }

  const formattedProducts = invoiceDetail.items.map((item) => ({
    product_id: item.product?._id,
    product_name: item.product?.product_title,
    color: item.color_name,
    size: item.variant_size,
    sale_price: item.sale_price,
    quantity: item.quantity,
    total: item.total,
    product_img:
      item.product?.colors?.find((c) => c.color_name === item.color_name)?.imgs
        ?.img_main || null,
  }));

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      align: "left",
      render: (id) => <span>{id}</span>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
      align: "left",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.product_img}
            alt={record.product_name}
            className="w-12 h-12 object-contain rounded"
          />
          <span className="line-clamp-2">{record.product_name}</span>
        </div>
      ),
    },
    {
      title: "Biến thể",
      key: "variant",
      align: "left",
      render: (_, r) => `${r.color} - ${r.size}`,
    },
    {
      title: "Giá bán (đ)",
      dataIndex: "sale_price",
      align: "left",
      render: (p) => p.toLocaleString(),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "left",
    },
    {
      title: "Thành tiền (đ)",
      dataIndex: "total",
      align: "left",
      render: (v) => v.toLocaleString(),
    },
  ];

  const {
    invoice_number,
    customer_name,
    customer_phone,
    createdAt,
    total_amount,
    customer_paid,
    remaining,
  } = invoiceDetail;

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen bg-gray-100">
      <div className="bg-white flex flex-col sm:flex-row gap-5 justify-between sm:items-center p-6 shadow-lg rounded-lg mt-4">
        <p>
          <strong>Mã hóa đơn:</strong> {invoice_number}
        </p>
        <p>
          <strong>Ngày lập:</strong>{" "}
          {moment(createdAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg mt-4 space-y-5">
        <h3 className="font-semibold">Thông tin khách hàng</h3>

        <div className="space-y-3 px-3 py-5 border rounded">
          <p>
            <strong>Họ tên:</strong> {customer_name}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {customer_phone}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 shadow-lg rounded-lg mt-4 space-y-5 overflow-x-auto">
        <h3 className="font-semibold">Sản phẩm</h3>

        <Table
          dataSource={formattedProducts}
          rowKey={(r) => `${r.product_id}-${r.color}-${r.size}`}
          columns={columns}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
          className="rounded-lg 
            [&_.ant-table-thead_tr_th]:bg-[#e9eff5] 
            [&_.ant-table-thead_tr_th]:text-black 
            [&_.ant-table-thead_tr_th]:font-bold"
        />
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg mt-4 space-y-5">
        <h3 className="font-semibold">Thanh toán</h3>

        <div className="space-y-3 px-3 py-5 border rounded">
          <div className="flex justify-between">
            <strong>Tổng tiền hàng:</strong>
            <span>{total_amount.toLocaleString()} đ</span>
          </div>

          <div className="flex justify-between">
            <strong>Khách trả:</strong>
            <span>{customer_paid.toLocaleString()} đ</span>
          </div>

          <div className="flex justify-between text-red-600 font-bold">
            <strong>Còn lại:</strong>
            <span>{remaining.toLocaleString()} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellReceiptDetails;
