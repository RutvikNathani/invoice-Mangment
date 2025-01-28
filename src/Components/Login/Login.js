import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("Email:", email, "Password:", password);

    if (!email || !password) {
      console.error("Email or Password cannot be empty");
      return;
    }

    signInWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User logged in:", user);
        localStorage.setItem("cName", user.displayName || "Anonymous");
        localStorage.setItem("photoURL", user.photoURL || "");
        localStorage.setItem("email", user.email)
        localStorage.setItem('uid', user.uid)


        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Authentication failed:", error.code, error.message);
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h2 className="login-heading">LOGIN</h2>
          <form onSubmit={submitHandler}>
            <input
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
            />
            <input
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
            />
            <input className="login-input login-btn" type="submit" />
          </form>
          <Link to={"/register"} className="register-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
