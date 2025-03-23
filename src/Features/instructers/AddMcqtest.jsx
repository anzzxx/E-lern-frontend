import React, { useEffect, useState } from "react";
import ReusableForm from "../../components/ReusableForm";
import * as yup from "yup";
import api from '../../Redux/api'
import { useSelector, useDispatch } from "react-redux";

function AddMcqtest({ showTestForm }) {
    
    const [selectedCourse, setSelectedCourse] = useState(""); // State for selected course
    const { courses = [] } = useSelector((state) => state.courses);
    const user_id = useSelector((state) => state.auth.user?.id);
    const userCourses = courses.filter((course) => course.instructor && course.instructor.user_id === user_id);
    const [loading,setLoading]=useState(false)
    console.log(userCourses);

    // Step 1: Define the fields for the MCQ Test form
    const fields = [
        {
            name: "title",
            label: "Test Title",
            type: "text",
            placeholder: "Enter the test title",
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Enter a description for the test",
        },
    ];

    // Step 2: Define the validation schema using yup
    const validationSchema = yup.object().shape({
        title: yup.string().required("Test Title is required"),
        description: yup.string().required("Description is required"),
    });

    

    // Step 3: Define the onSubmit function
    const onSubmit = async(data) => {
        // Include the selected course in the form data
        const formData = {
            course: selectedCourse,
            ...data,
        };
        try {
            const response = await api.post("mcq/tests/", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("API Response:", response.data);
            alert("MCQ Test created successfully!");
        } catch (error) {
            console.error("API Error:", error);
            alert("Failed to create MCQ Test. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        };
    };

    // Dropdown options
    const courseOptions = [
        { value: "", label: "Select a course" }, // Default option
        ...userCourses.map(course => ({ value: course.id, label: course.title }))
    ];

    return (
        <div>
            {showTestForm ? (
                <>
                    <h3>Create New Test</h3>
                    {/* Dropdown outside ReusableForm */}
                    <div className="mb-3">
                        <label className="form-label">Course</label>
                        <select
                            className="form-control"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            {courseOptions.map((option, index) => (
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
    );
}

export default AddMcqtest;