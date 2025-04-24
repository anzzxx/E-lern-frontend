import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import api from "../../Redux/api"; // API instance
import "../../styles/button.css";
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import SearchFilter from "../../components/SearchFilter";
import ReactPaginate from "react-paginate";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
      }
    };

    fetchUsers();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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
    { label: "Reported Courses", path: "/admin-panel/reportedcourse-list" },
    { label: "Payments", path: "/admin-panel/payments" },
    { label: "Instructors", path: "/admin-panel/instructors" },
    { label: "Logout", onClick: handleLogout },
  ];

  // **Pagination Logic**
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const displayedRequests = filteredUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="requests-container">
      <Reusablesidebar title="E-LERN" menuItems={menuItems} />
      <h2>Search Users</h2>

      {!loading && users.length > 0 && (
        <SearchFilter
          data={users}
          fields={["username", "email"]}
          onFilter={setFilteredUsers}
          showFilters={false}
        />
      )}

      <h2>Users List</h2>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <ReusableTable columns={columns} data={displayedRequests} />
      ) : (
        <p>No users found.</p>
      )}
      <div>
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          breakClassName={"page-item"}
        />
      </div>
    </div>
  );
};

export default Users;
