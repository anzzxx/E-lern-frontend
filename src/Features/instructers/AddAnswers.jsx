import React, { useEffect, useState } from "react";
import ReusableForm from "../../components/ReusableForm";
import * as yup from "yup";
import api from '../../Redux/api'
import { useSelector, useDispatch } from "react-redux";

function AddAnswers({ setShowAnsForm }) {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedQustions, setselectedQustions] = useState("")
  const qustions = useSelector((state) => state.questions.data)
  const [loading, setLoading] = useState(false)
  const tests = useSelector((state) => state.tests.data)
  const courses = useSelector((state) => state.courses.courses);
  const user_id = useSelector((state) => state.auth.user?.id);
  const userCourses = courses.filter((course) => course.instructor && course.instructor.user_id === user_id);
  const course_ids = userCourses.map((course) => course.id);
  const filteredTests = tests.filter(test => course_ids.includes(test.course));
  const test_ids = filteredTests.map((test) => test.id)
  const filterdQustions = qustions.filter(qustion => test_ids.includes(qustion.test))

  console.log(filterdQustions);
  
  // Step 1: Define the fields for the MCQ Test form
  const fields = [
    {
      name: "text",
      label: "Answer",
      type: "text",
      placeholder: "Enter the answer..",
    },

  ];

  // Step 2: Define the validation schema using yup
  const validationSchema = yup.object().shape({
    text: yup.string().required("Test Title is required"),

  });


  // Step 3: Define the onSubmit function
  const onSubmit = async (data) => {
    // Include the selected course in the form data
    const formData = {
      question: selectedQustions,
      is_correct:isChecked,
      ...data,
    };
    console.log(`formdata`, formData);

    try {
      const response = await api.post("mcq/answers/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);
      alert("MCQ Qustion created successfully!");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to create MCQ Test. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    };
  };

  // Dropdown options
  const QustionOptions = [
    { value: "", label: "Select a Qustion." }, // Default option
    ...filterdQustions.map(qus => ({ value: qus.id, label: qus.text }))
  ];
 
 
  return (

    <div>
      {setShowAnsForm ? (
        <>
          <h3>Create New Answer</h3>
          {/* Dropdown outside ReusableForm */}
          <div className="mb-3">
            <label className="form-label">Qustions</label>
            <select
              className="form-control"
              value={selectedQustions}
              onChange={(e) => setselectedQustions(e.target.value)}
            >
              {QustionOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="checkbox"
              id="checkBox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label htmlFor="checkBox" className="ms-2">
            CORRECT ANSWER
            </label>
          </div>
          {/* ReusableForm */}
          <ReusableForm
            fields={fields}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        ""
      )}
    </div>
  )
}

export default AddAnswers
