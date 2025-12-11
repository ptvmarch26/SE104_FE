import CartPage from "../pages/CartPage/CartPage";
import CheckOutPage from "../pages/CheckOutPage/CheckOutPage";
import FavoriteProductPage from "../pages/FavoriteProductPage/FavoriteProductPage";
import HomePage from "../pages/HomePage/HomePage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import SignInSignUp from "../pages/SigninSignup/SignInSignUp";
import OrderStatusPage from "../pages/OrderStatusPage/OrderStatusPage";

import Dashboard from "../admin/pages/Dashboard";
import Orders from "../admin/pages/Orders";
import Products from "../admin/pages/Products";
import Customers from "../admin/pages/Customers";
import Warehouses from "../admin/pages/Warehouses";
import AdminLayout from "../admin/layout/AdminLayout";
import Discounts from "../admin/pages/Discounts";
import Categories from "../admin/pages/Categories";
import MyStore from "../admin/pages/MyStore";
import LoginHistory from "../admin/pages/LoginHistory";
import LoginHistoryDetails from "../admin/pages/LoginHistoryDetails";
import SellReceipts from "../admin/pages/SellReceipts";
import SellReceiptDetails from "../admin/pages/SellReceiptDetails";
import PurchaseReceipts from "../admin/pages/PurchaseReceipts";
import WarrantyTickets from "../admin/pages/WarrantyTickets";
import WarrantyTicketDetails from "../admin/pages/WarrantyTicketDetails";
import Suppliers from "../admin/pages/Suppliers";
import Staff from "../admin/pages/Staff";

import Profile from "../pages/AccountPage/PageChildren/Profile";
import EditEmail from "../pages/AccountPage/PageChildren/EditMail";
import EditPhone from "../pages/AccountPage/PageChildren/EditPhone";
import EditPassword from "../pages/AccountPage/PageChildren/EditPassword";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import VoucherPage from "../pages/VoucherPage/VoucherPage";
import LoginPage from "../admin/pages/LoginPage";
import OrderDetails from "../admin/pages/OrderDetails";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import MyAddress from "../pages/AccountPage/PageChildren/MyAddress";
import ProductDetails from "../admin/pages/ProductDetails";
import SearchPage from "../pages/SearchPage/SearchPage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import PrivatePolicyPage from "../pages/PrivatePolicyPage/PrivatePolicyPage";
import TermOfUsePage from "../pages/TermOfUsePage/TermOfUsePage";
import OrderDetailsPage from "../pages/OrderDetailsPage/OrderDetailsPage";
import NotFoundPage from "../pages/NotFouldPage/NotFouldPage";
import OrderFeedbackPage from "../pages/OrderFeedbackPage/OrderFeedbackPage";
import AccountPage from "../pages/AccountPage/AccountPage";

const publicRoutes = [
  {
    path: "/sign-in",
    component: SignInSignUp,
  },
  {
    path: "/sign-up",
    component: SignInSignUp,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
  },
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/product",
    component: ProductPage,
  },
  {
    path: "/search",
    component: SearchPage,
  },
  {
    path: "/product/:id",
    component: ProductDetailsPage,
  },
  {
    path: "/checkout",
    component: CheckOutPage,
  },
  {
    path: "/checkout/:id",
    component: CheckOutPage,
  },
  {
    path: "/orders/order-details/:id",
    component: OrderDetailsPage,
  },
  {
    path: "/orders/order-feedback/:id",
    component: OrderFeedbackPage,
  },
  {
    path: "/about-us",
    component: AboutUsPage,
  },
  {
    path: "/private-policy",
    component: PrivatePolicyPage,
  },
  {
    path: "/term-of-use",
    component: TermOfUsePage,
  },
  {
    path: "*",
    component: NotFoundPage,
    Layout: null,
  },
];

const accountRoutes = [
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/edit-email",
    component: EditEmail,
  },
  {
    path: "/edit-phone",
    component: EditPhone,
  },
  {
    path: "/edit-password",
    component: EditPassword,
  },
  {
    path: "/my-address",
    component: MyAddress,
  },
];

const privateRoutes = [
  {
    path: "/cart",
    component: CartPage,
  },
  {
    path: "/favorite",
    component: FavoriteProductPage,
  },
  {
    path: "/account/*",
    component: AccountPage,
  },
  {
    path: "/orders",
    component: OrderStatusPage,
  },
  {
    path: "/notifications",
    component: NotificationPage,
  },
  {
    path: "/vouchers",
    component: VoucherPage,
  },
];

const ADMIN_ONLY = ["admin"];
const ADMIN_AND_SALES = ["admin", "sales_staff"];
const ADMIN_AND_WAREHOUSE = ["admin", "warehouse_staff"];

const adminRoutes = [
  {
    path: "/admin/",
    component: LoginPage,
    isProtected: false,
    // Layout: AdminLayout,
  },
  {
    path: "/admin/dashboard",
    component: Dashboard,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/orders",
    component: Orders,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/order-details/:id",
    component: OrderDetails,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/products",
    component: Products,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_SALES,
  },
  {
    path: "/admin/product-details/:id",
    component: ProductDetails,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_SALES,
  },
  {
    path: "/admin/suppliers",
    component: Suppliers,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_WAREHOUSE,
  },
  {
    path: "/admin/sell-receipts",
    component: SellReceipts,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_SALES,
  },
  {
    path: "/admin/sell-receipt/:id",
    component: SellReceiptDetails,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_SALES,
  },
  {
    path: "/admin/purchase-receipts",
    component: PurchaseReceipts,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_WAREHOUSE,
  },
  {
    path: "/admin/warranty-tickets",
    component: WarrantyTickets,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/warranty-ticket/:id",
    component: WarrantyTicketDetails,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/warehouses",
    component: Warehouses,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_WAREHOUSE,
  },
  {
    path: "/admin/categories",
    component: Categories,
    Layout: AdminLayout,
    allowedRoles: ADMIN_AND_SALES,
  },
  {
    path: "/admin/customers",
    component: Customers,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/staff",
    component: Staff,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/discounts",
    component: Discounts,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/my-store",
    component: MyStore,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/history",
    component: LoginHistory,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
  {
    path: "/admin/history/:id",
    component: LoginHistoryDetails,
    Layout: AdminLayout,
    allowedRoles: ADMIN_ONLY,
  },
];

export { publicRoutes, privateRoutes, adminRoutes, accountRoutes };
