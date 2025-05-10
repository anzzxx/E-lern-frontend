"use client";
import React from "react";
import "../../styles/Footer.css";

function Footer() {
  const programmingLinks = [
    "Web Programming",
    "Mobile Programming",
    "Java Beginner",
    "PHP Beginner",
  ];
  const designLinks = ["Adobe Illustrator", "Adobe Photoshop", "Design Logo"];
  const mediaLinks = ["Writing Course", "Photography", "Video Making"];
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 991;

  const socialMediaLogos = [
    { name: "facebook", icon: "🅒" },
    { name: "twitter", icon: "🅣" },
    { name: "instagram", icon: "🅘" }
  ];

  const FooterColumn = ({ title, links }) => (
    <div className="footer-column">
      <h3>{title}</h3>
      {links.map((link, index) => (
        <a key={index} href="#" className="footer-link">
          {link}
        </a>
      ))}
    </div>
  );

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-circle">E</div>
          <h2>E-LERN</h2>
          <p>Learn from industry experts with our curated courses.</p>
        </div>

        {/* Links Sections */}
        <div className="links-section">
          <FooterColumn title="Programming" links={programmingLinks} />
          <FooterColumn title="Design" links={designLinks} />
          <FooterColumn title="Media" links={mediaLinks} />
        </div>
      </div>

      {/* Divider */}
      <hr className="footer-divider" />

      {/* Bottom Footer */}
      <div className="bottom-footer">
        <p>© 2024 E-LERN. All rights reserved.</p>
        <div className="social-icons">
          {socialMediaLogos.map((social) => (
            <a key={social.name} href="#" className="social-icon">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;