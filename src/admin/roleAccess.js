export const getDefaultAdminPath = (role) => {
  if (role === "sales_staff") return "/admin/sell-receipts";
  if (role === "warehouse_staff") return "/admin/purchase-receipts";
  if (role === "admin" || !role) return "/admin/dashboard";
  return "/admin/";
};
