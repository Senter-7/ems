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

// Approve Leave Functionality 
router.get('/leaves/:deptId', (req, res) => {
  const deptId = req.params.deptId;
  const sql = `SELECT l.leave_id, l.employee_id, e.name AS employee_name,
      l.start_date, l.end_date, l.leave_type, l.purpose, l.status
    FROM leaves l JOIN employee e ON l.employee_id = e.id
    WHERE e.dept_id = ? ORDER BY l.start_date DESC`;
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

    const sql = `UPDATE leaves SET status = ? WHERE leave_id = ?`;
    con.query(sql, [status, leave_id], (err, result) => {
      if (err) return res.status(500).json({ Status: false, Error: "Database error", Details: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ Status: false, Error: "Leave not found" });
      return res.json({ Status: true, Message: "Leave status updated" });
    });
  });
});

// Add department list
router.get('/dept', (req, res) => {
  const sql = `
    SELECT 
      d.id,
      d.name,
      COUNT(DISTINCT e.id) AS member_count,
      COALESCE(SUM(p.budget), 0) AS total_budget
    FROM dept d
    LEFT JOIN employee e ON d.id = e.dept_id
    LEFT JOIN projects p ON d.id = p.dept_id
    GROUP BY d.id, d.name
    ORDER BY d.name
  `;
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: 'Query Error' });
    return res.json({ Status: true, Result: result });
  });
});

// LOGOUT
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: true });
});

export { router as HRRouter };
