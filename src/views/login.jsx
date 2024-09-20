import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import "../css/create.css";

const Login = ({ setIsLoggedIn }) => {
  const [f_userName, setF_userName] = useState("");
  const [f_Pwd, setF_Pwd] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/login",
        { f_userName, f_Pwd },
        { withCredentials: true }
      );

      const { status, message , user} = response.data;
      if (status === true) {
        alert(message);

        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginExpiration", expirationTime);
        localStorage.setItem("userName", user.f_userName);

        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        alert(message);
      }
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div>
      <p>
        <b>DealsDray Logo</b>
      </p>

      <div class="row breadcrump"><span>Login Page</span></div>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.label}>User Name</label>
            <input
              type="text"
              value={f_userName}
              onChange={(e) => setF_userName(e.target.value)}
              required
              className={styles.input}
            />
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={f_Pwd}
              onChange={(e) => setF_Pwd(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
