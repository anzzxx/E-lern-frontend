import React, { useState } from "react";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addCourse } from "../../Redux/Slices/CoursesSlice";
import ReusableForm from "../../components/ReusableForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/editcourse.css";

// Define fields dynamically
const courseFields = [
    { name: "title", label: "Course Title", type: "text", placeholder: "Enter course title" },
    { name: "description", label: "Course Description", type: "textarea", placeholder: "Enter description" },
    { name: "price", label: "Price ($)", type: "number", placeholder: "Enter price" },
    { name: "thumbnail", label: "Thumbnail (Image)", type: "file", accept: "image/*" },
    { name: "prev_vdo", label: "Preview Video", type: "file", accept: "video/*" },
];

// Define validation schema
const courseValidationSchema = yup.object().shape({
    title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
    description: yup.string().required("Description is required").min(10, "Minimum 10 characters required"),
    price: yup.number().typeError("Price must be a number").min(0, "Price cannot be negative").required("Price is required"),
    thumbnail: yup.mixed().required("Thumbnail is required"),
    prev_vdo: yup.mixed().required("Preview video is required"),
});

const AddCourse = () => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");

    const handleFormSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("thumbnail", data.thumbnail[0]);
        formData.append("prev_vdo", data.prev_vdo[0]);

        try {
            const result = await dispatch(addCourse(formData));

            if (result?.meta?.requestStatus === "fulfilled") {
                setMessage({ text: "Course added successfully!", type: "success" });
            } else {
                setMessage({ text: result?.payload?.message || "Failed to add course", type: "danger" });
            }
        } catch (error) {
            setMessage({ text: "Error submitting form", type: "danger" });
        }
    };

    
    return (
        <div className="page-container"> {/* Wrapper for centering */}
            <div className="form-container">
                <h2 className="text-center">Add New Course</h2>
                {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
    
                <ReusableForm fields={courseFields} validationSchema={courseValidationSchema} onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
    
    
};

export default AddCourse;
