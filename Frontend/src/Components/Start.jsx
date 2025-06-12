import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/verify')
      .then(result => {
        if (result.data.Status) {
          navigate('/');
        }
      }).catch(err => console.log(err));
  }, [navigate]);

  // When user scrolls or clicks down arrow, reveal login panel
  const handleScroll = () => setShowLogin(true);
  const handleClick = () => setShowLogin(true);

  return (
    <div 
      className={`start-container ${showLogin ? "show-login" : ""}`} 
      onWheel={handleScroll} // triggers on mouse scroll
    >
      <section className="welcome-section">
        <h1>Welcome to Employee Management System</h1>
        <button className="scroll-down-btn" onClick={handleClick} aria-label="Show Login">▼</button>
      </section>

      <section className="login-section">
        <div className="login-box">
          <h2 className="text-center mb-4">Login As</h2>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-primary" onClick={() => navigate('/employee_login')}>
              Employee
            </button>
            <button type="button" className="btn btn-success" onClick={() => navigate('/adminlogin')}>
              Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Start;