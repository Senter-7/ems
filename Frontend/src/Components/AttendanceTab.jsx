import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendanceTab() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/dept', {
          withCredentials: true
        });
        if (response.data.Status) {
          setDepartments(response.data.Result);
        }
      } catch (err) {
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  // Fetch employees when department changes
  useEffect(() => {
  const fetchEmployees = async () => {
    if (selectedDept) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/auth/employee/dept/${selectedDept}`, 
          { withCredentials: true }
        );

        if (response.data.Status) {
          setEmployees(response.data.Result);
          setError('');
        } else {
          setError(response.data.Error || 'Failed to load employees');
          setEmployees([]);
        }
      } catch (err) {
        setError(err.response?.data?.Error || 'Failed to load employees');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
  };
  fetchEmployees();
}, [selectedDept]);
  // Fetch attendance history when employee changes
  useEffect(() => {
    const fetchAttendance = async () => {
      if (selectedEmployee) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3000/auth/attendance/employee/${selectedEmployee}`, {
            withCredentials: true
          });
          if (response.data.Status) {
            setRecords(response.data.Result);
          }
        } catch (err) {
          setError('Failed to load attendance records');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAttendance();
  }, [selectedEmployee]);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: 20 }}>
      <h2>Employee Attendance History</h2>
      
      {/* Department Selection */}
      <div style={{ marginBottom: 20 }}>
        <label>Select Department: </label>
        <select 
          value={selectedDept} 
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedEmployee('');
            setRecords([]);
          }}
          disabled={loading}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Employee Selection */}
      <div style={{ marginBottom: 20 }}>
        <label>Select Employee: </label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          disabled={!selectedDept || loading}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      {/* Attendance Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: '16px', textAlign: 'center' }}>
                  {selectedEmployee ? 'No attendance records found' : 'Select an employee to view attendance'}
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    {new Date(record.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td style={{ 
                    padding: '12px',
                    color: record.status === 'Present' ? '#28a745' : '#dc3545'
                  }}>
                    {record.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceTab;
