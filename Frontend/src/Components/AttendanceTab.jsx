import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendanceTab() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/auth/dept');
        if (response.data.Status && Array.isArray(response.data.Result)) {
          setDepartments(response.data.Result);
        } else {
          setDepartments([]);
          setError('Invalid department data format');
        }
      } catch (err) {
        setError('Failed to load departments');
        setDepartments([]);
      } finally {
        setLoading(false);
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
          const response = await axios.get(`/auth/employee/dept/${selectedDept}`);
          if (response.data.Status && Array.isArray(response.data.Result)) {
            setEmployees(response.data.Result);
          } else {
            setEmployees([]);
          }
        } catch (err) {
          setError('Failed to load employees');
          setEmployees([]);
        } finally {
          setLoading(false);
        }
      } else {
        setEmployees([]);
        setSelectedEmp('');
      }
    };
    fetchEmployees();
  }, [selectedDept]);

  // Reset attendanceMarked when employee or date or department changes
  useEffect(() => {
    setAttendanceMarked(false);
  }, [selectedEmp, selectedDate, selectedDept]);

  const handleAttendance = async (status) => {
    try {
      setLoading(true);
      await axios.post('/auth/attendance', {
        employee_id: selectedEmp,
        date: selectedDate,
        status
      });
      setAttendanceMarked(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.Error || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Mark Attendance</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      {/* Department Dropdown */}
<select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
  <option value="">Select Department</option>
  {departments.map(dept => (
    <option key={dept.id} value={dept.id}>{dept.name}</option>
  ))}
</select>

      {/* Employee Dropdown */}
      <div>
        <label>Employee:</label>
        <select 
          value={selectedEmp} 
          onChange={e => setSelectedEmp(e.target.value)} 
          disabled={!selectedDept || loading}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          disabled={!selectedEmp || loading}
        />
      </div>

      {/* Attendance Buttons */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => handleAttendance('Present')}
          disabled={!selectedEmp || !selectedDate || attendanceMarked || loading}
          style={{ marginRight: 10 }}
        >
          {loading ? 'Processing...' : 'Present'}
        </button>
        <button
          onClick={() => handleAttendance('Absent')}
          disabled={!selectedEmp || !selectedDate || attendanceMarked || loading}
        >
          {loading ? 'Processing...' : 'Absent'}
        </button>
      </div>
      
      {attendanceMarked && <div style={{ color: 'green', marginTop: 10 }}>Attendance marked!</div>}
    </div>
  );
}

export default AttendanceTab;