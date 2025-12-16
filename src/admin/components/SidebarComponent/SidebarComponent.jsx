import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiUsers,
  FiTag,
  FiLogOut,
  FiUserPlus,
} from "react-icons/fi";
import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext";
import { IoStorefrontOutline, IoReceiptOutline } from "react-icons/io5";
import { GoHistory } from "react-icons/go";
import { LuWarehouse } from "react-icons/lu";
import { MdRoomService } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa6";
import { getDefaultAdminPath } from "../../roleAccess";

function SidebarComponent({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout, token, userRole } = useAuth();
  const { selectedUser } = useUser();
  const role = userRole || selectedUser?.role;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
      roles: ["admin"],
    },
    // {
    //   name: "Quản lý đơn hàng",
    //   path: "/admin/orders",
    //   icon: <FiShoppingCart size={20} />,
    // },

    {
      name: "Quản lý danh mục",
      path: "/admin/categories",
      icon: <FiBox size={20} />,
      roles: ["admin", "sales_staff"],
    },
    {
      name: "Quản lý sản phẩm",
      path: "/admin/products",
      icon: <FiBox size={20} />,
      roles: ["admin", "sales_staff"],
    },
    // {
    //   name: "Quản lý mã giảm giá",
    //   path: "/admin/discounts",
    //   icon: <FiTag size={20} />,
    // },
    // {
    //   name: "Quản lý khách hàng",
    //   path: "/admin/customers",
    //   icon: <FiUsers size={20} />,
    // },
    {
      name: "Quản lý nhân viên",
      path: "/admin/staff",
      icon: <FiUserPlus size={20} />,
      roles: ["admin"],
    },
    {
      name: "Quản lý nhà cung cấp",
      path: "/admin/suppliers",
      icon: <FaPeopleArrows size={20} />,
      roles: ["admin", "warehouse_staff"],
    },
    {
      name: "Quản lý phiếu bán hàng",
      path: "/admin/sell-receipts",
      icon: <IoReceiptOutline size={20} />,
      roles: ["admin", "sales_staff"],
    },
    {
      name: "Quản lý phiếu nhập hàng",
      path: "/admin/purchase-receipts",
      icon: <IoReceiptOutline size={20} />,
      roles: ["admin", "warehouse_staff"],
    },
    {
      name: "Quản lý phiếu bảo hành",
      path: "/admin/warranty-tickets",
      icon: <MdRoomService size={20} />,
      roles: ["admin"],
    },
    {
      name: "Quản lý kho",
      path: "/admin/warehouses",
      icon: <LuWarehouse size={20} />,
      roles: ["admin", "warehouse_staff"],
    },
    // {
    //   name: "Cửa hàng của tôi",
    //   path: "/admin/my-store",
    //   icon: <IoStorefrontOutline size={20} />,
    // },
    // {
    //   name: "Lịch sử đăng nhập",
    //   path: "/admin/history",
    //   icon: <GoHistory size={20} />,
    // },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  const handleLogoClick = () => {
    if (token) {
      navigate(getDefaultAdminPath(role));
    } else {
      navigate("/admin");
    }
  };

  return (
    <div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-50"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 z-[60] h-screen w-[300px] bg-gray-900 text-white shadow-lg transition-transform duration-300 
    ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
    overflow-y-auto`}
      >
        <div className="flex items-center justify-center my-5">
          <img
            onClick={handleLogoClick}
            src={logo}
            alt="Logo WTM"
            className="w-48 cursor-pointer"
          />
        </div>

        <nav>
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path} onClick={toggleSidebar}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-4 rounded transition-all duration-200 relative overflow-hidden ${
                    location.pathname === item.path
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-1 bg-blue-500 ${
                      location.pathname === item.path
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={() => {
                  handleLogout();
                  navigate("/admin");
                }}
                className="flex items-center gap-3 p-4 mt-5 rounded transition-all duration-200 text-red-600 hover:bg-red-600 hover:text-white w-full"
              >
                <FiLogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default SidebarComponent;
