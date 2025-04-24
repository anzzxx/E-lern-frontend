import React, { useEffect } from 'react'; // ✅ Import useEffect
import Chat from '../components/Chat';
import { fetchEnrolledCourses } from "../Redux/Slices/enrollmentSlice";
import { useSelector, useDispatch } from 'react-redux';

function Messages() {
    const dispatch = useDispatch();
    
    const token = useSelector((state) => state.auth?.accessToken || null);
    
    useEffect(() => {
        dispatch(fetchEnrolledCourses()); // ✅ Dispatch Redux action
    }, [dispatch]);

    const { data, loading, error } = useSelector((state) => state.enrollments);
    const courses = data?.map(enrollment => enrollment.course) || [];

    if (!token) {
        return <div>Loading... (No token found)</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-center h-screen">
                <Chat  token={token}  />
            </div>
        </div>
    );
}

export default Messages;

