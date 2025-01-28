import React, { useRef, useState } from "react";
import "../Login/login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../../src/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const fileInputRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const[isLoading,setLoading] = useState(false)

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      console.error("No file selected or files property is undefined");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
      );
      return;
    }

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName}_${date}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      await updateProfile(newUser.user, {
        displayName: displayName,
        photoURL: fileURL,
      });

      await setDoc(doc(db, "users", newUser.user.uid), {
        uid: newUser.user.uid,
        displayName: displayName,
        email: newUser.user.email,
        photoURL: fileURL,
      });

      localStorage.setItem("cName", displayName);
      localStorage.setItem("photoURL", fileURL);
      localStorage.setItem("email", newUser.user.email);
      localStorage.setItem("uid", newUser.user.uid);

      navigate("/dashboard");
      setLoading(false)

      alert("Registration successful!");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Error during registration. Check console for details.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h2 className="login-heading">Create Your Account</h2>
          <form onSubmit={submitHandler}>
            <input
              onChange={(e) => setDisplayName(e.target.value)}
              className="login-input"
              type="text"
              placeholder="Company Name"
              required
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              type="email"
              placeholder="Enter your email"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Enter your password"
              required
            />
            <input
              onChange={onSelectFile}
              style={{ display: "none" }}
              className="login-input"
              type="file"
              ref={fileInputRef}
            />
            <input
              className="login-input"
              type="button"
              value="Select Your Logo"
              onClick={() => fileInputRef.current.click()}
            />
            {imageUrl != null && <img className="image-preview" src={imageUrl} alt="logo-img" />}
            <button className="login-input login-btn" type="submit" value="Register" >{ isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} submit</button>
          </form>
          <Link to="/login" className="register-link">
            Login with your account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
