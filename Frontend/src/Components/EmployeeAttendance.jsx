import axios from "axios";
import React, { useEffect, useState } from "react";

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [todayMarkedStatus, setTodayMarkedStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

useEffect(() => {
  fetchAttendance();
}, []);

const fetchAttendance = () => {
  axios.get("http://localhost:3000/employee/attendance/history", { withCredentials: true })
    .then(res => {
      if (res.data.Status && res.data.Result) {
        const data = res.data.Result;
        setAttendance(data); // triggers next useEffect
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching attendance history:", err);
      setLoading(false);
    });
};

// Compute today's marked status AFTER attendance is set
useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  const todayRecord = attendance.find(record => record.date === today);
  const status = todayRecord ? todayRecord.status.toLowerCase() : null;
  console.log("Today's marked status:", status);
  setTodayMarkedStatus(status);
}, [attendance]);


const markAttendance = (statusValue) => {
  axios.post("http://localhost:3000/employee/attendance", { status: statusValue }, { withCredentials: true })
    .then(res => {
      if (res.data.Status) {
        alert("Attendance marked successfully!");
        fetchAttendance(); // Let useEffect handle today's status
      } else {
        throw new Error(res.data.Error);
      }
    })
    .catch(err => {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    });
};


  const resetTodayAttendance = () => {
    axios.delete("http://localhost:3000/employee/attendance/reset", { withCredentials: true })
      .then(res => {
        if (res.data.Status) {
          alert("Today's attendance has been reset.");
          setTodayMarkedStatus(null); // Re-enable buttons
          fetchAttendance();
        } else {
          throw new Error(res.data.Error);
        }
      })
      .catch(err => {
        console.error("Error resetting attendance:", err);
        alert("Failed to reset attendance.");
      });
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Employee Attendance</h3>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <button 
          className="btn btn-success" 
          onClick={() => markAttendance("present")} 
          disabled={!!todayMarkedStatus}
        >
          Mark Present
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => markAttendance("absent")} 
          disabled={!!todayMarkedStatus}
        >
          Mark Absent
        </button>
        <button 
          className="btn btn-secondary"
          onClick={resetTodayAttendance}
        >
          Reset Today
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading attendance records...</div>
      ) : (
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5>Last 30 Days Attendance</h5>
          </div>
          <div className="card-body">
            {attendance.length === 0 ? (
              <p>No attendance records found.</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
