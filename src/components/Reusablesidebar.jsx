import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/instsidebar.css";

const Sidebar = ({ title = "Menu", menuItems = [] }) => { // Default values
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{title}</h2>
      <ul className="sidebar-menu">
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <li
              key={index}
              className="sidebar-item"
              onClick={() => (item.onClick ? item.onClick() : navigate(item.path))}
            >
              {item.label}
            </li>
          ))
        ) : (
          <li className="sidebar-item">No menu items available</li> // Prevent crash
        )}
      </ul>
    </div>
  );
};

export default Sidebar;

