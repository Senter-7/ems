import React, { useState, useEffect } from 'react';

function EmployeeAttendance() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if today's attendance is already marked
  const todayRecord = records.find(record => record.date === date);

  const markAttendance = (status) => {
    if (!todayRecord) {
      setRecords([...records, { date, status }]);
    }
  };

  const resetToday = () => {
    setRecords(records.filter(record => record.date !== date));
  };

  return (
    <div>
      <h2>EmployeeAttendance</h2>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <button 
        onClick={() => markAttendance('Present')} 
        disabled={!!todayRecord}
      >
        Present
      </button>
      <button 
        onClick={() => markAttendance('Absent')} 
        disabled={!!todayRecord}
      >
        Absent
      </button>
      {todayRecord && (
        <button onClick={resetToday} style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white' }}>
          Reset Today
        </button>
      )}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeAttendance;
