import React from "react";
import "../../css/navbar.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginExpiration");
    localStorage.removeItem("userName");
    navigate("/login");
    window.location.reload();
  };


  return (
    <>
      <div className="row topbar">
        <div className="logo">DealsDray Logo</div>
      </div>

      <header className="header">
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <a href="/dashboard">Home</a>
            </li>
            <li>
              <a href="/employees">Employee List</a>
            </li>
          </ul>

          <ul className="nav-links">
            <li>
              <a href="/dashboard">{userName ? userName : "User"}</a>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
