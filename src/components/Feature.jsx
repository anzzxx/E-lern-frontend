import React from 'react'
import keyboard from '../assets/keyboard.png'
import account from '../assets/account.png'
import book from '../assets/book.png'
import "../styles/home.css"

function Feature({countOfCourse}) {
  return (
    <div className="stats">
      <div className="stat-item">
        <img src={keyboard} alt="Keyboard Icon" />
        <h3>{countOfCourse}+ Courses</h3>
      </div>
      <div className="stat-item">
        <img src={account} alt="Account Icon" />
        <h3>Expert Instructors</h3>
      </div>
      <div className="stat-item">
        <img src={book} alt="Book Icon" />
        <h3>Lifetime Access</h3>
      </div>
    </div>
  )
}

export default Feature
