import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../Redux/api"; // Import your API instance
import ReusableTable from "../../components/ReusableTable";
import Reusablesidebar from '../../components/Reusablesidebar'
import {handleLogout} from '../../components/Logout'
const Requests = () => {
  const [courses, setCourses] = useState([]);

  const menuItems = [
    { label: "Dashboard", path: "/admin-panel" },
    { label: "users", path: "/admin-panel/users" },
    { label: "Requests", path: "/admin-panel/requests" },
    // { label: "Lessons", path: "instructor/lessons" },
    // { label: "Messages", path: "instructor/messages" },
    // { label: "Payment", path: "instructor/payment" },
    // { label: "Notification", path: "instructor/notifications" },
    { label: "Logout", onClick: handleLogout }, // Handle Logout separately
  ];

  // Fetch inactive courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("cadmin/inactive-courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching inactive courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Approve course (Activate)
  const handleApprove = async (id) => {
    try {
      await api.patch(`cadmin/activate-course/${id}/`);

      // Update state after approval
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, is_active: true } : course
        )
      );

      console.log(`Course ID ${id} approved`);
    } catch (error) {
      console.error(`Error approving course ${id}:`, error);
    }
  };

  // Remove course from list (Simulating cancel)
  const handleCancel = (id) => {
    setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
    console.log(`Course ID ${id} removed from the list`);
  };

  // Define table columns
  const columns = [
    { field: "id", label: "ID" },
    { field: "instructor", label: "Instructor" },
    { field: "title", label: "Title" },
    { field: "price", label: "Price ($)" },
    { field: "description", label: "Description" },
    {
      field: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {!row.is_active ? (
            <>
              <FaCheckCircle
                onClick={() => handleApprove(row.id)}
                style={{ color: "green", fontSize: "20px", cursor: "pointer" }}
                title="Approve"
              />
              <FaTimesCircle
                onClick={() => handleCancel(row.id)}
                style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                title="Cancel"
              />
            </>
          ) : (
            <span style={{ color: "green", fontWeight: "bold" }}>✔️ Approved</span>
          )}
        </div>
      ),
    },
  ];

  return (
       
   <>
    <div className="requests-container"> {/* Unique class for this component */}
        <Reusablesidebar title="E-LERN" menuItems={menuItems} />
        <h2>Course Requests</h2>
         <ReusableTable columns={columns} data={courses} />
    </div>
   </>
       
    
  );
};

export default Requests;
