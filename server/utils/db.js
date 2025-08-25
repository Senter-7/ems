import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); 

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

con.connect(err => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    const isLocal = process.env.DB_HOST === 'localhost' || 
                    process.env.DB_HOST === '127.0.0.1' ||
                    process.env.DB_HOST?.includes('localhost');
    
    if (isLocal) {
      console.log("Connected to Local MySQL database.");
    } else {
      console.log("Connected to Cloud MySQL database.");
      console.log(`Database Host: ${process.env.DB_HOST}`);
    }
  }
});

export default con;
