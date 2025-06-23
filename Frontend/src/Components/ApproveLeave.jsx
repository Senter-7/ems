import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveLeave = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch departments on mount
  useEffect(() => {
    axios.get("http://localhost:3000/auth/dept", { withCredentials: true })
      .then(res => {
        if (res.data.Status) setDepartments(res.data.Result);
      });
  }, []);

  // Fetch leaves when department changes
  useEffect(() => {
    if (!selectedDept) return;
    setLoading(true);
    axios.get(`http://localhost:3000/auth/leaves/${selectedDept}`, { withCredentials: true })
      .then(res => {
        if (res.data.Status) setLeaves(res.data.Result);
        else setLeaves([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDept]);

  const handleAction = async (leave_id, action) => {
  // Optimistically update the local state
  setLeaves(prevLeaves => 
    prevLeaves.map(leave => 
      leave.leave_id === leave_id ? { ...leave, status: action } : leave
    )
  );

  try {
    const res = await axios.post(
      `http://localhost:3000/auth/leave_action`,
      { leave_id, status: action },
      { withCredentials: true }
    );
    setMessage(res.data.Status ? "Action successful!" : res.data.Error);
    
    // Re-fetch to confirm server state (optional but recommended)
    const { data } = await axios.get(
      `http://localhost:3000/auth/leaves/${selectedDept}`, 
      { withCredentials: true }
    );
    if (data.Status) setLeaves(data.Result);
  } catch (err) {
    setMessage("Failed to update leave status.");
    // Revert UI if the server update fails
    setLeaves(prevLeaves => 
      prevLeaves.map(leave => 
        leave.leave_id === leave_id ? { ...leave, status: "pending" } : leave
      )
    );
  }
};

  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Approve Leave Requests</h3>
      <div className="mb-3">
        <label><strong>Select Department:</strong></label>
        <select
          className="form-select"
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration (days)</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {leaves.length === 0 ? (
    <tr>
      <td colSpan={8} className="text-center">No leave applications found.</td>
    </tr>
  ) : (
    leaves.map(leave => (
      <tr key={leave.leave_id}>
        <td>{leave.employee_name}</td>
        <td>{leave.start_date}</td>
        <td>{leave.end_date}</td>
        <td>{getDuration(leave.start_date, leave.end_date)}</td>
        <td>{leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)}</td>
        <td>{leave.purpose}</td>
        <td>
          <span
            className={
              leave.status === "approved"
                ? "text-success"
                : leave.status === "denied"
                ? "text-danger"
                : "text-secondary"
            }
          >
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </span>
        </td>
        <td>
          {leave.status === "pending" && (
            <>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => handleAction(leave.leave_id, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleAction(leave.leave_id, "denied")}
              >
                Decline
              </button>
            </>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      )}
    </div>
  );
};

export default ApproveLeave;
