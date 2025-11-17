import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Table,
  Input,
  DatePicker,
  Select,
  Divider,
  InputNumber,
  message,
} from "antd";
import moment from "moment";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProduct } from "../../../context/ProductContext";
import { useCategories } from "../../../context/CategoriesContext";

const { Option } = Select;

const SellVoucherModal = ({ open, setOpen }) => {
  const { products, fetchProducts } = useProduct();
  const { categories, fetchCategories } = useCategories();

  // --- State thông tin phiếu ---
  const [createdDate, setCreatedDate] = useState(new Date());
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [pay, setPay] = useState(0);

  // --- State lọc và chọn sản phẩm ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách SP hiển thị trong Select
  const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách ID các SP đang chọn trong Select

  // --- State bảng chi tiết phiếu ---
  const [salesProducts, setSalesProducts] = useState([]); // Danh sách SP đã thêm vào bảng

  // 1. Fetch dữ liệu khi mở Modal
  useEffect(() => {
    if (open) {
      fetchProducts();
      fetchCategories();
    }
  }, [open]);

  // 2. Khi danh sách products gốc thay đổi (load xong), cập nhật vào filteredProducts
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    }
  }, [products, selectedCategory]);

  // 3. Xử lý chọn Danh mục (FIX QUAN TRỌNG)
  const handleSelectCategory = (value) => {
    const categoryId = value ? value.toString() : null;

    setSelectedCategory(categoryId);
    setSelectedProducts([]);

    if (!categoryId) {
      setFilteredProducts(products);
      return;
    }

    const list = products.filter((p) => {
      const productCatId = p.product_category?._id?.toString() || null;

      return productCatId === categoryId;
    });

    setFilteredProducts(list);
  };

  // 4. Thêm sản phẩm từ Select vào Bảng
  const handleAddProductsToTable = () => {
    if (selectedProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    const newRows = selectedProducts.map((id) => {
      const prod = products.find((p) => p._id === id);
      // Kiểm tra xem sản phẩm đã có trong bảng chưa để cộng dồn hoặc thêm mới (tuỳ logic, ở đây mình thêm mới dòng)
      return {
        key: Date.now() + Math.random(), // Key unique tạm thời
        product_id: prod._id,
        product_name: prod.product_title,
        quantity: 1,
        price: prod.product_price || 0,
      };
    });

    setSalesProducts([...salesProducts, ...newRows]);
    setSelectedProducts([]); // Reset ô chọn sau khi thêm
  };

  // 5. Cập nhật dữ liệu trong bảng (Số lượng, Giá, Tên)
  const updateRow = (index, field, value) => {
    const newList = [...salesProducts];
    newList[index][field] = value;
    setSalesProducts(newList);
  };

  // 6. Xóa dòng trong bảng
  const removeRow = (index) => {
    const newList = [...salesProducts];
    newList.splice(index, 1);
    setSalesProducts(newList);
  };

  // Tính tổng tiền
  const total = salesProducts.reduce((s, p) => s + p.quantity * p.price, 0);

  // Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      render: (_, r, i) => (
        <Input
          value={r.product_name}
          onChange={(e) => updateRow(i, "product_name", e.target.value)}
        />
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      width: 100,
      render: (_, r, i) => (
        <InputNumber
          min={1}
          value={r.quantity}
          onChange={(v) => updateRow(i, "quantity", v)}
          className="w-full"
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      width: 150,
      render: (_, r, i) => (
        <InputNumber
          min={0}
          value={r.price}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          onChange={(v) => updateRow(i, "price", v)}
          className="w-full"
        />
      ),
    },
    {
      title: "Thành tiền",
      width: 150,
      render: (_, r) => (
        <span className="font-bold text-blue-600">
          {(r.quantity * r.price).toLocaleString()}đ
        </span>
      ),
    },
    {
      title: "",
      width: 50,
      render: (_, __, i) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(i)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <span className="text-xl font-bold text-blue-600">
          Lập Phiếu Bán Hàng
        </span>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="space-y-4">
        {/* --- Hàng 1: Ngày & Thông tin khách --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Ngày lập</label>
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              value={moment(createdDate)}
              onChange={(date) => setCreatedDate(date?.toDate())}
              allowClear={false}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tên khách hàng</label>
            <Input
              placeholder="Nhập tên khách..."
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Số điện thoại</label>
            <Input
              placeholder="Nhập SĐT..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <Divider dashed />

        {/* --- Hàng 2: Bộ lọc và chọn sản phẩm --- */}
        <div className="bg-gray-50 p-4 rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="block font-medium mb-1">
                Danh mục sản phẩm
              </label>
              <Select
                className="w-full"
                placeholder="Lọc theo danh mục"
                value={selectedCategory}
                onChange={handleSelectCategory}
                allowClear
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id.toString()}>
                    {c.category_type} - {c.category_gender}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-6">
              <label className="block font-medium mb-1">Chọn sản phẩm</label>
              <Select
                mode="multiple"
                className="w-full"
                placeholder="Tìm và chọn sản phẩm..."
                value={selectedProducts}
                onChange={setSelectedProducts}
                optionFilterProp="children"
                maxTagCount="responsive"
                dropdownRender={(menu) => (
                  <>
                    <div className="flex justify-between px-2 py-2 bg-gray-50">
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          const all = filteredProducts.map((p) => p._id);
                          setSelectedProducts(all);
                        }}
                      >
                        Chọn tất cả
                      </Button>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => setSelectedProducts([])}
                      >
                        Bỏ chọn
                      </Button>
                    </div>
                    <Divider style={{ margin: "0" }} />
                    {menu}
                  </>
                )}
              >
                {filteredProducts.map((p) => (
                  <Option key={p._id} value={p._id}>
                    <div className="flex justify-between">
                      <span>{p.product_title}</span>
                      <span className="text-gray-400 text-xs">
                        {p.product_price?.toLocaleString()}đ
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            <div className="md:col-span-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="w-full"
                onClick={handleAddProductsToTable}
                disabled={selectedProducts.length === 0}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>

        {/* --- Bảng chi tiết phiếu --- */}
        <Table
          dataSource={salesProducts}
          columns={columns}
          pagination={false}
          rowKey="key" // Sử dụng key tạm thời
          bordered
          size="small"
          scroll={{ y: 300 }}
          locale={{ emptyText: "Chưa có sản phẩm nào trong phiếu" }}
        />

        {/* --- Tổng kết và thanh toán --- */}
        <div className="flex flex-col items-end space-y-3 mt-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-lg">
            <span>Tổng tiền hàng:</span>
            <b className="text-red-600 text-xl">{total.toLocaleString()}đ</b>
          </div>

          <div className="flex items-center gap-4">
            <span>Khách thanh toán:</span>
            <InputNumber
              className="w-[200px]"
              min={0}
              value={pay}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={setPay}
            />
          </div>

          <div className="flex items-center gap-4 text-lg">
            <span>Tiền thừa / Còn nợ:</span>
            <b
              className={`${
                pay >= total ? "text-green-600" : "text-orange-500"
              }`}
            >
              {(pay - total).toLocaleString()}đ
            </b>
          </div>
        </div>

        {/* --- Nút Save --- */}
        <div className="mt-6">
          <Button
            type="primary"
            size="large"
            block
            className="h-12 text-lg font-semibold"
          >
            LƯU PHIẾU BÁN HÀNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SellVoucherModal;
