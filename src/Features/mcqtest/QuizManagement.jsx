import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnswers } from "../../Redux/Slices/AnswerSlice";
import { fetchQuestions } from "../../Redux/Slices/QustionSlice";
import { fetchTests } from "../../Redux/Slices/TestSlice";
import { useDispatch, useSelector } from "react-redux";

const QuizDetailPage = () => {
  const dispatch = useDispatch();
  const { testId, courseId } = useParams();
  const navigate = useNavigate();

  // Selectors for Redux state
  const tests = useSelector((state) => state.tests.data) || [];
  const questions = useSelector((state) => state.questions.data) || [];
  const selectedTest = tests.find((test) => test.id === parseInt(testId, 10));

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTests(parseInt(courseId, 10)));
      if (selectedTest?.id) {
        await dispatch(fetchQuestions(selectedTest.id));
      }
    };
    fetchData();
  }, [dispatch, courseId, selectedTest?.id]);

  // Map API questions to quiz state format
  const initialQuiz = selectedTest
    ? {
        id: selectedTest.id,
        courseId: parseInt(courseId),
        title: selectedTest.title,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text,
          answers: q.answers.map((a) => ({
            id: a.id,
            text: a.text,
            is_correct: a.is_correct,
          })),
        })),
      }
    : {
        id: parseInt(testId),
        courseId: parseInt(courseId),
        title: "Loading...",
        questions: [],
      };

  const [quiz, setQuiz] = useState(initialQuiz);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: initialQuiz.title,
    questions: JSON.parse(JSON.stringify(initialQuiz.questions)),
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  // Update quiz and editForm when selectedTest or questions change
  useEffect(() => {
    if (selectedTest && questions.length > 0) {
      const updatedQuiz = {
        id: selectedTest.id,
        courseId: parseInt(courseId),
        title: selectedTest.title,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text,
          answers: q.answers.map((a) => ({
            id: a.id,
            text: a.text,
            is_correct: a.is_correct,
          })),
        })),
      };
      setQuiz(updatedQuiz);
      setEditForm({
        title: updatedQuiz.title,
        questions: JSON.parse(JSON.stringify(updatedQuiz.questions)),
      });
    }
  }, [selectedTest, questions, courseId]);

  // Styles (unchanged except for button visibility)
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "30px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      paddingBottom: "15px",
      borderBottom: "1px solid #f0f0f0",
    },
    quizTitle: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: 0,
      letterSpacing: "-0.5px",
    },
    questionCard: {
      backgroundColor: "#fafafa",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "20px",
      transition: "all 0.2s ease",
      border: "1px solid #e8e8e8",
    },
    questionCardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },
    answerItem: {
      display: "flex",
      alignItems: "center",
      margin: "10px 0",
      padding: "12px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e8e8e8",
      transition: "all 0.2s ease",
    },
    correctAnswer: {
      backgroundColor: "#e6f4ea",
      borderColor: "#b7e1cd",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.2s ease",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    iconButton: {
      padding: "8px",
      borderRadius: "50%",
      backgroundColor: "#1890ff",
      color: "white",
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      transition: "all 0.2s ease",
    },
    editButton: {
      backgroundColor: "#1890ff",
      color: "white",
    },
    saveButton: {
      backgroundColor: "#52c41a",
      color: "white",
    },
    cancelButton: {
      backgroundColor: "#f5f5f5",
      color: "#595959",
    },
    editInput: {
      width: "100%",
      padding: "12px",
      margin: "8px 0",
      border: "1px solid #d9d9d9",
      borderRadius: "6px",
      fontSize: "15px",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    editInputFocus: {
      borderColor: "#1890ff",
      boxShadow: "0 0 0 2px rgba(24, 144, 255, 0.2)",
    },
    message: {
      padding: "12px 16px",
      margin: "15px 0",
      borderRadius: "6px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    successMessage: {
      backgroundColor: "#f6ffed",
      border: "1px solid #b7eb8f",
      color: "#389e0d",
    },
    errorMessage: {
      backgroundColor: "#fff1f0",
      border: "1px solid #ffa39e",
      color: "#cf1322",
    },
    icon: {
      fontSize: "16px",
      lineHeight: "1",
    },
  };

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.title.trim()) {
      setMessage({ text: "Quiz title cannot be empty", type: "error" });
      return;
    }
    for (let question of editForm.questions) {
      if (!question.text.trim()) {
        setMessage({ text: "Question text cannot be empty", type: "error" });
        return;
      }
      if (question.answers.length < 2) {
        setMessage({
          text: "Each question must have at least 2 answers",
          type: "error",
        });
        return;
      }
      if (!question.answers.some((ans) => ans.is_correct)) {
        setMessage({
          text: "Each question must have one correct answer",
          type: "error",
        });
        return;
      }
      for (let answer of question.answers) {
        if (!answer.text.trim()) {
          setMessage({ text: "Answer text cannot be empty", type: "error" });
          return;
        }
      }
    }
    setQuiz({ ...quiz, title: editForm.title, questions: editForm.questions });
    setIsEditing(false);
    setMessage({ text: "Quiz updated successfully", type: "success" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      title: quiz.title,
      questions: JSON.parse(JSON.stringify(quiz.questions)),
    });
    setMessage({ text: "", type: "" });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Math.max(...editForm.questions.map((q) => q.id), 0) + 1,
      text: "",
      answers: [
        { id: Math.random() * 10000, text: "", is_correct: true },
        { id: Math.random() * 10000, text: "", is_correct: false },
      ],
    };
    setEditForm({
      ...editForm,
      questions: [...editForm.questions, newQuestion],
    });
  };

  const handleQuestionChange = (qIndex, value) => {
    const updatedQuestions = [...editForm.questions];
    updatedQuestions[qIndex].text = value;
    setEditForm({ ...editForm, questions: updatedQuestions });
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...editForm.questions];
    updatedQuestions[qIndex].answers[aIndex].text = value;
    setEditForm({ ...editForm, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, aIndex) => {
    const updatedQuestions = [...editForm.questions];
    updatedQuestions[qIndex].answers.forEach((answer, idx) => {
      answer.is_correct = idx === aIndex;
    });
    setEditForm({ ...editForm, questions: updatedQuestions });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {isEditing ? (
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            style={styles.editInput}
            placeholder="Enter quiz title"
          />
        ) : (
          <h1 style={styles.quizTitle}>{quiz.title}</h1>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          {isEditing ? (
            <>
              <button
                style={{ ...styles.button, ...styles.saveButton }}
                onClick={handleSave}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <span style={styles.icon}>💾</span> Save
              </button>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={handleCancel}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e8e8e8")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
              >
                <span style={styles.icon}>✖️</span> Cancel
              </button>
            </>
          ) : (
            <button
              style={{ ...styles.button, ...styles.editButton }}
              onClick={handleEdit}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span style={styles.icon}>✏️</span> Edit
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div
          style={{
            ...styles.message,
            ...(message.type === "success"
              ? styles.successMessage
              : styles.errorMessage),
          }}
        >
          <span style={styles.icon}>
            {message.type === "success" ? "✅" : "⚠️"}
          </span>
          {message.text}
        </div>
      )}

      {/* Questions */}
      {isEditing ? (
        <div>
          {editForm.questions.map((question, qIndex) => (
            <div
              key={question.id}
              style={styles.questionCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  styles.questionCardHover.transform;
                e.currentTarget.style.boxShadow =
                  styles.questionCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                style={styles.editInput}
                placeholder={`Question ${qIndex + 1}`}
                onFocus={(e) =>
                  Object.assign(e.currentTarget.style, styles.editInputFocus)
                }
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d9d9d9";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {question.answers.map((answer, aIndex) => (
                <div
                  key={answer.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  <input
                    type="radio"
                    name={`correct-answer-${qIndex}`}
                    checked={answer.is_correct}
                    onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                    style={{ marginRight: "10px", accentColor: "#1890ff" }}
                  />
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    style={{ ...styles.editInput, flex: 1 }}
                    placeholder={`Answer ${aIndex + 1}`}
                    onFocus={(e) =>
                      Object.assign(e.currentTarget.style, styles.editInputFocus)
                    }
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d9d9d9";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          <button
            style={{ ...styles.iconButton, backgroundColor: "#52c41a" }}
            onClick={handleAddQuestion}
            title="Add Question"
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#73d13d")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#52c41a")
            }
          >
            <span style={styles.icon}>➕</span>
          </button>
        </div>
      ) : (
        <div>
          {quiz.questions.map((question, qIndex) => (
            <div
              key={question.id}
              style={styles.questionCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  styles.questionCardHover.transform;
                e.currentTarget.style.boxShadow =
                  styles.questionCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  margin: "0 0 15px",
                }}
              >
                {qIndex + 1}. {question.text}
              </h3>
              <div>
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    style={{
                      ...styles.answerItem,
                      ...(answer.is_correct ? styles.correctAnswer : {}),
                    }}
                  >
                    <input
                      type="radio"
                      checked={answer.is_correct}
                      readOnly
                      style={{ marginRight: "12px", accentColor: "#52c41a" }}
                    />
                    <span style={{ fontSize: "15px", color: "#1a1a1a" }}>
                      {answer.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizDetailPage;