import React, { useEffect, useState, useRef } from "react";
import "../styles/sidebar.css";
import Profilebar from "../components/Profilebar";
import { useDispatch, useSelector } from "react-redux";
import {  setName, setEmail, setImage } from "../Redux/Slices/EditProfileSlice";
import "../styles/showmenu.css";
import api from "../Redux/api";
import {handleLogout} from "../components/Logout"
import ChangePasswordModal from '../Features/auth/ChangePasswordModal'
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const token = useSelector((state)=>state.auth.accessToken)
  const name = useSelector((state) => state.profile.name);

  
  const email = useSelector((state) => state.profile.email);
  const image = useSelector((state) => state.profile.image);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  // Fetch Profile Data
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await api.get("api/profile/update/");
        dispatch(setName(response.data.username));
        dispatch(setEmail(response.data.email));
        dispatch(setImage(response.data.profile_picture));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token, dispatch,image]);

  // Handle file upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.put("api/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(setImage(response.data.profile_picture)); // Update Redux state with new image
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
    }
    setShowMenu(false);
  };

  // Handle menu toggle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".popup-menu") && !event.target.closest(".edit-icon")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveImage = async () => {
    try {
        const response = await api.put("api/profile/update/", 
            { remove_image: "true" }, 
            { headers: { "Content-Type": "multipart/form-data", } }
        );

        dispatch(setImage(null)); // Update Redux state
        // alert(response.data.message || "Profile image removed successfully!");
    } catch (error) {
        console.error("Error removing profile image:", error);
        alert("Failed to remove profile image.");
    }
    setShowMenu(false);
};
  

  return (
    <>
      
      <br />
      <br />
      <div className="sidebar">
        <div className="profile">
          <div className="image-container">
            <img
              src={image ? `http://127.0.0.1:8000${image}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="Profile"
              className="profile-image"
            />

            {showImageModal && (
              <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={image ? `http://127.0.0.1:8000${image}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt="Profile"
                    className="modal-image"
                  />
                </div>
              </div>
            )}

            {/* Hidden File Input for Image Upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Popup Menu */}
            {showMenu && (
              <div className="popup-menu">
                <ul>
                  <li onClick={() => setShowImageModal(true)}>View Image</li>
                  <li onClick={() => fileInputRef.current.click()}>Change Image</li>
                  <li onClick={() =>handleRemoveImage()}>Remove Image</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="name-box">
          <span className="edit-icon" onClick={() => setShowMenu(!showMenu)}>✏️</span>
          <h3 className="profile-name">{name}</h3>
          <span>{email}</span>
        </div>

        <ul className="menu">
          <li>Dashboard</li>
          <li onClick={() => navigate('my-courses/')}>My Courses</li>
          <li>My Learning Activity</li>
          <li onClick={() => setIsModalOpen(true)}>Change Password</li>
          <li onClick={()=>{handleLogout()}}>Logout</li>
        </ul>
        <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;

