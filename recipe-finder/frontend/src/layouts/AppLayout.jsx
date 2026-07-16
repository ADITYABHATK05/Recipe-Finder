import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;