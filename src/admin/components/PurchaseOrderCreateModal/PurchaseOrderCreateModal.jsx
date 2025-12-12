import { useState, useEffect } from "react";
import { Modal, Select, InputNumber, Button, Table } from "antd";
import { useSupplier } from "../../../context/SupplierContext";
import { useProduct } from "../../../context/ProductContext";
import { usePurchaseOrder } from "../../../context/PurchaseOrderContext";
import { usePopup } from "../../../context/PopupContext";

const { Option } = Select;

const PurchaseOrderCreateModal = ({ open, setOpen }) => {
  const { suppliers, fetchSuppliers } = useSupplier();
  const { products, fetchProducts } = useProduct();
  const { handleCreatePurchaseOrder } = usePurchaseOrder();
  const { showPopup } = usePopup();

  const [supplierId, setSupplierId] = useState(null);
  const [items, setItems] = useState([]);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentSize, setCurrentSize] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [importPrice, setImportPrice] = useState(0);
  const [unit, setUnit] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const resetItem = () => {
    setCurrentProduct(null);
    setCurrentColor(null);
    setCurrentSize(null);
    setQuantity(10);
    setImportPrice(0);
    setUnit("");
  };

  const handleAddItem = () => {
    if (!currentProduct || !currentColor || !currentSize || !importPrice) {
      showPopup("Vui lòng chọn đầy đủ thông tin", false);
      return;
    }

    const newItem = {
      product: currentProduct,
      color_name: currentColor,
      variant_size: currentSize,
      quantity,
      import_price: importPrice,
      total: quantity * importPrice,
      unit,
    };

    setItems([...items, newItem]);
    resetItem();
  };

  const handleSubmit = async () => {
    if (!supplierId) return showPopup("Vui lòng chọn nhà cung cấp", false);
    if (items.length === 0)
      return showPopup("Vui lòng thêm ít nhất 1 mặt hàng", false);

    const res = await handleCreatePurchaseOrder(supplierId, items);

    if (res.EC === 0) {
      showPopup("Tạo phiếu nhập thành công");
      setOpen(false);
      setItems([]);
      setSupplierId(null);
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
      title: "Đơn giá",
      dataIndex: "import_price",
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
      title="Tạo Phiếu Nhập Hàng"
      footer={null}
    >
      <div className="flex flex-col gap-2 mb-4">
        <label className="font-semibold">Nhà cung cấp</label>
        <Select
          placeholder="Chọn nhà cung cấp"
          value={supplierId}
          onChange={setSupplierId}
          className="w-full"
        >
          {suppliers.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name}
            </Option>
          ))}
        </Select>
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
          <label className="text-sm font-semibold mb-1">Màu sắc</label>
          <Select
            placeholder="Chọn màu"
            value={currentColor}
            onChange={setCurrentColor}
            disabled={!currentProduct}
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
            placeholder="Chọn size"
            value={currentSize}
            onChange={setCurrentSize}
            disabled={!currentColor}
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
          <label className="text-sm font-semibold mb-1">Số lượng (≥10)</label>
          <InputNumber
            min={10}
            value={quantity}
            onChange={setQuantity}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Giá nhập (đ)</label>
          <InputNumber
            min={1000}
            value={importPrice}
            onChange={setImportPrice}
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
          rowKey={(r) => r.product + r.color_name + r.variant_size}
          pagination={false}
        />
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

export default PurchaseOrderCreateModal;
