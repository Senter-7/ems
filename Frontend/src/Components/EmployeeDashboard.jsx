import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const id = localStorage.getItem("employee_id");
    axios.get(`http://localhost:3000/auth/employee/${id}`)
      .then(res => {
        console.log(res.data);
        if (res.data.Status) setEmployee(res.data.Result);
      });
  }, []);




  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <div className="text-center w-100 py-4">
              {employee.image && (
                <img
                  src={`http://localhost:3000/Images/${employee.image}`}
                  alt="Profile"
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
              <br />
              <small className="text-white">Name: {employee.name}</small><br></br>
              <small className="text-white">Employee ID: {employee.id}</small>
            </div>
            
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100">
              {/* <li className="w-100">
                <Link
                  to={`/employee_dashboard/edit`}
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-pencil-square ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Edit Profile</span>
                </Link>
              </li> */}
              <li className="w-100 mt-2">
                <Link
                  to="/"
                  className="nav-link text-white px-0 align-middle"
                  onClick={() => {
                    localStorage.removeItem("valid");
                    localStorage.removeItem("employee_id");
                  }}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Self Service</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
