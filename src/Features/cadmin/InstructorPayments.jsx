import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchInstructorById } from "../../Redux/Slices/InstructorsSlice";
import {fetchInstructorStats} from "../../Redux/Slices/instructorStatsSlice";
import {fetchInstructorPayout} from "../../Redux/Slices/instructorPayoutSlice";
import InstructorProfileCard from "./InstructorProfileCard";
import CurrentMonthPaymentCard from "./CurrentMonthPaymentCard";
import FilterCard from "./FilterCard";
import PaymentHistoryTable from "./PaymentHistoryTable";

function InstructorPayments() {
  const { instructorId } = useParams();
  const dispatch = useDispatch();
  const [ischange,setIsChange]=useState(false);
  // Fetch instructor when component mounts
  useEffect(() => {
    dispatch(fetchInstructorById(parseInt(instructorId, 10)));
    dispatch(fetchInstructorStats(parseInt(instructorId, 10)));
    dispatch(fetchInstructorPayout(parseInt(instructorId, 10)));
  }, [dispatch, instructorId,ischange]);

  // State for filtering (expand later if needed)
  const [filters, setFilters] = useState({
    instructor: "",
    course: "",
    month: "",
    status: "all",
  });

  

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* === First Row: Profile & Summary Cards === */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
          <InstructorProfileCard />
        </div>
        <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
          <CurrentMonthPaymentCard isPaid={true} amount={12000} setIsChange={setIsChange} />
        </div>
      </div>

      {/* === Second Row: Filters + Payment Table === */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Filters */}
        <div
          style={{
            flex: "0 0 calc(30% - 10px)",
            minWidth: "250px",
            boxSizing: "border-box",
          }}
        >
          <FilterCard filters={filters} setFilters={setFilters} />
        </div>

        {/* Right: Table */}
        <div
          style={{
            flex: "0 0 calc(70% - 10px)",
            minWidth: "500px",
            boxSizing: "border-box",
            height: "500px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PaymentHistoryTable  />
        </div>
      </div>
    </div>
  );
}

export default InstructorPayments;
