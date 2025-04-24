import React, { useEffect, useState } from "react";
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import { fetchInstructors } from "../../Redux/Slices/InstructorsSlice";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../components/ReusableTable";
import SearchFilter from "../../components/SearchFilter";
import ReactPaginate from "react-paginate";
import { IoMdOpen } from "react-icons/io";
import { useNavigate } from "react-router-dom";


function Instructors() {
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const { instructors, status, error } = useSelector((state) => state.instructors);
    const [loading, setLoading] = useState(true);
    const [filterdInstructors, setFilterdInstructors] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        dispatch(fetchInstructors());

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [dispatch]);

    // Sidebar Menu
    const menuItems = [
        { label: "Dashboard", path: "/admin-panel" },
        { label: "Users", path: "/admin-panel/users" },
        { label: "Requests", path: "/admin-panel/requests" },
        { label: "Reported Courses", path: "/admin-panel/reportedcourse-list" },
        { label: "Payments", path: "/admin-panel/payments" },
        { label: "Instructors", path: "/admin-panel/instructors" },
        { label: "Logout", onClick: handleLogout },
    ];

    // Instructor table columns
    const columns = [
        { field: "id", label: "ID", width: 80 },
        { field: "name", label: "Name", width: 150 },
        { field: "user", label: "Email", width: 200 },
        { field: "phone", label: "Phone", width: 250 },
        {
            label: "Action",
            field: "action",
            render: (row) => (
                <div className="action-icons">
                    <IoMdOpen 
                        onClick={() => navigate(`details/${row.id}/`)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            ),
        },
    ];

    // **Pagination Logic**
    const itemsPerPage = 5;
    const pageCount = Math.ceil(filterdInstructors.length / itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    const displayedInstructors = filterdInstructors.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div>
            <Reusablesidebar title="E-LERN" menuItems={menuItems} />
            {!loading && instructors.length > 0 && (
                <SearchFilter
                    data={instructors}
                    fields={["name", "user", "phone"]}
                    onFilter={setFilterdInstructors}
                    showFilters={false}
                />
            )}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger">
                    Error loading instructors: {error?.message || error}
                </div>
            ) : instructors.length > 0 ? (
                <div className="card">
                    <div className="card-body">
                        <ReusableTable
                            columns={columns}
                            data={displayedInstructors}
                            className="table-striped table-hover"
                        />
                    </div>
                </div>
            ) : (
                <div className="alert alert-info">No instructors found</div>
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
}

export default Instructors;
