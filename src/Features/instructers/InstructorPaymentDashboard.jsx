import React, { useEffect, useState } from "react";
import StatsSummary from "../../components/MonthlyPayments/StatsSummary";
import LineChart from "../../components/MonthlyPayments/LineChart";
import PaymentTable from "../../components/MonthlyPayments/PaymentTable";
import { fetchInstructorByUserId } from "../../Redux/Slices/InstructorsSlice";
import { fetchInstructorStats } from "../../Redux/Slices/instructorStatsSlice";
import { fetchInstructorPayout } from "../../Redux/Slices/instructorPayoutSlice";
import { fetchInstructorCourses } from "../../Redux/Slices/CoursesSlice";
import { useDispatch, useSelector } from "react-redux";
import FilterCard from "../../Features/cadmin/FilterCard";
const InstructorPaymentDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { selectedInstructor } = useSelector((state) => state.instructors);
  const [filters, setFilters] = useState({
    search: '',
    course: '',
    month: '',
    paymentStatus: ''
  });
  const [appliedFilters,setappliedFilters]=useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInstructorCourses());
    if (user?.id) {
      dispatch(fetchInstructorByUserId(user.id));
      
    }
  }, [dispatch, user]);

  useEffect(() => {
    
    if (selectedInstructor?.data?.id) {
      dispatch(fetchInstructorStats(selectedInstructor.data.id));
      dispatch(fetchInstructorPayout(selectedInstructor.data.id));
      
    }
  }, [dispatch, selectedInstructor]);



  const handleApplyFilters = (appliedFilters) => {
    setappliedFilters(appliedFilters)
    

  };

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          color: "#111827",
          margin: 0,
          fontWeight: "600",
        }}
      >
        Instructor Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 48%",
            minWidth: "300px",
            maxWidth: "100%",
          }}
        >
          <StatsSummary />
        </div>
        <div
          style={{
            flex: "1 1 48%",
            minWidth: "300px",
            maxWidth: "100%",
          }}
        >
          <LineChart />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px", // Adds a small gap between FilterCard and PaymentTable
        }}
      >
        <FilterCard
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
        />
        <PaymentTable appliedFilters={appliedFilters} />
      </div>
    </div>
  );
};

export default InstructorPaymentDashboard;
