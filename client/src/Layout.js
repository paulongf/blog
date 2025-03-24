import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import IntroHome from "./IntroHome";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  
  const showIntroHome = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/contact";

  return (
    <>
      <main>
      <Header />
      {showIntroHome && <IntroHome />}
      <Outlet />
    </main>
    <Footer/>
    </>
  );
}
