import React from 'react'
import keyboard from '../assets/keyboard.png'
import account from '../assets/account.png'
import book from '../assets/book.png'

function Feature() {
  return (
    <div>
      <div className="main-content">
        {/* Stats Section */}
        <div className="stats">
          <div className="stat-item">
            <img src={keyboard} alt="img" />
            <h3>120+ Courses</h3>
          </div>
          <div className="stat-item">
            <img src={account} alt="img" />
            <h3>Expert Instructors</h3>
          </div>
          <div className="stat-item">
            <img src={book} alt="img" />
            <h3>Lifetime Access</h3>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default Feature
