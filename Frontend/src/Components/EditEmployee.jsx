import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const editableFields = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Salary", value: "salary" },
  { label: "Address", value: "address" },
  { label: "Department", value: "dept_id" },
  { label: "Age", value: "age" },
  { label: "Gender", value: "gender" },
  // Add more fields as needed
];

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    dept_id: "",
    age: "",
    gender: "",
    // Add more fields as needed
  });

  const [originalEmployee, setOriginalEmployee] = useState({});
  const [dept, setDept] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch departments
    axios.get("http://localhost:3000/auth/department")
      .then((result) => {
        if (result.data.Status) {
          setDept(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch employee data
    axios.get("http://localhost:3000/auth/get_employee/" + id)
      .then((result) => {
        setEmployee(result.data.Result[0]);
        setOriginalEmployee(result.data.Result[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedField) {
      alert("Please select a field to edit.");
      return;
    }
    if (employee[selectedField] === originalEmployee[selectedField]) {
      alert("No changes detected.");
      return;
    }
    const changedField = { [selectedField]: employee[selectedField] };

    axios
      .put("http://localhost:3000/auth/edit_employee/" + id, changedField)
      .then((result) => {
        if (result.data.Status) {
          navigate(`/employee_dashboard/employee_detail/${id}`);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFieldChange = (e) => {
    setSelectedField(e.target.value);
  };

  const handleInputChange = (e) => {
    setEmployee({ ...employee, [selectedField]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h3>Edit Employee</h3>
      <form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: 500 }}>
        {/* Dropdown to select field */}
        <div className="mb-3">
          <label className="form-label">Select Field to Edit</label>
          <select
            className="form-select"
            value={selectedField}
            onChange={handleFieldChange}
          >
            <option value="">-- Select Field --</option>
            {editableFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditionally render the input for the selected field */}
        {selectedField && (
          <div className="mb-3">
            <label className="form-label">
              {editableFields.find((f) => f.value === selectedField)?.label}
            </label>
            {selectedField === "dept_id" ? (
              <select
                className="form-select"
                value={employee.dept_id}
                onChange={handleInputChange}
              >
                <option value="">-- Select Department --</option>
                {dept.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            ) : selectedField === "gender" ? (
              <select
                className="form-select"
                value={employee.gender}
                onChange={handleInputChange}
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                type={
                  selectedField === "salary" || selectedField === "age"
                    ? "number"
                    : "text"
                }
                className="form-control"
                value={employee[selectedField] || ""}
                onChange={handleInputChange}
              />
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedField}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
