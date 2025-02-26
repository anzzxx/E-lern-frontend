import React, { useState } from "react";
import "../styles/showmenu.css"
const ProfileImage = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="profile">
      <div className="image-container">
        <img
          src="data:image/jpeg;base64,/9j/..."
          alt="Profile"
          className="profile-image"
        />
        <span className="edit-icon" onClick={toggleMenu}>
          ✏️
        </span>

        {/* Popup Menu */}
        {showMenu && (
          <div className="popup-menu">
            <ul>
              <li onClick={() => alert("View Image")}>👁️ View Image</li>
              <li onClick={() => alert("Edit Image")}>✏️ Edit Image</li>
              <li onClick={() => alert("Remove Image")}>❌ Remove Image</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;
