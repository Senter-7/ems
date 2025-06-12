import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditEmployee = () => {
  const { id } = useParams()
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, index) => 1970 + index);

  // Get user role from localStorage (set this at login in your app)
  const userRole = localStorage.getItem("userRole");
  const isEmployee = userRole === "employee";

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    dept_id: "",
    age: "",
    gender: "",
    account_no: "",
    bank_name: "",
    branch: "",
    university: "",
    degree: "",
    edu_branch: "",
    gradepoint: "",
    yop: "",
    father_name: "",
    mother_name: "",
    emergency_contact: "",
    alternate_contact: "",
    aadhar_number: "",
    pan_number: ""
  });

  const [dept, setDept] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/auth/dept')
      .then(result => {
        if (result.data.Status) {
          setDept(result.data.Result);
        } else {
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))

    axios.get('http://localhost:3000/auth/employee/' + id)
      .then(result => {
        const empData = result.data.Result[0]
        setEmployee({
          ...empData,
          dept_id: empData.dept_id?.toString() || "",
          yop: empData.yop?.toString() || "",
          degree: empData.degree || "",
          edu_branch: empData.edu_branch || "",
          gradepoint: empData.gradepoint || ""
        })
      }).catch(err => console.log(err))
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.put('http://localhost:3000/auth/edit_employee/' + id, employee)
      .then(result => {
        if (result.data.Status) {
          navigate('/employee_dashboard/employee')
        } else {
          alert(result.data.Error)
        }
      }).catch(err => console.log(err))
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-75 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* Personal Details */}
          <div className="col-md-6">
            <h5>Personal Details</h5>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                readOnly={isEmployee}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                readOnly={isEmployee}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="number"
                className="form-control"
                value={employee.salary}
                onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
                readOnly={isEmployee}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={employee.address}
                onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={employee.dept_id}
                onChange={(e) => setEmployee({ ...employee, dept_id: e.target.value })}
              >
                {dept.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  min="18"
                  max="60"
                  value={employee.age}
                  onChange={(e) => setEmployee({ ...employee, age: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={employee.gender}
                  onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="col-md-6">
            <h5>Bank Details</h5>
            <div className="mb-3">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-control"
                value={employee.account_no}
                onChange={(e) => setEmployee({ ...employee, account_no: e.target.value })}
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={employee.bank_name}
                  onChange={(e) => setEmployee({ ...employee, bank_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-control"
                  value={employee.branch}
                  onChange={(e) => setEmployee({ ...employee, branch: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Education Details */}
          <div className="col-md-6">
            <h5>Education Details</h5>
            <div className="mb-3">
              <label className="form-label">University</label>
              <input
                type="text"
                className="form-control"
                value={employee.university}
                onChange={(e) => setEmployee({ ...employee, university: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-control"
                value={employee.degree}
                onChange={(e) => setEmployee({ ...employee, degree: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Branch</label>
              <input
                type="text"
                className="form-control"
                value={employee.edu_branch}
                onChange={(e) => setEmployee({ ...employee, edu_branch: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">gradepoint</label>
              <input
                type="text"
                className="form-control"
                value={employee.gradepoint}
                onChange={(e) => setEmployee({ ...employee, gradepoint: e.target.value })}
                readOnly={isEmployee}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Year of Passing</label>
              <select
                className="form-select"
                value={employee.yop}
                onChange={(e) => setEmployee({ ...employee, yop: e.target.value })}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Relationship Details */}
          <div className="col-md-6">
            <h5>Relationship Details</h5>
            <div className="mb-3">
              <label className="form-label">Father's Name</label>
              <input
                type="text"
                className="form-control"
                value={employee.father_name}
                onChange={(e) => setEmployee({ ...employee, father_name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mother's Name</label>
              <input
                type="text"
                className="form-control"
                value={employee.mother_name}
                onChange={(e) => setEmployee({ ...employee, mother_name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Emergency Contact</label>
              <input
                type="tel"
                className="form-control"
                value={employee.emergency_contact}
                onChange={(e) => setEmployee({ ...employee, emergency_contact: e.target.value })}
              />
            </div>
             <div className="mb-3">
              <label className="form-label">Alternate Contact</label>
              <input
                type="tel"
                className="form-control"
                value={employee.alternate_contact}
                onChange={(e) => setEmployee({ ...employee, alternate_contact: e.target.value })}
              />
            </div>
          </div>

          {/* Government IDs */}
          <div className="col-md-6">
            <h5>Government IDs</h5>
            <div className="mb-3">
              <label className="form-label">Aadhar Number</label>
              <input
                type="text"
                className="form-control"
                value={employee.aadhar_number}
                onChange={(e) => setEmployee({ ...employee, aadhar_number: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-control"
                value={employee.pan_number}
                onChange={(e) => setEmployee({ ...employee, pan_number: e.target.value })}
              />
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEmployee