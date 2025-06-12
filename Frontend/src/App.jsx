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
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import PrivateRoute from './Components/PrivateRoute'
import AttendanceTab from './Components/AttendanceTab'
import EmployeeAttendance from './Components/EmployeeAttendance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/adminlogin' element={<Login />} />
        <Route path='/employee_login' element={<EmployeeLogin />} />

        {/* Admin Dashboard Routes */}
        <Route path='/dashboard' element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />} />
          <Route path='employee' element={<Employee />} />
          <Route path='dept' element={<Dept />} />
          <Route path='attendance' element={<AttendanceTab />} />
          <Route path='add_dept' element={<AddDept />} />
          <Route path='add_employee' element={<AddEmployee />} />
          {/* <Route path='edit_employee/:id' element={<EditEmployee />} />
          <Route path='employee_detail/:id' element={<EmployeeDetail />} /> */}
        </Route>

        {/* Employee Dashboard Routes */}
        <Route path='/employee_dashboard' element={
          <PrivateRoute role="employee">
            <EmployeeDashboard />
          </PrivateRoute>
        }>
          <Route path='employee_detail/:id' element={<EmployeeDetail />} />
          <Route path='edit_employee/:id' element={<EditEmployee />} />
          <Route path='attendance' element={<EmployeeAttendance />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App