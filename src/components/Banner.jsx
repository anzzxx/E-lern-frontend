import React from 'react'
import "../styles/home.css"
import background from '../assets/background.jpg';
function Banner() {
  return (
    <div>
       <div className="banner" style={{ backgroundImage: `url(${background})` }}>
        <div className="banner-content">
          <h1>WELCOME TO E-LERN</h1>
          <p>Learn And Implement</p>
          <button className="get-started-btn">Get Started!</button>
        </div>
      </div>
    </div>
  )
}

export default Banner
