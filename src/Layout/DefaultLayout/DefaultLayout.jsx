import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import HeaderLogo from "../Header/HeaderLogo";
import ScrollToTopComponent from "../../components/ScrollToTopComponent/ScrollToTopComponent";
import BottomMenuComponent from "../../components/BottomMenuComponent/BottomMenuComponent";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const { token } = useAuth();

  const authPages = {
    "/sign-in": "Đăng nhập",
    "/sign-up": "Đăng ký",
    "/forgot-password": "Quên mật khẩu",
  };

  return (
    <div>
      {authPages[location.pathname] ? (
        <HeaderLogo title={authPages[location.pathname]} />
      ) : (
        <Header />
      )}

      <div className="mt-[100px]">{children}</div>

      {token && <BottomMenuComponent />}

      <ScrollToTopComponent />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
