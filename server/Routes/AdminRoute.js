import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs"

//const fs=require('fs');
const router = express.Router();

// Image Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
  },
});
const upload = multer({ storage: storage });

// Admin Login
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) return res.json({ loginStatus: false, Error: "Password comparison error" });
        if (response) {
          const token = jwt.sign(
            {
              role: "admin",
              email: result[0].email,
            {
              role: "admin",
              email: result[0].email,
              id: result[0].id,
              name: result[0].name,
              name: result[0].name,
            },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({
          res.cookie("token", token);
          return res.json({
            loginStatus: true,
            id: result[0].id,
            name: result[0].name,
            name: result[0].name,
          });
        }
        return res.json({ loginStatus: false, Error: "Wrong password" });
      });
    } else {
      return res.json({ loginStatus: false, Error: "Email not found" });
    }
  });
});

// Department Routes
router.get("/dept", (req, res) => {
router.get("/dept", (req, res) => {
  const sql = "SELECT * FROM dept";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_dept", (req, res) => {
router.post("/add_dept", (req, res) => {
  const sql = "INSERT INTO dept (`name`) VALUES (?)";
  con.query(sql, [req.body.dept], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true });
  });
});

// Employee Management Routes
router.post("/add_employee", upload.single("image"), (req, res) => {
// Employee Management Routes
router.post("/add_employee", upload.single("image"), (req, res) => {
  const sql = `INSERT INTO employee 
    (name, email, password, address, salary, image, dept_id, age, gender,
     account_no, bank_name, branch, university, yop, father_name, mother_name, designation, experience,
     emergency_contact, alternate_contact, aadhar_number, pan_number, degree, edu_branch, gradepoint) 
     account_no, bank_name, branch, university, yop, father_name, mother_name, designation, experience,
     emergency_contact, alternate_contact, aadhar_number, pan_number, degree, edu_branch, gradepoint) 
    VALUES (?)`;

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Hashing error" });
    const imageName = req.file ? req.file.filename : null;
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      imageName,
      req.body.dept_id,
      req.body.age,
      req.body.gender,
      req.body.account_no,
      req.body.bank_name,
      req.body.branch,
      req.body.university,
      req.body.yop,
      req.body.father_name,
      req.body.mother_name,
      req.body.designation,
      req.body.experience,
      req.body.designation,
      req.body.experience,
      req.body.emergency_contact,
      req.body.alternate_contact,
      req.body.aadhar_number,
      req.body.pan_number,
      req.body.degree,
      req.body.edu_branch,
      req.body.gradepoint,
      req.body.aadhar_number,
      req.body.pan_number,
      req.body.degree,
      req.body.edu_branch,
      req.body.gradepoint,
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error: " + err });
      return res.json({ Status: true });
    });
  });
});

router.put("/edit_employee/:id", upload.single("image"), (req, res) => {
router.put("/edit_employee/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  
  // Define allowed fields with data types
  const allowedFields = {
    "name": "string",
    "email": "string",
    "salary": "number",
    "address": "string",
    "dept_id": "number",
    "age": "number",
    "gender": "string",
    "account_no": "string",
    "bank_name": "string",
    "branch": "string",
    "university": "string",
    "yop": "number",
    "father_name": "string",
    "mother_name": "string",
    "emergency_contact": "string",
    "alternate_contact": "string",
    "aadhar_number": "string",
    "pan_number": "string",
    "degree": "string",
    "edu_branch": "string",
    "gradepoint": "number"
  };
  
  // Collect and validate changed fields
  const updateFields = {};
  const validationErrors = [];
  
  Object.keys(req.body).forEach(field => {
    if (allowedFields.hasOwnProperty(field)) {
      const value = req.body[field];
      const expectedType = allowedFields[field];
      
      // Validate data types
      if (expectedType === "number" && isNaN(Number(value))) {
        validationErrors.push(`Invalid number format for ${field}`);
      } else {
        // Convert to correct type
        updateFields[field] = expectedType === "number" 
          ? Number(value) 
          : value.toString();
      }
    }
  });
  
  // Return validation errors
  if (validationErrors.length > 0) {
    return res.status(400).json({
      Status: false,
      Error: "Validation failed",
      Details: validationErrors
    });
  }
  
  // Process image upload
  if (req.file) {
    updateFields.image = req.file.filename;
    
    // Delete old image if exists
    con.query("SELECT image FROM employee WHERE id = ?", [id], (err, result) => {
      if (!err && result[0]?.image) {
        fs.unlink(`./public/images/${result[0].image}`, (unlinkErr) => {
          if (unlinkErr) console.error("Image delete error:", unlinkErr);
        });
      }
    });
  }
  
  // Check for empty update
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ 
      Status: false, 
      Error: "No valid fields to update" 
    });
  }
  
  // Build parameterized SQL
  const setClause = Object.keys(updateFields)
    .map(field => `${field} = ?`)
    .join(', ');
  
  const values = [...Object.values(updateFields), id];
  const sql = `UPDATE employee SET ${setClause} WHERE id = ?`;
  
  // Execute update with error handling
  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({
        Status: false,
        Error: "Database operation failed",
        SQL: sql,
        Values: values
      });
    }
    
    return res.json({ 
      Status: true,
      Message: "Employee updated successfully",
      UpdatedFields: Object.keys(updateFields),
      AffectedRows: result.affectedRows
    });
  });
});



//const path = require('path');

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  
  // 1. Fetch employee data first to get image path
  con.query("SELECT image FROM employee WHERE id = ?", [id], (fetchErr, fetchResult) => {
    if (fetchErr) {
      console.error("Fetch error:", fetchErr);
      return res.status(500).json({
        Status: false,
        Error: "Database error: " + fetchErr.message
      });
    }
    
    if (fetchResult.length === 0) {
      return res.status(404).json({
        Status: false,
        Error: "Employee not found"
      });
    }
    
    const imageFile = fetchResult[0].image;
    
    // 2. Delete database record
    const deleteSql = "DELETE FROM employee WHERE id = ?";
    con.query(deleteSql, [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Delete error:", deleteErr);
        return res.status(500).json({
          Status: false,
          Error: "Delete failed: " + deleteErr.message
        });
      }
      
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({
          Status: false,
          Error: "No employee deleted"
        });
      }
      
      // 3. Delete associated image file
      if (imageFile) {
        const imagePath = path.join('../public/images', imageFile);
        
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Image delete error:", unlinkErr);
            // Still return success but log the error
            return res.json({
              Status: true,
              Message: "Employee deleted (image deletion failed)"
            });
          }
          
          return res.json({
            Status: true,
            Message: "Employee and image deleted successfully"
          });
        });
      } else {
        return res.json({
          Status: true,
          Message: "Employee deleted successfully"
        });
      }
    });
  });
});
// Get all employees with department name
router.get("/employee", (req, res) => {
  const sql = `
    SELECT e.*, d.name AS dept_name 
    FROM employee e 
    LEFT JOIN dept d ON e.dept_id = d.id
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// Get employee by ID
router.get("/employee/:id", (req, res) => {
// Get employee by ID
router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT e.*, d.name AS dept_name 
    FROM employee e 
    LEFT JOIN dept d ON e.dept_id = d.id 
    WHERE e.id = ?
  `;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (result.length > 0) {
      return res.json({
        Status: true,
    if (err) return res.json({ Status: false, Error: "Query Error" });
    if (result.length > 0) {
      return res.json({
        Status: true,
        Result: {
          ...result[0],
          dept_id: result[0].dept_id?.toString(),
        },
          dept_id: result[0].dept_id?.toString(),
        },
      });
    }
    return res.json({ Status: false, Error: "Employee not found" });
  });
});

// Get employees by department
router.get("/employee/dept/:dept_id", (req, res) => {
  const dept_id = req.params.dept_id;
  const sql = `
    SELECT e.*, d.name AS dept_name 
    FROM employee e 
    LEFT JOIN dept d ON e.dept_id = d.id 
    WHERE e.dept_id = ?
  `;
  con.query(sql, [dept_id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "Database query error",
        Details: err.message,
      });
    return res.json({
      Status: true,
      Result: result.map((emp) => ({
        ...emp,
        dept_id: emp.dept_id?.toString(),
      })),
    });
  });
});

// Get employees by department
router.get("/employee/dept/:dept_id", (req, res) => {
  const dept_id = req.params.dept_id;
  const sql = `
    SELECT e.*, d.name AS dept_name 
    FROM employee e 
    LEFT JOIN dept d ON e.dept_id = d.id 
    WHERE e.dept_id = ?
  `;
  con.query(sql, [dept_id], (err, result) => {
    if (err)
      return res.json({
        Status: false,
        Error: "Database query error",
        Details: err.message,
      });
    return res.json({
      Status: true,
      Result: result.map((emp) => ({
        ...emp,
        dept_id: emp.dept_id?.toString(),
      })),
    });
  });
});

// Dashboard Statistics
router.get("/admin_count", (req, res) => {
router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee_count", (req, res) => {
router.get("/employee_count", (req, res) => {
  const sql = "SELECT COUNT(id) AS employee FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", (req, res) => {
router.get("/salary_count", (req, res) => {
  const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Get all admin records
router.get("/admin_records", (req, res) => {
// Get all admin records
router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

// Get attendance for all employees in a department
router.get('/attendance/dept/:dept_id', (req, res) => {
  const dept_id = req.params.dept_id;
  const sql = `
    SELECT a.employee_id, a.attendance_date, a.status, e.name AS employee_name
    FROM attendance a
    JOIN employee e ON a.employee_id = e.id
    WHERE e.dept_id = ?
    ORDER BY a.attendance_date DESC
  `;
  con.query(sql, [dept_id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get('/leaves/:deptId', (req, res) => {
  const deptId = req.params.deptId;
  const sql = `
    SELECT 
      l.leave_id,
      l.employee_id,
      e.name AS employee_name,
      l.start_date,
      l.end_date,
      l.leave_type,
      l.purpose,
      l.status
    FROM leaves l
    JOIN employee e ON l.employee_id = e.id
    WHERE e.dept_id = ?
    ORDER BY l.start_date DESC
  `;
  con.query(sql, [deptId], (err, result) => {
    if (err) return res.json({ Status: false, Error: err.message });
    return res.json({ Status: true, Result: result });
  });
});

router.post('/leave_action', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ Status: false, Error: "Not authenticated" });

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.status(403).json({ Status: false, Error: "Invalid token" });

    const { leave_id, status } = req.body;
    if (!leave_id || !['approved', 'denied'].includes(status)) {
      return res.status(400).json({ Status: false, Error: "Invalid input" });
    }

    const sql = `
      UPDATE leaves
      SET status = ?
      WHERE leave_id = ?
    `;
    con.query(sql, [status, leave_id], (err, result) => {
      if (err) return res.status(500).json({ Status: false, Error: "Database error", Details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ Status: false, Error: "Leave not found" });
      return res.json({ Status: true, Message: "Leave status updated" });
    });
  });
});
// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});


export { router as adminRouter };
