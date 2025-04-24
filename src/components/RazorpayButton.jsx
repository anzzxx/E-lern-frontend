import React from "react";
import api from '../Redux/api';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap"; // Import Bootstrap Button

const RazorpayButton = ({ amount, courseId, userId }) => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      console.log("Sending Payment Request:", { amount, courseId, userId });

      // Ensure all fields are properly defined before making request
      if (!amount || !courseId || !userId) {
        console.error("Missing required parameters:", { amount, courseId, userId });
        alert("Invalid payment request. Please try again.");
        return;
      }

      const { data: orderData } = await api.post(
        "payment/create-payment/",  // Ensure this matches your Django backend route
        { amount, course_id: courseId, user_id: userId },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Order Data from Backend:", orderData);

      const options = {
        key: "rzp_test_4sNwf4bSIwsFCK",
        amount: orderData.amount,
        currency: "INR",
        name: "Sonic Store",
        description: "Course Payment",
        order_id: orderData.id,
        handler: async (response) => {
          console.log("Payment Successful:", response);
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

          // Send verification to backend
          const { data: verificationData } = await api.post(
            "payment/verify-payment/",
            {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
              course_id: courseId,
              user_id: userId,
              status: "success",
              transaction_id: response.razorpay_payment_id,
              method: response.method || "unknown",
              amount: amount,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          console.log("Payment verification response:", verificationData);
          navigate(`/payment-success?transaction_id=${response.razorpay_payment_id}&course_id=${courseId}`);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            console.log("Payment popup closed by user");
            navigate("/payment-failed");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during payment:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
      navigate("/payment-failed");
    }
  };

  return (
    <Button
      variant="primary" // Bootstrap button variant (e.g., primary, success, danger)
      size="lg" // Button size (lg for large, sm for small)
      onClick={handlePayment}
      className="mt-3" // Add margin-top
      style={{ width: "470px",backgroundColor: "#3dcbb1", }}
    >
      Pay ₹{(amount ).toFixed(2)} {/* Convert paise to rupees */}
    </Button>
  );
};

export default RazorpayButton;