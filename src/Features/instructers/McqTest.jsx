import React, { useState,useEffect } from 'react'
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import Button from 'react-bootstrap/Button';
import '../../styles/mcqtest.css'
import AddMcqtest from './AddMcqtest';
import AddQustions from './AddQustions';
import {fetchTests} from "../../Redux/Slices/TestSlice" 
import {fetchQuestions} from "../../Redux/Slices/QustionSlice"
import { useDispatch } from 'react-redux';
import AddAnswers from './AddAnswers';


function McqTest() {
  const dispatch=useDispatch()
  const [showTestForm, setShowTestForm] = useState(false)
  const [showQustForm,setshowQustForm]=useState(false)
  const [showAnsForm,setShowAnsForm]=useState(false)
  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },
    { label: "Courses", path: "/instructor/course" },
    { label: "Lessons", path: "/instructor/lessons" },
    { label: "Notification", path: "/instructor/notification" },
    { label: "MCQ-Test", path: "/instructor/mcq-test" },
    { label: "Logout", onClick: handleLogout },
  ];
  useEffect(()=>{
    dispatch(fetchTests())
    dispatch(fetchQuestions())
  },[dispatch,showTestForm,showQustForm])

  return (
    <>
      <Reusablesidebar title="E-LEARN" menuItems={menuItems} />
      <div className="container">
        <div className="stats">
          <div className="stat-item" onClick={()=>setShowTestForm(!showTestForm)}>
            <h3>Create Test</h3>
          </div>
          <div className="stat-item" onClick={()=>setshowQustForm(!showQustForm)}>
            <h3>Create Questions</h3>
          </div>
          <div className="stat-item" onClick={()=>setShowAnsForm(!showAnsForm)}>
            <h3>Add Answers</h3>
          </div>
          
        </div>
        
        <AddMcqtest showTestForm={showTestForm}/>
        <AddQustions showQustForm={showQustForm}/>
        <AddAnswers setShowAnsForm={showAnsForm}/>
      </div>
      
      

    </>
  )
}

export default McqTest
