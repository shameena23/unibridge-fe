import React from "react";
import UserSidebar from "./UserSidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {

    return (

        <div className="dashboard-container">

            <UserSidebar />

            <div className="main-content">

                <Topbar />

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );
};

export default Layout;