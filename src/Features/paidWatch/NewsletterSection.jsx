
"use client";
import React from 'react';
import '../../styles/watch.css';

function NewsletterSection() {
  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <div className="text-content">
          <h2 className="title">Join and get amazing discount</h2>
          <p className="description">
            With our responsive themes and mobile and desktop apps
          </p>
        </div>
        <div className="form-content">
          <div className="input-container">
            <input
              type="email"
              placeholder="Email Address"
              className="email-input"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/af542a6b07e28f4b269074b146750695c0ee3cba?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
              className="email-icon"
              alt="Email icon"
            />
          </div>
          <button className="subscribe-button">
            <span className="button-text">Subscribe</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;