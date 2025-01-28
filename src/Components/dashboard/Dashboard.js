import React from "react";
import "../../Components/dashboard/dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { getAuth, signOut } from "firebase/auth";

function Dashboard() {
  const navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        localStorage.clear();
        navigate('/login');
      })
      .catch((error) => {
        console.log('logout', error);
      });
  };

  const userName = localStorage.getItem("cName");
  const photoURL = localStorage.getItem("photoURL");

  return (
    <div className="dashboard-wrapper">
      {/* nav */}
      <div className="side-nav">
        <div className="profile-info">
          <Link to="/dashboard/home">
            <img
              src={photoURL}
              alt="User Profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "2px solid white",
                marginBottom: "10px",
              }}
            />
          </Link>
          <div>
            <p
              className="img-p"
              style={{
                fontSize: "20px",
                color: "white",
                fontWeight: "bold",
                margin: "5px 0",
              }}
            >
              {userName}
            </p>
            <button
              className="logout"
              style={{
                width:"100px",
                padding: "5px 5px",
                marginTop: "5px",
                backgroundColor: "white",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
        <hr />
        <div className="menu">
          <Link to="/dashboard/home" className="menu-link">
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link to="/dashboard/invoice" className="menu-link">
            <i className="fa-solid fa-receipt"></i> Invoice
          </Link>
          <Link to="/dashboard/new-invoice" className="menu-link">
            <i className="fa-solid fa-file-invoice"></i> New Invoice
          </Link>
          <Link to="/dashboard/setting" className="menu-link">
            <i className="fa-solid fa-gear"></i> Setting
          </Link>
        </div>
      </div>

      {/* main container */}
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
