import React, { useRef, useState } from "react";
import { storage, auth, db } from "../../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function Setting() {
  const fileInputRef = useRef();
  // const [email] = useState(localStorage.getItem("email")); // Email is not being updated, so no need for setEmail.
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem("cName"));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("photoURL"));

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    } else {
      console.error("No file selected or files property is undefined");
    }
  };

  const updateLogo = async () => {
    try {
      if (!file) {
        alert("Please select a file before updating.");
        return;
      }
      const filePath = localStorage.getItem("photoURL") || "default_profile_pic.jpg";
      const storageRef = ref(storage, filePath);
      await uploadBytesResumable(storageRef, file);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  const updateCompanyName = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName });
      localStorage.setItem("cName", displayName);

      const userDoc = doc(db, "users", localStorage.getItem("uid"));
      await updateDoc(userDoc, { displayName });

      window.location.reload();
    } catch (error) {
      console.error("Error updating company name:", error);
      alert("Failed to update company name. Please try again.");
    }
  };

  return (
    <div className="setting">
      <p>Settings</p>

      <div className="setting-wrapper">
        <div className="profile-info update-cName">
          <img style={{width:'30%',height:'30%'}}
            onClick={() => fileInputRef.current.click()}
            className="pro"
            alt="profile-pic"
            src={imageUrl}
          />
          <input
            onChange={onSelectFile}
            style={{ display: "none" }}
            type="file"
            ref={fileInputRef}
          />
          {file && <button onClick={updateLogo}
          style={{width:'30%',padding:'10px'}}>Update Profile</button>}
        </div>
        <div className="update-cName">
          <input
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            placeholder="Company name"
            value={displayName}
          />
          <button onClick={updateCompanyName}>Update Company Name</button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
