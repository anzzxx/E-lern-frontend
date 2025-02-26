import React from 'react'
import {handleLogout} from '../../components/Logout'
import Reusablesidebar from "../../components/Reusablesidebar"
function Category() {
  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },  
    { label: "Courses", path: "/instructor/course" },    
    { label: "Logout", onClick: handleLogout },  
  ];
  
  return (
    <div>
      <Reusablesidebar  title="E-LERN" menuItems={menuItems}/>
    </div>
  )
}

export default Category
