import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, index) => 1970 + index);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    dept_id: "",
    image: "",
    age: "",
    gender: "",
    account_no: "",
    bank_name: "",
    branch: "",
    university: "",
    degree: "",        // Added
    edu_branch: "",    // Added
    grade: "",         // Added
    yop: "",
    father_name: "",
    mother_name: "",
    emergency_contact: "",
    aadhar_number: "",
    pan_number: ""
  });

  const [dept, setDept] = useState([]);
  const navigate = useNavigate();

  // Fetch department list
  useEffect(() => {
    axios.get("http://localhost:3000/auth/dept")
      .then(res => {
        if (res.data.Status) setDept(res.data.Result);
      })
      .catch(err => console.log(err));
  }, []);

  // Handle image upload
  const handleImage = (e) => {
    setEmployee({ ...employee, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee.dept_id) {
      alert("Please select a department.");
      return;
    }
    if (!employee.aadhar_number) {
      alert("Aadhar number is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("dept_id", Number(employee.dept_id));
    formData.append("age", employee.age);
    formData.append("gender", employee.gender);
    formData.append("account_no", employee.account_no);
    formData.append("bank_name", employee.bank_name);
    formData.append("branch", employee.branch);
    formData.append("university", employee.university);
    formData.append("degree", employee.degree);         // Added
    formData.append("edu_branch", employee.edu_branch); // Added
    formData.append("grade", employee.grade);           // Added
    formData.append("yop", employee.yop);

    // Optional fields: send as "" if blank
    formData.append("father_name", employee.father_name || "");
    formData.append("mother_name", employee.mother_name || "");
    formData.append("pan_number", employee.pan_number || "");

    formData.append("emergency_contact", employee.emergency_contact);
    formData.append("aadhar_number", employee.aadhar_number);

    axios
      .post("http://localhost:3000/auth/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-75 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-3" onSubmit={handleSubmit} encType="multipart/form-data">

          {/* Personal Details */}
          <div className="col-md-6">
            <h5>Personal Details</h5>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={employee.name}
                onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={employee.email}
                onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={employee.password}
                onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Salary</label>
              <input
                type="number"
                className="form-control"
                required
                value={employee.salary}
                onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                required
                value={employee.address}
                onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                required
                value={employee.dept_id}
                onChange={(e) => setEmployee({ ...employee, dept_id: e.target.value })}
              >
                <option value="">Select Department</option>
                {dept.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImage}
              />
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
                  <option value="">Select</option>
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
                pattern="[0-9]{9,18}"
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
              <label className="form-label">Grade</label>
              <input
                type="text"
                className="form-control"
                value={employee.grade}
                onChange={(e) => setEmployee({ ...employee, grade: e.target.value })}
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
                placeholder="Optional"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mother's Name</label>
              <input
                type="text"
                className="form-control"
                value={employee.mother_name}
                onChange={(e) => setEmployee({ ...employee, mother_name: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Emergency Contact</label>
              <input
                type="tel"
                className="form-control"
                pattern="[0-9]{10}"
                value={employee.emergency_contact}
                onChange={(e) => setEmployee({ ...employee, emergency_contact: e.target.value })}
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
                pattern="[0-9]{12}"
                title="12-digit Aadhar number"
                required
                value={employee.aadhar_number}
                onChange={(e) => setEmployee({ ...employee, aadhar_number: e.target.value })}
                placeholder="Enter 12-digit Aadhar number"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-control"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                title="10-character PAN format (e.g., ABCDE1234F)"
                value={employee.pan_number}
                onChange={(e) => setEmployee({ ...employee, pan_number: e.target.value })}
                placeholder="Optional (e.g., ABCDE1234F)"
              />
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
