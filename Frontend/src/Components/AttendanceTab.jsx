import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AttendanceTab() {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

  // Fetch employees and attendance when department changes
  useEffect(() => {
    const fetchData = async () => {
      if (selectedDept) {
        try {
          setLoading(true);
          setError('');
          setEmployees([]);
          setAttendance([]);

          const [employeesRes, attendanceRes] = await Promise.all([
            axios.get(`http://localhost:3000/auth/employee/dept/${selectedDept}`, {
              withCredentials: true
            }),
            axios.get(`http://localhost:3000/auth/attendance/dept/${selectedDept}`, {
              withCredentials: true
            })
          ]);

          if (employeesRes.data.Status) {
            setEmployees(employeesRes.data.Result);
          } else {
            setError('Failed to load employees');
          }

          if (attendanceRes.data.Status) {
            setAttendance(attendanceRes.data.Result);
          } else {
            setError('Failed to load attendance records');
          }

        } catch (err) {
          setError(err.response?.data?.Error || 'Failed to load data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedDept]);

  // Convert date to local YYYY-MM-DD format
  const getLocalDateString = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Combine employee data with attendance for selected date
  const getAttendanceForDate = () => {
    if (!selectedDate) return [];
    
    const targetDate = getLocalDateString(selectedDate);
    
    return employees.map(employee => {
      const record = attendance.find(a => 
  a.employee_id === employee.id && 
  new Date(a.attendance_date).toISOString().slice(0,10) === targetDate
);

      
      return {
        ...employee,
        status: record ? record.status : 'Not Marked'
      };
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: 20 }}>
      <h2>Department Attendance</h2>

      {/* Department Selection */}
      <div style={{ marginBottom: 20 }}>
        <label>Select Department: </label>
        <select 
          value={selectedDept} 
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setSelectedDate(null);
          }}
          disabled={loading}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: 20 }}>
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="dd-MMM-yyyy"
          isClearable
          placeholderText="Choose date"
          disabled={!selectedDept || loading}
          maxDate={new Date()}
        />
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
              <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {!selectedDate ? (
              <tr>
                <td colSpan={2} style={{ padding: '16px', textAlign: 'center' }}>
                  Select a date to view attendance
                </td>
              </tr>
            ) : getAttendanceForDate().length === 0 ? (
              <tr>
                <td colSpan={2} style={{ padding: '16px', textAlign: 'center' }}>
                  No attendance records for this date
                </td>
              </tr>
            ) : (
              getAttendanceForDate().map((employee, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{employee.name}</td>
                  <td style={{ 
                    padding: '12px',
                    color: employee.status === 'Present' ? '#28a745' : 
                          employee.status === 'Absent' ? '#dc3545' : '#6c757d'
                  }}>
                    {employee.status}
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
