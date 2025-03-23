import React from 'react'
import MCQTest from "../components/mcqform"
import { useNavigate, useParams } from "react-router-dom";
function Mcq() {
  const { testID } = useParams();
  
  
  return (
    <div>
      <MCQTest testID={testID}/>
    </div>
  )
}

export default Mcq
