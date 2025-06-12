import mysql from 'mysql2';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "ems"
});

con.connect(err => {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to MySQL database.");
    }
});

export default con;
