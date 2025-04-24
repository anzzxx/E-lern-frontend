import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTests } from "../../Redux/Slices/TestSlice";
import { useNavigate } from "react-router-dom";

const Quizzes = ({ courseId }) => {
  const tests = useSelector((state) => state.tests.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTests(courseId));
  }, [dispatch, courseId]);

  const handleViewQuiz = (testId) => {
    navigate(`/instructor/course/manage-test/${testId}/${courseId}/`);
  };

  return (
    <div
      className="bg-white p-4 rounded shadow w-full"
      style={{ marginTop: "24px", height: "400px" }}
    >
      {/* Header with proper alignment */}
      <div className="flex items-center justify-between mb-4 w-full">
        <h2 className="text-xl font-semibold flex-grow">Related Quizzes</h2>
        <button
          className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap ml-2 flex-shrink-0"
          onClick={() => navigate(`/instructor/course/create-test/${courseId}/`)}
        >
          + Add Quiz
        </button>
      </div>

      {/* Quizzes list with hidden scrollbar */}
      <div
        className="space-y-4 overflow-y-auto"
        style={{
          height: "calc(100% - 80px)",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* IE/Edge */
        }}
      >
        {/* Hide scrollbar for Chrome/Safari */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {tests?.map((test) => (
          <div key={test.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">{test.title}</h3>
              <span className="text-blue-600 font-medium">
                {test.question_count * 2 || 0} points
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>{test.question_count} questions</span>
              <span>{/* Due: {test.due_date || "No due date"} */}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    test.status === "Open"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {test.status || "Closed"}
                </span>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleViewQuiz(test.id)}
              >
                View Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;