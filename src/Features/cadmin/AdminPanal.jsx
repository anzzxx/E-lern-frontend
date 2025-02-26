import React from 'react'
import Reusablesidebar from '../../components/Reusablesidebar'
import {handleLogout} from '../../components/Logout'
function AdminPanal() {

   const menuItems = [
      { label: "Dashboard", path: "/admin-panel" },
      { label: "users", path: "/admin-panel/users" },
      { label: "Requests", path: "/admin-panel/requests" },
      // { label: "Lessons", path: "instructor/lessons" },
      // { label: "Messages", path: "instructor/messages" },
      // { label: "Payment", path: "instructor/payment" },
      // { label: "Notification", path: "instructor/notifications" },
      { label: "Logout", onClick: handleLogout }, // Handle Logout separately
    ];
  return (
    <>
     <Reusablesidebar title="E-LERN" menuItems={menuItems}/>
    </>
  )
}

export default AdminPanal
