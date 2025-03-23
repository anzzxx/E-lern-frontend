import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import api from "../../Redux/api"; // API instance
import "../../styles/button.css";
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import SearchFilter from "../../components/SearchFilter";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Ensure loading is set before fetching
      try {
        const response = await api.get("cadmin/users"); // Adjust endpoint
        const usersData = response.data || []; // Ensure it's an array
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchUsers();
  }, []);

  // Toggle user active status
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await api.patch(`cadmin/users/${id}/`, { is_active: updatedStatus });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: updatedStatus } : user
        )
      );

      setFilteredUsers((prevUsers) =>
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
    { label: "Users", path: "/admin-panel/users" },
    { label: "Requests", path: "/admin-panel/requests" },
    { label: "Logout", onClick: handleLogout },
  ];

  return (
    <div className="requests-container">
      <Reusablesidebar title="E-LERN" menuItems={menuItems} />
      <h2>Search Users</h2>
      
      {!loading && users.length > 0 && (
        <SearchFilter
          data={users}
          fields={["username", "email"]} // Removed "is_active" since it's boolean
          onFilter={setFilteredUsers}
          showFilters={false}
        />
      )}

      <h2>Users List</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : filteredUsers.length > 0 ? (
        <ReusableTable columns={columns} data={filteredUsers} />
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
