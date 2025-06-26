import express from 'express'
import con from "../utils/db.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const router = express.Router()

// ============================
// HR LOGIN (from employee table)
// ============================
router.post("/HR_login", (req, res) => {
    
    const sql = "SELECT employee.id AS employee_id, employee.name AS employee_name, employee.email,  employee.password,employee.salary,  employee.address,  employee.image,  employee.dept_id,  employee.designation,  employee.experience,  employee.degree,  employee.edu_branch,  employee.gradepoint,  employee.alternate_contact,  employee.age,  employee.gender,  employee.account_no,  employee.bank_name,  employee.branch,  employee.university,  employee.yop,  employee.father_name,  employee.mother_name,  employee.emergency_contact,  employee.aadhar_number,  employee.pan_number,  employee.dob, dept.id AS dept_id,dept.name AS dept_name FROM employee INNER JOIN dept ON employee.dept_id = dept.id WHERE employee.email = ? AND dept.name = 'HR' ";
    con.query(sql, [req.body.email], (err, result) => {
       
        if (err) return res.json({ loginStatus: false, Error: "Query error" });

        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err || !response) {
                    return res.json({ loginStatus: false, Error: "Wrong password" });
                }

                const token = jwt.sign(
                    {
                        role: "HR",
                        id: result[0].employee_id,
                        email: result[0].email,
                        name: result[0].employee_name
                    },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );

                res.cookie("token", token);
                return res.json({
                    loginStatus: true,
                    id: result[0].employee_id,
                    name: result[0].employee_name
                });
            });
        } else {
            return res.json({ loginStatus: false, Error: "Not an HR or invalid email" });
        }
    });
});

// ============================
// GET HR DETAIL by ID (from employee table)
// ============================
router.get("/detail/:id", (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT e.*, d.name AS dept_name
        FROM employee e
        LEFT JOIN dept d ON e.dept_id = d.id
        WHERE e.id = ? AND e.designation = 'HR'
    `;
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query error" });

        if (result.length > 0) {
            return res.json({
                Status: true,
                Result: {
                    ...result[0],
                    dept_id: result[0].dept_id?.toString()
                }
            });
        } else {
            return res.json({ Status: false, Error: "HR not found" });
        }
    });
});

router.get("/attendance/present/:employee_id/:month", (req, res) => {
  const { employee_id, month } = req.params;

  // Ensure month is 2-digit format
  const formattedMonth = month.padStart(2, '0');

  const sql = `
    SELECT employee_id, attendance_date, status
    FROM attendance
    WHERE employee_id = ?
      AND status = 'Present'
      AND MONTH(attendance_date) = ?
    ORDER BY attendance_date DESC
  `;

  con.query(sql, [employee_id, formattedMonth], (err, result) => {
    if (err) {
      return res.status(500).json({
        Status: false,
        Error: "Database error",
        Details: err.message
      });
    }

    return res.json({
      Status: true,
      Result: result
    });
  });
});

router.post("/update_salary/:id", (req, res) => {
  const employeeId = req.params.id;
  const { salary } = req.body;

  // Basic validation
  if (!salary || isNaN(salary)) {
    return res.json({ Status: false, Error: "Invalid salary input" });
  }

  const sql = "UPDATE employee SET salary = ? WHERE id = ?";
  con.query(sql, [salary, employeeId], (err, result) => {
    if (err) {
      console.error("Error updating salary:", err);
      return res.json({ Status: false, Error: "Database error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// ============================
// LOGOUT
// ============================
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: true });
});

export { router as HRRouter };
