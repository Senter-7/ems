# Object–Context–Information Mapping – Employee Management System (EMS)

This document describes the **core concepts** of the _Employee Management System_ project in terms of **Objects**, **Contexts**, and the **Information** relevant to each context.

---

## Object: User (Admin, HR, Employee)

### Context:
A User is any person who interacts with the EMS. Users are categorized into Admin, HR, and Employee roles, each with different permissions and access. Authentication is required for all users, and their actions are tracked and role-restricted.

### Information:
- Full Name
- Email Address
- Password (securely hashed)
- Unique User ID
- Role (Admin, HR, Employee)
- Department (for HR/Employee)
- Profile Image
- Account creation and last login timestamps

---

## Object: Department

### Context:
A Department represents a functional unit within the organization (e.g., HR, IT, Finance). Departments are managed by Admins and are associated with employees.

### Information:
- Department ID
- Department Name
- List of Employees (has-many relationship)

---

## Object: Employee

### Context:
An Employee is a user with the Employee or HR role. Employees have detailed personal, professional, and banking information stored in the system. They can log in, view, and update their own details, and interact with attendance and leave modules.

### Information:
- Employee ID
- Name
- Email
- Password (hashed)
- Address
- Salary
- Department ID (foreign key)
- Age, Gender, Date of Birth
- Designation, Experience
- Profile Image
- Account Number, Bank Name, Branch
- University, Degree, Branch, Grade Point, Year of Passing
- Father’s Name, Mother’s Name
- Emergency Contact, Alternate Contact
- Aadhar Number, PAN Number

---

## Object: Attendance

### Context:
Attendance records track the daily presence or absence of employees. Used for payroll, HR analytics, and compliance. Managed by HR/Admin, viewable by employees.

### Information:
- Attendance ID
- Employee ID (foreign key)
- Attendance Date
- Status (Present/Absent/Leave)
- Timestamps for record creation/update

---

## Object: Leave

### Context:
Leave represents a request by an employee to be absent for a period. Employees can apply for leave, and HR/Admin can approve or reject requests.

### Information:
- Leave ID
- Employee ID (foreign key)
- Leave Type (e.g., Sick, Casual, Earned)
- Start Date, End Date
- Reason/Description
- Status (Pending, Approved, Rejected)
- Approver ID (HR/Admin)
- Application and decision timestamps

---

## Object: Project

### Context:
A Project is an assignment or task grouping that employees can be associated with. Projects are managed by Admin/HR and can be used for tracking work allocation.

### Information:
- Project ID
- Project Name
- Description
- Start Date, End Date
- Assigned Employees (has-many relationship)
- Status (Active, Completed, On Hold)

---

## Object: Dashboard

### Context:
The dashboard is the personalized homepage for each user after login. It summarizes relevant information (e.g., attendance, leaves, projects) and provides actionable insights based on the user’s role.

### Information:
- Total Employees (for Admin/HR)
- Department/Project summaries
- Recent Attendance/Leave Activity
- Quick Links (Add Employee, Approve Leave, etc.)
- Visual Charts (Attendance trends, Department distribution)
- Last login/activity timestamp

---

## Object: Authentication Session

### Context:
Represents the user’s authenticated session, managed via JWT tokens and cookies. Ensures secure access and role-based authorization.

### Information:
- JWT Token
- User ID
- Role
- Session Expiry
- Login/Logout timestamps

---

## Object: File Upload (Employee Image)

### Context:
Handles the uploading and storage of employee profile images. Managed via the backend and linked to employee records.

### Information:
- File Name
- File Path/URL
- Associated Employee ID
- Upload Timestamp

