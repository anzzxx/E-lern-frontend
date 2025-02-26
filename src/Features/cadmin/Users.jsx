import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import api from "../../Redux/api"; // Assuming you have an API instance
import "../../styles/button.css"
import Reusablesidebar from '../../components/Reusablesidebar'
import {handleLogout} from '../../components/Logout'
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("cadmin/users"); // Adjust the endpoint as per your API
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle user active status
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await api.patch(`cadmin/users/${id}/`, { is_active: updatedStatus });

      // Update the local state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: updatedStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns = [
    { field: "id", label: "ID" },
    { field: "username", label: "Username" },
    { field: "email", label: "Email" },
    {
      field: "is_active",
      label: "Active Status",
      render: (row) => (row.is_active ? "Active" : "Inactive"),
    },
    {
      field: "action",
      label: "Block/Unblock",
      render: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.is_active}
            onChange={() => toggleUserStatus(row.id, row.is_active)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
  ];

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

  return (
    <div className="requests-container">
      <Reusablesidebar title="E-LERN" menuItems={menuItems}/>
      <h2>Users List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReusableTable columns={columns} data={users} />
      )}
    </div>
  );
};

export default Users;
