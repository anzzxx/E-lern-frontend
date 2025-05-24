import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTests } from "../../Redux/Slices/TestSlice";
import { useNavigate } from "react-router-dom";
import TestModal from "../Test";
import styles from "../../styles/Quizzes.module.css";

const Quizzes = ({ courseId }) => {
  const [showTestModal, setShowTestModal] = useState(false);
  const tests = useSelector((state) => state.tests.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTests(courseId));
  }, [dispatch, courseId]);

  const handleViewQuiz = (testId) => {
    navigate(`/instructor/course/manage-test/${testId}/${courseId}/`);
  };

  const handleQuizCreated = () => {
      dispatch(fetchTests(courseId));
    };


  return (
    <>
      <div className={styles.container}>
        {/* Header with proper alignment */}
        <div className={styles.header}>
          <h2 className={styles.title}>Related Quizzes</h2>
          <button
            className={styles.addButton}
             onClick={() => setShowTestModal(true)}
          >
            + Add Quiz
          </button>
        </div>

        {/* Quizzes list with hidden scrollbar */}
        <div className={styles.quizzesList}>
          {tests?.map((test) => (
            <div key={test.id} className={styles.quizCard}>
              <div className={styles.quizHeader}>
                <h3 className={styles.quizTitle}>{test.title}</h3>
                <span className={styles.quizPoints}>
                  {test.question_count * 2 || 0} points
                </span>
              </div>

              <div className={styles.quizMeta}>
                <span>{test.question_count} questions</span>
                <span>{/* Due: {test.due_date || "No due date"} */}</span>
              </div>

              <div className={styles.quizFooter}>
                <div className="space-x-2">
                  <span
                    className={`${styles.status} ${
                      test.status === "Open"
                        ? styles.statusOpen
                        : styles.statusClosed
                    }`}
                  >
                    {test.status || "Closed"}
                  </span>
                </div>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewQuiz(test.id)}
                >
                  View Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showTestModal && (
        <TestModal
          courseId={courseId}
          onClose={() => setShowTestModal(false)}
          onSuccess={handleQuizCreated}
        />
      )}
    </>
  );
};

export default Quizzes;
