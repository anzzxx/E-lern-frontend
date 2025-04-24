import React, { useState, useEffect } from 'react'
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import Button from 'react-bootstrap/Button';
import '../../styles/mcqtest.css'
import AddMcqtest from './AddMcqtest';
import AddQustions from './AddQustions';
import { fetchTests } from "../../Redux/Slices/TestSlice"
import { fetchQuestions } from "../../Redux/Slices/QustionSlice"
import { useDispatch } from 'react-redux';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn
} from 'mdb-react-ui-kit';

import AddAnswers from './AddAnswers';



function McqTest() {

  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },
    { label: "Courses", path: "/instructor/course" },
    { label: "Lessons", path: "/instructor/lessons" },
    { label: "Notification", path: "/instructor/notification" },
    { label: "MCQ-Test", path: "/instructor/mcq-test" },
    { label: "Logout", onClick: handleLogout },
  ];

  return (
    <>
    <Reusablesidebar title="E-LEARN" menuItems={menuItems} />
     
    <div style={{ 
      marginLeft: '300px', // Match sidebar width
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns
      gap: '20px' // Space between cards
    }}>
      {/* Card 1 */}
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Card title</MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </MDBCardText>
          <MDBBtn>Button</MDBBtn>
        </MDBCardBody>
      </MDBCard>
  

    </div>
  </>
  )
}

export default McqTest
