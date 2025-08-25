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
          <Outlet />
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;



