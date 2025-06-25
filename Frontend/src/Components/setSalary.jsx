import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SetSalary = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
          
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
             
              <th>Designation</th>
              <th>Attendance</th>
              <th>YoE</th>
              <th>Month</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name}</td>
                
                <td>{e.designation}</td>
                <td>{e.department}</td>
                
                <td>{e.experience}</td>
                <td></td>
                <td>{e.salary}</td>
                <td>
                  {/* View Button */}
                  <Link to={`/employee_dashboard/employee_detail/${e.id}`}// this needs to link to a breakdown of salary
                    className="btn btn-success btn-sm me-2">
                    View
                  </Link>
                  {/* Edit Button */}
                  <Link to={`/employee_dashboard/edit_employee/${e.id}`}
                    className="btn btn-info btn-sm me-2">
                    Edit
                  </Link>
                  
                </td>
              </tr>
            ))}
            {employee.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SetSalary;
