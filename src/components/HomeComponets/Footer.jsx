"use client";
import React from "react";

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

      <style>{`
        .footer-container {
          background-color: #1b1b1b;
          padding: ${isMobile ? "40px 20px" : "60px 80px 30px"};
          width: 100%;
          box-sizing: border-box;
          color: white;
          font-family: 'Gilroy', sans-serif;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: ${isMobile ? "column" : "row"};
          gap: ${isMobile ? "30px" : "60px"};
          margin-bottom: 40px;
        }

        .logo-section {
          flex: ${isMobile ? "1" : "0.5"};
        }

        .logo-circle {
          background-color: #3dcbb1;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
        }

        .links-section {
          display: flex;
          flex-direction: ${isMobile ? "column" : "row"};
          flex: 2;
          gap: ${isMobile ? "30px" : "40px"};
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .footer-column h3 {
          margin: 0 0 16px 0;
          font-weight: 600;
          font-size: 16px;
        }

        .footer-link {
          color: #ffffffcc;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 14px;
        }

        .footer-link:hover {
          color: #3dcbb1;
        }

        .footer-divider {
          border: none;
          height: 1px;
          background-color: #ffffff12;
          margin: 0 0 24px 0;
        }

        .bottom-footer {
          display: flex;
          flex-direction: ${isMobile ? "column-reverse" : "row"};
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          font-size: 14px;
          color: #ffffff99;
        }

        .social-icons {
          display: flex;
          gap: 20px;
        }

        .social-icon {
          color: #ffffff99;
          font-size: 20px;
          transition: color 0.2s;
        }

        .social-icon:hover {
          color: #3dcbb1;
        }
      `}</style>
    </footer>
  );
}

export default Footer;