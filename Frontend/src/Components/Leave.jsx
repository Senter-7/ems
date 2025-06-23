import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Leave = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState("casual");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch leave history on mount and after applying
  const fetchLeaves = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      "http://localhost:3000/employee/leave/history",
      { withCredentials: true }
    );
    
    // Handle both cases:
    if (res.data.Status) {
      setLeaves(res.data.Result || []); // Ensure array even if undefined
    } else {
      setLeaves([]);
    }
  } catch (err) {
    setLeaves([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !purpose) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/employee/apply_leave",
        {
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
          leave_type: type,
          purpose,
        },
        { withCredentials: true }
      );
      if (res.data.Status) {
        setMessage("Leave application submitted successfully!");
        setStartDate(null);
        setEndDate(null);
        setType("casual");
        setPurpose("");
        fetchLeaves(); // Refresh leave history
      } else {
        setMessage(res.data.Error || "Failed to apply for leave.");
      }
    } catch (err) {
      setMessage("Failed to apply for leave.");
    }
  };

  // Calculate duration in days (inclusive)
  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Capitalize first letter
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h3 className="mb-4 text-center">Apply for Leave</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label"><strong>Start Date</strong></label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Select start date"
            minDate={new Date()}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label"><strong>End Date</strong></label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Select end date"
            minDate={startDate || new Date()}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label"><strong>Type of Leave</strong></label>
          <select
            className="form-select"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          >
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="vacation">Vacation</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label"><strong>Purpose of Leave</strong></label>
          <textarea
            className="form-control"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            rows={3}
            placeholder="Enter purpose"
            required
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary" type="submit">
            Apply
          </button>
        </div>
        {message && (
          <div className="alert alert-info mt-3 text-center">{message}</div>
        )}
      </form>

      {/* Leave History Table */}
      <div className="mt-5">
        <h4 className="mb-3 text-center">Leave History</h4>
        {loading ? (
          <div className="text-center">Loading leave history...</div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Leave ID</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration (days)</th>
                <th>Purpose</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">No leave applications found.</td>
                </tr>
              ) : (
                leaves.map(leave => (
                  <tr key={leave.leave_id}>
                    <td>{leave.leave_id}</td>
                    <td>{capitalize(leave.leave_type)}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{getDuration(leave.start_date, leave.end_date)}</td>
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
                        {capitalize(leave.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;
