import React, { useEffect, useState } from "react";
import ReusableForm from "../../components/ReusableForm";

import * as yup from "yup";
import api from '../../Redux/api'
import { useSelector, useDispatch } from "react-redux";

function AddQustions({ showQustForm }) {
    const tests = useSelector((state) => state.tests.data)
    const [selectedTests, setSelectedTests] = useState("")
    const [loading,setLoading]=useState(false)
    //faind this user course
    const courses = useSelector((state) => state.courses.courses);
    const user_id = useSelector((state) => state.auth.user?.id);
    const userCourses = courses.filter((course) => course.instructor && course.instructor.user_id === user_id);
    const course_ids = userCourses.map((course) => course.id);
    const filteredTests = tests.filter(test => course_ids.includes(test.course));
   
    
    
    
    const fields = [
        {
            name: "text",
            label: "Qustion",
            type: "text",
            placeholder: "Enter the Qstion ",
        },

    ];


    // Step 2: Define the validation schema using yup
    const validationSchema = yup.object().shape({
        text: yup.string().required("Qustion  is required"),

    });

    const onSubmit =async (data) => {
        const formData = {
            test:selectedTests,
            ...data,
        };
        try {
            const response = await api.post("mcq/questions/", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);
            alert("MCQ Qustion created successfully!");
        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to create MCQ Qustion. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        };

    }

   console.log(`test${filteredTests}`);
   
    // Dropdown options
    const testeOptions = [
        { value: "", label: "Select a Test" }, // Default option
        ...filteredTests.map(test => ({ value: test.id, label: test.title }))
    ];
    return (
        <div>
            {showQustForm ? (
                <>
                    <h3>Create New Qustion</h3>
                    {/* Dropdown outside ReusableForm */}
                    <div className="mb-3">
                        <label className="form-label">Tests</label>
                        <select
                            className="form-control"
                            value={selectedTests}
                            onChange={(e) => setSelectedTests(e.target.value)}
                        >
                            {testeOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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

export default AddQustions
