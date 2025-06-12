import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

// Employee Login (unchanged)
router.post("/employee_login", (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
                if(response) {
                    const token = jwt.sign(
                        { 
                            role: "employee", 
                            email: result[0].email, 
                            id: result[0].id,
                            name: result[0].name 
                        },
                        "jwt_secret_key",
                        { expiresIn: "1d" }
                    );
                    res.cookie('token', token);
                    return res.json({ 
                        loginStatus: true, 
                        id: result[0].id,
                        name: result[0].name
                    });
                } else {
                    return res.json({ loginStatus: false, Error: "Wrong Password" });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

// Get Employee by ID (unchanged)
router.get('/:id', (req, res) => {/*...*/});

// Add Employee (unchanged)
router.post("/add_employee", (req, res) => {/*...*/});

// --------------------------
// Updated Attendance Routes
// --------------------------

// Mark Attendance (Fixed column names)
router.post('/attendance', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ Status: false, Error: "Not authenticated" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.status(403).json({ Status: false, Error: "Invalid token" });

        const status = req.body.status?.toLowerCase();
        if (!['present', 'absent'].includes(status)) {
            return res.status(400).json({ 
                Status: false, 
                Error: "Invalid status. Use 'present' or 'absent'" 
            });
        }

        const sql = `
            INSERT INTO attendance 
                (employee_id, attendance_date, attendance_time, status)
            VALUES 
                (?, CURDATE(), CURTIME(), ?)
            ON DUPLICATE KEY UPDATE 
                status = ?,
                attendance_time = CURTIME()`;
        
        con.query(sql, [decoded.id, status, status], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ 
                    Status: false, 
                    Error: "Database operation failed",
                    Details: err.message
                });
            }
            
            return res.json({ 
                Status: true, 
                Message: "Attendance recorded",
                Record: {
                    employee_id: decoded.id,
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString(),
                    status: status
                }
            });
        });
    });
});

// Get Attendance History (Fixed column mapping)
router.get('/attendance/history', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ Status: false, Error: "Not authenticated" });

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.status(403).json({ Status: false, Error: "Invalid token" });

        const sql = `
            SELECT attendance_date, attendance_time, status 
            FROM attendance 
            WHERE employee_id = ?
            ORDER BY attendance_date DESC
            LIMIT 30`;
        
        con.query(sql, [decoded.id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ 
                    Status: false, 
                    Error: "Failed to fetch records",
                    Details: err.message
                });
            }
            
            return res.json({ 
                Status: true, 
                Result: result.map(record => ({
                    date: new Date(record.attendance_date).toLocaleDateString('en-IN'),
                    time: record.attendance_time,
                    status: record.status.charAt(0).toUpperCase() + record.status.slice(1)
                }))
            });
        });
    });
});

// Logout (unchanged)
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export {router as EmployeeRouter};
