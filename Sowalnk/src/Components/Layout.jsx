import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import Sidebar from "./Sidebar";
import "./Layout.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex flex-row min-h-screen">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <main className="flex-1 relative p-4 lg:ml-64">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
