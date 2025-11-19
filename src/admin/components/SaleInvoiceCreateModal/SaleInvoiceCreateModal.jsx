import { useState, useEffect } from "react";
import { Modal, Select, InputNumber, Input, Button, Table } from "antd";
import { useProduct } from "../../../context/ProductContext";
import { useSaleInvoice } from "../../../context/SaleInvoiceContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;

const SaleInvoiceCreateModal = ({ open, setOpen }) => {
  const { products, fetchProducts } = useProduct();
  const { handleCreateSaleInvoice } = useSaleInvoice();
  const { showPopup } = usePopup();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPaid, setCustomerPaid] = useState(0);

  const [items, setItems] = useState([]);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentSize, setCurrentSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetItem = () => {
    setCurrentProduct(null);
    setCurrentColor(null);
    setCurrentSize(null);
    setQuantity(1);
    setSalePrice(0);
  };

  useEffect(() => {
    if (!currentProduct || !currentColor || !currentSize) return;

    const prod = products.find((p) => p._id === currentProduct);
    if (!prod) return;

    const color = prod.colors.find((c) => c.color_name === currentColor);
    const variant = color?.variants.find((v) => v.variant_size === currentSize);

    if (variant) setSalePrice(variant.variant_price);
  }, [currentSize]);

  const handleAddItem = () => {
    if (!currentProduct || !currentColor || !currentSize) {
      showPopup("Vui lòng chọn đầy đủ thông tin sản phẩm", false);
      return;
    }

    const newItem = {
      product: currentProduct,
      color_name: currentColor,
      variant_size: currentSize,
      quantity,
      sale_price: salePrice,
      total: salePrice * quantity,
    };

    setItems([...items, newItem]);
    resetItem();
  };

  const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
  const remaining = totalAmount - customerPaid;

  const handleSubmit = async () => {
    if (!customerName || !customerPhone)
      return showPopup("Vui lòng nhập thông tin khách hàng", false);

    if (items.length === 0)
      return showPopup("Vui lòng thêm ít nhất 1 mặt hàng", false);

    if (customerPaid < 0) return showPopup("Số tiền trả không hợp lệ", false);

    const res = await handleCreateSaleInvoice({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_paid: customerPaid,
      items,
    });

    if (res.EC === 0) {
      showPopup("Tạo hóa đơn bán hàng thành công");
      setOpen(false);
      setItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerPaid(0);
    } else {
      showPopup(res.EM, false);
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (id) => products.find((p) => p._id === id)?.product_title,
    },
    { title: "Màu", dataIndex: "color_name" },
    { title: "Size", dataIndex: "variant_size" },
    { title: "Số lượng", dataIndex: "quantity" },
    {
      title: "Đơn giá bán",
      dataIndex: "sale_price",
      render: (v) => v.toLocaleString() + "đ",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      render: (v) => v.toLocaleString() + "đ",
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={900}
      title="Tạo Phiếu Bán Hàng"
      footer={null}
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Tên khách hàng</label>
          <Input
            placeholder="Nhập tên khách"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Số điện thoại</label>
          <Input
            placeholder="Nhập số điện thoại"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Khách trả (đ)</label>
          <InputNumber
            min={0}
            value={customerPaid}
            onChange={setCustomerPaid}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Sản phẩm</label>
          <Select
            placeholder="Chọn sản phẩm"
            value={currentProduct}
            onChange={(val) => {
              setCurrentProduct(val);
              setCurrentColor(null);
              setCurrentSize(null);
            }}
          >
            {products.map((p) => (
              <Option key={p._id} value={p._id}>
                {p.product_title}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Màu</label>
          <Select
            disabled={!currentProduct}
            placeholder="Chọn màu"
            value={currentColor}
            onChange={setCurrentColor}
          >
            {products
              .find((p) => p._id === currentProduct)
              ?.colors?.map((c) => (
                <Option key={c.color_name} value={c.color_name}>
                  {c.color_name}
                </Option>
              ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Size</label>
          <Select
            disabled={!currentColor}
            placeholder="Chọn size"
            value={currentSize}
            onChange={setCurrentSize}
          >
            {products
              .find((p) => p._id === currentProduct)
              ?.colors?.find((c) => c.color_name === currentColor)
              ?.variants?.map((v) => (
                <Option key={v.variant_size} value={v.variant_size}>
                  {v.variant_size}
                </Option>
              ))}
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Số lượng</label>
          <InputNumber
            min={1}
            value={quantity}
            onChange={setQuantity}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Giá bán</label>
          <InputNumber
            min={0}
            value={salePrice}
            onChange={setSalePrice}
            className="w-full"
          />
        </div>
      </div>

      <Button type="primary" onClick={handleAddItem}>
        Thêm mặt hàng
      </Button>

      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey={(r) => r.product + r.color_name + r.variant_size}
        />
      </div>

      <div className="flex justify-end mt-6 text-right flex-col">
        <div className="text-lg font-semibold">
          Tổng tiền: {totalAmount.toLocaleString()}đ
        </div>
        <div className="text-lg font-semibold">
          Khách trả: {customerPaid.toLocaleString()}đ
        </div>
        <div className="text-lg font-bold text-red-600">
          Còn lại: {remaining.toLocaleString()}đ
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

export default SaleInvoiceCreateModal;
