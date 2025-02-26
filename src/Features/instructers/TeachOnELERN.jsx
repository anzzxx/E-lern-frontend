import React, { useState } from "react";
import {useDispatch,useSelector} from "react-redux"
import {registerInstructor} from "../../Redux/Slices/instructorcreationslice"

import "../../styles/Login.css";

const TeachOnELERN = () => {
  
  const dispatch=useDispatch();
  const [success, setSuccess] = useState(null);
  const { loading, error } = useSelector((state) => state.signup);
  const[formdata,setFormData]=useState({
    name:"",
    phone:"",
    bio:"",
    experience:"",
    organisation:"",


  });
  

  const handleChange=(e)=>{
    setFormData({
      ...formdata,[e.target.name]:e.target.value,
    })
   
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null)
    dispatch(registerInstructor(formdata))
    .unwrap()
    .then((response)=>{
      setSuccess("Instructor registration is successful");
      setFormData({ name: "", phone: "", bio: "",experience: "",organisation:"" });
    })
    
  };

  return (
    <div className="auth-page">
    <div className="login-container">
      
      <div className="form-box">
        <h2>Teach On E-LERN</h2>
        <form  onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" required name="name" value={formdata.name} onChange={handleChange}/>
            <label>Name</label>
          </div>
          <div className="input-box">
            <input type="phone" required name="phone" value={formdata.phone} onChange={handleChange} />
            <label>Phone</label>
          </div>
          <div className="input-box">
            <input type="text" required name="bio" value={formdata.bio} onChange={handleChange} />
            <label>Bio</label>
          </div>
          <div className="input-box">
            <input type="text" required name="experience" value={formdata.experience} onChange={handleChange}/>
            <label>Experience</label>
          </div>
          <div className="input-box">
            <input type="text" required name="organisation" value={formdata.organisation} onChange={handleChange}/>
            <label>Organisation</label>
          </div>
          <br />
          <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"} 
          </button>
        </form>
        <p>
        {success && <p className="success-message">{success}</p>}
        </p>
      </div>
    </div>
    </div>
  );
};

export default TeachOnELERN;
