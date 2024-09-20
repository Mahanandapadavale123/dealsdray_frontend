import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Login from "./views/login";
import EmployeeList from "./views/EmployeeList";
import CreateEmployee from "./views/create.jsx";
import EditEmployee from "./views/edit.jsx";
import Dashboard from "./views/dashboard.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const expiration = localStorage.getItem("loginExpiration");
    const currentTime = new Date().getTime();

    if (isLoggedIn && expiration && currentTime < expiration) {
      return true;
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loginExpiration");
      return false;
    }
  });


  const checkAuthentication = async () => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const expiration = localStorage.getItem("loginExpiration");
      const currentTime = new Date().getTime();

      if (isLoggedIn && expiration && currentTime < expiration) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loginExpiration");
      }
    } catch (error) {
      console.log("Error checking authentication:", error);
      setIsLoggedIn(false);
    }
    console.log(isLoggedIn);      
  };

  useEffect(() =>{
    checkAuthentication();
  })

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn}  /> }
        />

        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/employees"
          element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees/create"
          element={isLoggedIn ? <CreateEmployee /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees/edit/:id"
          element={isLoggedIn ? <EditEmployee /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
