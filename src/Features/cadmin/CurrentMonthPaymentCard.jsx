import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import api from "../../Redux/api";
const CurrentMonthPaymentCard = ({ isPaid = false, onMarkAsPaid,setIsChange }) => {
  const { instructorId } = useParams();
  const { loading, payoutSummary } = useSelector((state) => state.instructorPayout);
  const [isLoading, setIsLoading] = useState(true);
  const [localIsPaid, setLocalIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentstatus,setPaymentStatus]=useState({})
  
  const [paymentDetails, setPaymentDetails] = useState({
    instructor: instructorId,
    month: payoutSummary?.month || "",
    amount: payoutSummary?.instructor_share || 0,
    payout_method: "",
    payout_reference: "",
    notes: ""
  });
  const [errors, setErrors] = useState({
    payout_method: "",
    payout_reference: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    handleFetch()
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isPaid]);

  useEffect(() => {
    if (payoutSummary) {
      setPaymentDetails(prev => ({
        ...prev,
        month: payoutSummary.month,
        amount: payoutSummary.instructor_share
      }));
    }
  }, [payoutSummary]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };
  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    const inputMonth = dateString;
    const dateObj = new Date(inputMonth + " 1"); // Creates Date: March 1, 2025
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const formattedDate = `${year}-${month}-01`;  // "2025-03-01"
    return formattedDate;
  };
  

  const handleMarkAsPaid = () => {
    setShowPaymentModal(true);
    setErrors({
      payout_method: "",
      payout_reference: ""
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      payout_method: "",
      payout_reference: ""
    };

    if (!paymentDetails.payout_method) {
      newErrors.payout_method = "Payment method is required";
      isValid = false;
    }

    if (!paymentDetails.payout_reference) {
      newErrors.payout_reference = paymentDetails.payout_method === "UPI" 
        ? "UPI ID is required" 
        : paymentDetails.payout_method === "Bank Transfer" 
          ? "Bank details are required" 
          : "Reference is required";
      isValid = false;
    } else if (paymentDetails.payout_method === "UPI" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(paymentDetails.payout_reference)) {
      newErrors.payout_reference = "Please enter a valid UPI ID";
      isValid = false;
    } else if (paymentDetails.payout_method === "Bank Transfer" && paymentDetails.payout_reference.length < 10) {
      newErrors.payout_reference = "Please enter valid bank details";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        instructor: paymentDetails.instructor,
        month:formatDateForBackend(paymentDetails.month) ,
        total_amount: paymentDetails.amount,
        payout_method: paymentDetails.payout_method,
        payout_reference: paymentDetails.payout_reference,
        notes: paymentDetails.notes,
        is_paid:true
      };
      
      const response = await api.post('payment/payout/create/', submissionData);
      setErrors(true);
      setLocalIsPaid(true);
      setShowPaymentModal(false);
      if (onMarkAsPaid) {
        onMarkAsPaid();
      }
    } catch (error) {
      console.error("Payment submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFetch = async () => {
    try {
      const formattedDate = formatDateForBackend(paymentDetails.month);
      
      const response = await api.get(`payment/payout-status/${instructorId}/${formattedDate}/`); 
      setPaymentStatus( response.data)
      setLocalIsPaid(response.data.is_paid)
      console.log('Fetched data:', response.data);
    } catch (error) {
      console.log(error);
      
      // if (error.response) {
      //   console.error('Error response:', error.response.data);
      // } else if (error.request) {
      //   console.error('No response received:', error.request);
      // } else {
      //   console.error('Error:', error.message);
      // }
    }
  };
  

  return (
    <>
      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            width: "100%",
            maxWidth: "500px",
            border: "1px solid rgba(108, 99, 255, 0.1)"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              color: "#2c2c54",
              fontSize: "20px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ color: "#6c63ff" }}>✓</span> Confirm Payment
            </h3>
            
            <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "500" }}>Payment Details Summary</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Instructor ID:</span>
                <span>{paymentDetails.instructor}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Month:</span>
                <span>{paymentDetails.month}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Amount to Pay:</span>
                <span style={{ fontWeight: "600" }}>{formatCurrency(paymentDetails.amount)}</span>
              </div>
              {payoutSummary && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <span style={{ color: "#666", fontSize: "12px" }}>(70% of {formatCurrency(payoutSummary.total_amount)})</span>
                </div>
              )}
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#555",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  Payment Method <span style={{ color: "#ff4757" }}>*</span>
                </label>
                <select
                  name="payout_method"
                  value={paymentDetails.payout_method}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: errors.payout_method ? "1px solid #ff4757" : "1px solid #ddd",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    color: "#333",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                >
                  <option value="">Select Payment Method</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Other">Other</option>
                </select>
                {errors.payout_method && (
                  <p style={{
                    color: "#ff4757",
                    fontSize: "12px",
                    margin: "4px 0 0 0"
                  }}>{errors.payout_method}</p>
                )}
              </div>
              
              {paymentDetails.payout_method && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#555",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>
                    {paymentDetails.payout_method === "UPI" ? "UPI ID" : 
                     paymentDetails.payout_method === "Bank Transfer" ? "Bank Account Details" : 
                     "Payment Reference"} <span style={{ color: "#ff4757" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="payout_reference"
                    value={paymentDetails.payout_reference}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: errors.payout_reference ? "1px solid #ff4757" : "1px solid #ddd",
                      backgroundColor: "#fff",
                      fontSize: "14px",
                      color: "#333",
                      outline: "none",
                      transition: "border 0.2s",
                    }}
                    placeholder={
                      paymentDetails.payout_method === "UPI" ? "e.g. name@upi" : 
                      paymentDetails.payout_method === "Bank Transfer" ? "Account number/IFSC" : 
                      "Reference details"
                    }
                  />
                  {errors.payout_reference && (
                    <p style={{
                      color: "#ff4757",
                      fontSize: "12px",
                      margin: "4px 0 0 0"
                    }}>{errors.payout_reference}</p>
                  )}
                  {paymentDetails.payout_method === "UPI" && !errors.payout_reference && (
                    <p style={{
                      color: "#666",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                      fontStyle: "italic"
                    }}>Example: name@upi</p>
                  )}
                  {paymentDetails.payout_method === "Bank Transfer" && !errors.payout_reference && (
                    <p style={{
                      color: "#666",
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                      fontStyle: "italic"
                    }}>Include account number and IFSC code</p>
                  )}
                </div>
              )}
              
              <div style={{ marginBottom: "25px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#555",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={paymentDetails.notes}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    color: "#333",
                    outline: "none",
                    transition: "border 0.2s",
                    resize: "vertical",
                  }}
                  placeholder="Any additional payment details..."
                />
              </div>
              
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                borderTop: "1px solid rgba(108, 99, 255, 0.1)",
                paddingTop: "20px"
              }}>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #ddd",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting ? "#8a85cc" : "#6c63ff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    ":hover": {
                      backgroundColor: isSubmitting ? "#8a85cc" : "#5a52d3",
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <SyncLoader color="#ffffff" size={6} />
                      Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Original Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          width: "100%",
          border: "1px solid rgba(108, 99, 255, 0.1)",
          minHeight: "270px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading || loading || !payoutSummary ? (
          <SyncLoader color="#6c63ff" size={10} />
        ) : (
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 8px 0",
                    color: "#666",
                    fontSize: "14px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {payoutSummary.month}
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    color: "#2c2c54",
                    fontWeight: "600",
                  }}
                >
                  {formatCurrency(payoutSummary.instructor_share)}
                </h3>
                <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "12px" }}>
                  Instructor 70% share of {formatCurrency(payoutSummary.total_amount)}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    color: localIsPaid ? "#28a745" : "#dc3545",
                    fontSize: "14px",
                    fontWeight: "600",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    backgroundColor: localIsPaid ? "#e6f4ea" : "#fce8e9",
                  }}
                >
                  {localIsPaid ? "Paid" : "Pending"}
                </span>
                {!localIsPaid && (
                  <button
                    onClick={handleMarkAsPaid}
                    style={{
                      backgroundColor: "#6c63ff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      ":hover": {
                        backgroundColor: "#5a52d3",
                      },
                    }}
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "15px",
                padding: "10px",
                borderTop: "1px solid rgba(108, 99, 255, 0.1)",
                background: "rgba(245, 245, 255, 0.6)",
                borderRadius: "8px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "14px",
                    color: "#444",
                    fontWeight: "500",
                  }}
                >
                  Total Amount
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    color: "#6c63ff",
                    fontSize: "16px",
                    background: "#efeeff",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {formatCurrency(payoutSummary.total_amount)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "14px",
                    color: "#444",
                    fontWeight: "500",
                  }}
                >
                  Instructor Share (70%)
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    color: "#28a745",
                    fontSize: "16px",
                    background: "#e6f4ea",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {formatCurrency(payoutSummary.instructor_share)}
                </p>
              </div>
              <div>
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "14px",
                    color: "#444",
                    fontWeight: "500",
                  }}
                >
                  Platform Share (30%)
                </p>
                <p
                  style={{
                    margin: "4px 0",
                    fontWeight: "700",
                    color: "#007bff",
                    fontSize: "16px",
                    background: "#e6f0fa",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {formatCurrency(payoutSummary.platform_share)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentMonthPaymentCard;