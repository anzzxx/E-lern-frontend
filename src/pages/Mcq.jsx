import React from 'react'
import MCQTest from "../components/mcqform"
import { useNavigate, useParams } from "react-router-dom";
function Mcq() {
  const { testID,courseId } = useParams();
  
  
  return (
    <div>
      <MCQTest testID={testID} courseId={courseId}/>
    </div>
  )
}

export default Mcq
