
### Object Context Information Mapping

#### 1. **User Roles**
   - **Admin**
     - Manages departments and employees.
     - Handles admin authentication.
     - Can add departments and employees.
   - **HR**
     - Special type of employee (from `employee` table, with `dept.name = 'HR'`).
     - Handles HR-specific login and details.
     - Manages attendance and HR-related employee data.
   - **Employee**
     - General user role.
     - Can log in, view, and update their own details.
     - Attendance and leave management.

#### 2. **Entities**
   - **Department (`dept`)**
     - Has fields like `id`, `name`.
     - Managed by Admin.
   - **Employee (`employee`)**
     - Fields: `id`, `name`, `email`, `password`, `salary`, `address`, `dept_id`, `image`, `age`, `gender`, `account_no`, `bank_name`, `branch`, `university`, `degree`, `edu_branch`, `gradepoint`, `yop`, `father_name`, `mother_name`, `designation`, `experience`, `emergency_contact`, `alternate_contact`, `aadhar_number`, `pan_number`, etc.
     - Linked to a department.
     - Can have a role of HR or general employee.
   - **Attendance (`attendance`)**
     - Tracks employee attendance by `employee_id`, `attendance_date`, `status`.
     - Used for present/absent tracking.
   - **Leave**
     - Employees can apply for leave.
     - HR/Admin can approve/reject leave.

#### 3. **Authentication & Authorization**
   - Uses JWT tokens for session management.
   - Passwords are hashed with bcrypt.
   - Role-based access (admin, HR, employee).

#### 4. **Frontend Components (React)**
   - **Dashboards:** `AdminDashboard`, `HRDashboard`, `EmployeeDashboard`
   - **Login/Authentication:** `Login`, `HRLogin`, `EmployeeLogin`, `PrivateRoute`
   - **Employee Management:** `AddEmployee`, `EditEmployee`, `EmployeeDetail`, `Employee`, `EmployeeAttendance`
   - **Department Management:** `AddDept`, `Dept`
   - **Project Management:** `AddProjects`, `Projects`
   - **Attendance & Leave:** `AttendanceTab`, `Leave`, `ApproveLeave`
   - **UI/Navigation:** `Sidebar`, `Home`, `Start`

#### 5. **Backend Routes**
   - **AdminRoute.js**
     - `/adminlogin`, `/dept`, `/add_dept`, `/add_employee`, etc.
   - **HRRoute.js**
     - `/HR_login`, `/detail/:id`, `/attendance/present/:employee_id/:month`, etc.
   - **EmployeeRoute.js**
     - `/employee_login`, `/:id`, `/add_employee`, etc.

#### 6. **Utilities**
   - **Database Connection:** `server/utils/db.js`
   - **File Uploads:** Uses `multer` for image uploads (employee images).

