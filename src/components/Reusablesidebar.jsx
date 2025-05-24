import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/instsidebar.css";

const Sidebar = ({ title = "Menu", menuItems = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title" onClick={()=>navigate("/")}>{title}</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.length > 0 ? (
          menuItems.map((item, index) => (
            <li
              key={index}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={() => (item.onClick ? item.onClick() : navigate(item.path))}
            >
              {item.icon && <span className="sidebar-icon">{item.icon}</span>}
              <span className="sidebar-label">{item.label}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </li>
          ))
        ) : (
          <li className="sidebar-item empty-state">No menu items available</li>
        )}
      </ul>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar" style={{ backgroundColor: '#3dcbb1' }}>U</div>
          <div className="user-info">
            <div className="username">User Name</div>
            <div className="user-email">user@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;