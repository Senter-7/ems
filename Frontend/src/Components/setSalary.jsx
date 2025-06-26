import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate(); // month is 1-indexed
}

const SetSalary = () => {
  const [employee, setEmployee] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [visibleDropdown, setVisibleDropdown] = useState(null);
  const navigate = useNavigate();

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; // JavaScript months: 0-11
  const year = currentDate.getFullYear();
  const totalDaysInMonth = getDaysInMonth(year, month);

  useEffect(() => {
    // 1. Fetch all employees
    axios.get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // 2. For each employee, fetch attendance for this month
    const fetchAttendance = async () => {
      const data = {};
      for (const e of employee) {
        try {
          const res = await axios.get(
            `http://localhost:3000/hr/attendance/present/${e.id}/${month}`
          );
          if (res.data.Status) {
            data[e.id] = res.data.Result.length;
          }
        } catch (err) {
          console.error("Error fetching attendance for ID", e.id, err);
        }
      }
      setAttendance(data);
    };

    if (employee.length > 0) {
      fetchAttendance();
    }
  }, [employee, month]);

  const toggleDropdown = (id) => {
    setVisibleDropdown(visibleDropdown === id ? null : id);
  };

 

  return (
    <div className="px-8 mt-6">
      <h3 className="text-center text-2xl font-semibold mb-6">Employee Salary Details</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Designation</th>
              <th className="px-4 py-2 text-left">YoE</th>
              <th className="px-4 py-2 text-left">Attendance</th>
              <th className="px-4 py-2 text-left">Gross Salary</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => {
              const presentDays = attendance[e.id] || 0;
              let basic = Number(e.salary || 0);
              basic = (basic * (presentDays/totalDaysInMonth));
              const hra = basic * 0.4;
              const da = basic * 0.1;
              const bonus = basic * 0.1;
              
              const gross = basic + hra + da + bonus;
              

              return (
                <React.Fragment key={e.id}>
                  <tr className="border-b">
                    <td className="px-4 py-2">{e.id}</td>
                    <td className="px-4 py-2">{e.name}</td>
                    <td className="px-4 py-2">{e.designation}</td>
                    <td className="px-4 py-2">{e.experience}</td>
                    <td className="px-4 py-2">{presentDays} / {totalDaysInMonth}</td>
                    <td className="px-4 py-2 font-medium">₹ {gross.toFixed(0)}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => toggleDropdown(e.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        {visibleDropdown === e.id ? "Hide" : "View"}
                      </button>
                      <button
                        onClick={() => navigate(`/edit_salary/${e.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  {visibleDropdown === e.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-800">
                          <div><strong>Actual Basic:</strong> ₹ {Number(e.salary || 0)}</div>
                          <div><strong>Basic:</strong> ₹ {basic.toFixed(1)}</div>
                          <div><strong>HRA (40%):</strong> ₹ {hra.toFixed(1)}</div>
                          <div><strong>DA (10%):</strong> ₹ {da.toFixed(1)}</div>
                          <div><strong>Bonus (10%):</strong> ₹ {bonus.toFixed(1)}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {employee.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
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
