import React from 'react'
import MCQTest from "../components/mcqform"
import { useNavigate, useParams } from "react-router-dom";
import Quiz from '../components/Quiz';
function Mcq() {
  const { testID,courseId } = useParams();
  
  
  return (
    <div>
      {/* <MCQTest testID={testID} courseId={courseId}/> */}
      <Quiz testID={testID} courseId={courseId} />
    </div>
  )
}

export default Mcq
