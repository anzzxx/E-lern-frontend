import React from 'react'
import InstSidebar from '../components/InstSidebar'
import {handleLogout} from '../components/Logout';
import Reusablesidebar from "../components/Reusablesidebar";
function InstructorHome() {

  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },  
    { label: "Courses", path: "/instructor/course" },    
    { label: "lessons", path: "/instructor/lessons" },    
    { label: "notification", path: "/instructor/notification" },    
    { label: "Logout", onClick: handleLogout },  
  ];
  return (

    <>
      <Reusablesidebar  title="E-LERN" menuItems={menuItems}/>

      <h2>Welcome...</h2>
    </>
  )
}

export default InstructorHome
