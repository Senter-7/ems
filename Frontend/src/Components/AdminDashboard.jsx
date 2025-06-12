import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Sidebar from "./Sidebar";

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar role="admin" />
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;