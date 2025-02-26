import React from "react";
import { FaGift, FaBell,} from "react-icons/fa"; // Importing icons
import { TiMessage } from "react-icons/ti";
import "../styles/profilebar.css";

const Navbar = () => {
  return (
    <>
    
    <div className="navbar">
      <h2 className="logo">E-LEARN</h2>
      <div className="nav-icons">
        <FaGift className="icon" />
        <FaBell className="icon" />
        <TiMessage className="icon"/>

      </div>
    </div>
    </>
  );
};

export default Navbar;
