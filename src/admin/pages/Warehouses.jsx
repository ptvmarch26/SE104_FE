import { useEffect, useState } from "react";
import { Table, Input, Button, Select, Tag, DatePicker } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useProduct } from "../../context/ProductContext";
import { usePopup } from "../../context/PopupContext";

const { Option } = Select;

const Warehouses = () => {
  const { inventoryReport, fetchInventoryReport, handleExportInventoryExcel } =
    useProduct();
  const { showPopup } = usePopup();

  const [searchText, setSearchText] = useState("");
  const [month, setMonth] = useState(dayjs());
  const [filterLowStock, setFilterLowStock] = useState(null);

  useEffect(() => {
    fetchInventoryReport(month.format("YYYY-MM"), null);
  }, [month]);

  const onExportExcel = async () => {
    try {
      const monthString = month.format("YYYY-MM");
      const res = await handleExportInventoryExcel(monthString, null);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `BaoCaoTonKho_${monthString}.xlsx`);
      document.body.appendChild(link);
      link.click();

      showPopup("Lập báo cáo tồn kho thành công", true);
    } catch (error) {
      console.error(error);
      showPopup("Lập báo cáo tồn kho thất bại", false);
    }
  };

  const filteredData = inventoryReport.filter((item) => {
    const matchesSearch = searchText
      ? item.product_title?.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const matchesLowStock =
      filterLowStock === "low"
        ? item.ending_stock < 20
        : filterLowStock === "enough"
        ? item.ending_stock >= 20
        : true;

    return matchesSearch && matchesLowStock;
  });
  console.log("inventoryReport", inventoryReport);
  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      render: (t) => <span className="font-semibold">{t}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_title",
      key: "product_title",
      render: (t) => <span>{t}</span>,
    },
    {
      title: "Màu",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Tồn đầu",
      dataIndex: "opening_stock",
      key: "opening_stock",
    },
    {
      title: "Nhập trong kỳ",
      dataIndex: "imported",
      key: "imported",
    },
    {
      title: "Bán ra",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Tồn cuối",
      dataIndex: "ending_stock",
      key: "ending_stock",
      render: (value) =>
        value < 20 ? (
          <Tag
            color="red"
            className="text-[13px] font-medium px-2.5 py-0.5 rounded"
          >
            {value} | Cần nhập
          </Tag>
        ) : (
          <Tag
            color="green"
            className="text-[13px] font-medium px-2.5 py-0.5 rounded"
          >
            {value}
          </Tag>
        ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
  ];

  return (
    <div className="lg:ml-[300px] mt-[64px] px-2 py-4 lg:p-6 min-h-screen">
      <div className="space-y-3 mb-4">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-none"
          />
          <DatePicker
            picker="month"
            format="YYYY-MM"
            value={month}
            onChange={(value) => setMonth(value)}
            className="rounded-none"
          />

          <Button
            type="primary"
            className="rounded-none"
            icon={<ExportOutlined />}
            disabled={!inventoryReport.length}
            onClick={onExportExcel}
          >
            Xuất file excel
          </Button>
        </div>

        <Select
          placeholder="Lọc tồn kho"
          allowClear
          className="w-[250px]"
          value={filterLowStock}
          onChange={setFilterLowStock}
        >
          <Option value="low">Tồn thấp (&lt; 20)</Option>
          <Option value="enough">Đủ hàng (≥ 20)</Option>
        </Select>
      </div>

      <div className="bg-white p-4 shadow-lg">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(r) => `${r.product_title}-${r.color}-${r.size}`}
          pagination={{ pageSize: 50 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default Warehouses;
