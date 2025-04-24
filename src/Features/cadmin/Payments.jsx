import React, { useEffect, useState } from "react";
import { handleLogout } from "../../components/Logout";
import Reusablesidebar from "../../components/Reusablesidebar";
import { fetchPayments } from "../../Redux/Slices/PaymentSlice"
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../components/ReusableTable";
import SearchFilter from "../../components/SearchFilter";
import ReactPaginate from "react-paginate";
function Payments() {
    const dispatch = useDispatch()
    const [filteredpayments, setFilteredPayments] = useState([]);
    const { payments, error, status } = useSelector((state) => state.payments)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0);

    //sidebar Menu
    const menuItems = [
        { label: "Dashboard", path: "/admin-panel" },
        { label: "Users", path: "/admin-panel/users" },
        { label: "Requests", path: "/admin-panel/requests" },
        { label: "Reported Courses", path: "/admin-panel/reportedcourse-list" },
        { label: "Payments", path: "/admin-panel/payments" },
        { label: "Instructors", path: "/admin-panel/instructors" },
        { label: "Logout", onClick: handleLogout },
    ];

    //fetch payment details
    useEffect(() => {
        dispatch(fetchPayments())
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [])


    useEffect(() => {
        if (payments) {
            setFilteredPayments(payments)
        }
    }, [payments]);

    console.log(payments);

    const columns = [
        { field: "id", label: "ID", width: 80 },
        { field: "user", label: "Student", width: 150 },
        { field: "amount", label: "Amount", width: 200 },
        { field: "course", label: "Course", width: 250 },
        { field: "status", label: "Status", width: 250 },
        { field: "transaction_id", label: "Tras ID", width: 250 },
        {
            field: "updated_at",
            label: "Reported Date & Time",
            width: 180,
            render: (row) => new Date(row.updated_at).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            })
        }

    ];
    console.log(filteredpayments);


    // **Pagination Logic**
    const itemsPerPage = 5;
    const pageCount = Math.ceil(filteredpayments.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    const displayedPayments = filteredpayments.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );


    return (
        <div>
            <Reusablesidebar title="E-LERN" menuItems={menuItems} />

            {!loading && payments.length > 0 && (
                <SearchFilter
                    data={payments}
                    fields={["user", "course", "amount", "status"]}
                    onFilter={setFilteredPayments}
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
                <div className="alert alert-danger">Error loading reports: {error.message}</div>
            ) : payments.length > 0 ? (
                <div className="card">
                    <div className="card-body">
                        <ReusableTable
                            columns={columns}
                            data={displayedPayments}
                            className="table-striped table-hover"
                        />
                    </div>
                </div>
            ) : (
                <div className="alert alert-info">No reported courses found</div>
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

export default Payments;
