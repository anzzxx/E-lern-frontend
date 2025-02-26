import React from 'react'
import Sidebar from '../../components/Sidebar'
import '../../styles/sidebar.css'
function Profile() {
  return (
    <>
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>Main Content Area</div>
    </div>
    </>
  )
}

export default Profile
