import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from './Components/AdminDashboard'
import EmployeeDashboard from './Components/EmployeeDashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Dept from './Components/Dept'
import AddDept from './Components/AddDept'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import AttendanceTab from './Components/AttendanceTab'
import EmployeeAttendance from './Components/EmployeeAttendance'
import EmployeeLogin from './Components/EmployeeLogin'

import HRLogin from './Components/HRLogin'
import HRDashboard from './Components/HRDashboard'
import SetSalary from './Components/setSalary'


import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute'
import Leave from './Components/Leave'
import ApproveLeave from './Components/ApproveLeave'

import Projects from './Components/Projects'
import AddProject from './Components/AddProjects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />
        <Route path='/hr_login' element={<HRLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path='/dashboard' element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='employee' element={<Employee />} />
          <Route path='dept' element={<Dept />} />
          
          <Route path='add_dept' element={<AddDept />} />
          <Route path='add_employee' element={<AddEmployee />} />
          
          <Route path='projects' element={<Projects />} />
          <Route path='add_projects' element={<AddProject />} />
        </Route>

        
        <Route path='/hr_dashboard' element={
          <PrivateRoute role="HR">
            <HRDashboard />
          </PrivateRoute>
        }>
          <Route path='hr_detail/:id' element={<EmployeeDetail />} />
          <Route path='setSalary/' element={<SetSalary />} />
          <Route path='attendance' element={<AttendanceTab />} />
          <Route path='leave' element={<ApproveLeave />} />
        </Route>

        
        <Route path='/employee_dashboard' element={
          <PrivateRoute role="employee">
            <EmployeeDashboard />
          </PrivateRoute>}>
          <Route path='employee_detail/:id' element={<EmployeeDetail />} />
          <Route path='edit_employee/:id' element={<EditEmployee />} />
          <Route path='attendance' element={<EmployeeAttendance />} />
          <Route path='apply_leave' element={<Leave />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
