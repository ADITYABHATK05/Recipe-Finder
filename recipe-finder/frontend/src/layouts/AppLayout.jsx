import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="app-shell">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;