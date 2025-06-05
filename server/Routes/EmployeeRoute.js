import express from 'express'
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const router = express.Router()

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
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

router.get('/:id', (req, res) => {  // Changed endpoint to match frontend
    const id = req.params.id;
    const sql = `
        SELECT e.*, d.name AS dept_name 
        FROM employee e 
        LEFT JOIN dept d ON e.dept_id = d.id 
        WHERE e.id = ?
    `;
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({ Status: false, Error: "Query error" });
        if(result.length > 0) {
            return res.json({ 
                Status: true, 
                Result: {
                    ...result[0],
                    dept_id: result[0].dept_id.toString()  // Ensure string type for consistency
                }
            });
        } else {
            return res.json({ Status: false, Error: "Employee not found" });
        }
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true });
});

export {router as EmployeeRouter};
