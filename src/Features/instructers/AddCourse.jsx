import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addCourse } from "../../Redux/Slices/CoursesSlice"; // Import your addCourse async action
import "../../styles/addcourse.css"; // Import your CSS file for styles and animations

const AddCourse = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset } = useForm();
    const [isSuccess, setIsSuccess] = useState(false); // Track success status
    const [successMessage, setSuccessMessage] = useState(""); // Store success message
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);

        // Handle file uploads
        if (data.thumbnail && data.thumbnail.length > 0) {
            formData.append("thumbnail", data.thumbnail[0]);
        }
        if (data.prev_vdo && data.prev_vdo.length > 0) {
            formData.append("prev_vdo", data.prev_vdo[0]);
        }

        // Log FormData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            setIsLoading(true); // Start loading

            // Dispatch the addCourse action and wait for the result
            const resultAction = await dispatch(addCourse(formData));

            // Check if the result is successful
            if (resultAction?.meta?.requestStatus === "fulfilled") {
                setIsSuccess(true);
                setSuccessMessage(resultAction.payload.message); // Assuming response contains message

                // Reload the page after a short delay (for animation to finish)
                setTimeout(() => {
                    window.location.reload(); // Reload page after success
                }, 2000); // Delay for 2 seconds for animation effect
            } else {
                console.error("Failed to create course:", resultAction?.payload?.message);
                setIsSuccess(false);
                setSuccessMessage(resultAction?.payload?.message || "Something went wrong");
            }

            reset(); // Reset the form fields after submission
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsSuccess(false);
            setSuccessMessage("An error occurred while submitting the form.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Add New Course</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="course-form">
                <input {...register("title")} placeholder="Course Title" className="input-field" required />
                <textarea {...register("description")} placeholder="Course Description" className="input-field" required />
                <input {...register("price", { min: 0 })} type="number" placeholder="Price" className="input-field" required/>


                <label>Thumbnail (Image):</label>
                <input {...register("thumbnail")} type="file" className="input-field file-input" accept="image/*" required />

                <label>Preview Video:</label>
                <input {...register("prev_vdo")} type="file" className="input-field file-input" accept="video/*" required />

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </form>

            {/* Success message or animation */}
            {isSuccess && (
                <div className="success-message fade-in">
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Error message */}
            {!isSuccess && successMessage && (
                <div className="error-message">
                    <span>{successMessage}</span>
                </div>
            )}
        </div>
    );
};

export default AddCourse;
