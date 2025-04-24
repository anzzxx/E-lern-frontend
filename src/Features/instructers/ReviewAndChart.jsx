import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import required components
import '../../styles/reviewandchart.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const ReviewAndChart = ({courseId}) => {
    // Data for the pie chart
    const reviews = useSelector((state) => state.reviews.reviews);
    const { id } = useParams();
    console.log(`ide${id}`);
    
    const pieChartData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                data: [30, 50, 20],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    };

   
    
    const transformedReviews = reviews
        .filter((review) => review.course === courseId) 
        .map((review) => ({
            id: review.id,
            name: review.user_details.username,
            avatar:
                review.user_details.profile ||
                `https://i.pravatar.cc/50?img=${review.user_details.id}`, 
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        }));
  
        
    return (
        <div className="main-container">
            {/* Left Container: List of Rows */}
            <div className="scrollable-container list-container">
                {transformedReviews.length > 0 ? (
                    transformedReviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <img src={review.avatar} alt={review.name} className="review-avatar" />
                            <div className="review-content">
                                <h3 className="review-name">
                                    {review.name.charAt(0).toUpperCase() + review.name.slice(1)}
                                </h3>
                                <p className="review-date">{review.date}</p>
                                <div className="review-rating">
                                    {"⭐".repeat(review.rating)}
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-reviews">No reviews yet.</p>
                )}
            </div>

            {/* Right Container: Pie Chart */}
            <div className="scrollable-container chart-container">
                <Pie
                    data={pieChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                    }}
                />
            </div>
        </div>
    );
};

export default ReviewAndChart;