import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { DiscountProvider } from "./context/DiscountContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { PopupProvider } from "./context/PopupContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { PurchaseOrderProvider } from "./context/PurchaseOrderContext.jsx";
import { SupplierProvider } from "./context/SupplierContext.jsx";
import { SaleInvoiceProvider } from "./context/SaleInvoiceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LoadingProvider>
        <PopupProvider>
          <AuthProvider>
            <UserProvider>
              <NotificationProvider>
                <ProductProvider>
                  <DiscountProvider>
                    <CategoriesProvider>
                      <OrderProvider>
                        <CartProvider>
                          <PurchaseOrderProvider>
                            <SupplierProvider>
                              <SaleInvoiceProvider>
                                <App />
                              </SaleInvoiceProvider>
                            </SupplierProvider>
                          </PurchaseOrderProvider>
                        </CartProvider>
                      </OrderProvider>
                    </CategoriesProvider>
                  </DiscountProvider>
                </ProductProvider>
              </NotificationProvider>
            </UserProvider>
          </AuthProvider>
        </PopupProvider>
      </LoadingProvider>
    </ThemeProvider>
  </StrictMode>
);
