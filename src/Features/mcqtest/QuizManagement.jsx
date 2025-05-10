import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../../Redux/Slices/QustionSlice";
import { fetchTests } from "../../Redux/Slices/TestSlice";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Redux/api";

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
    title: null,
    questions: {},
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Update quiz when selectedTest or questions change, but skip if editing
  useEffect(() => {
    if (selectedTest && questions.length > 0 && !isEditing) {
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
    }
  }, [selectedTest, questions, courseId, isEditing]);

  // Styles
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
      pointerEvents: "auto",
      userSelect: "text",
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
    console.log("Edit button clicked, setting isEditing to true");
    // Initialize editForm with all questions and answers
    const initialQuestions = {};
    quiz.questions.forEach((question) => {
      const answers = {};
      question.answers.forEach((answer) => {
        answers[answer.id] = {
          text: answer.text,
          is_correct: answer.is_correct,
        };
      });
      initialQuestions[question.id] = {
        text: question.text,
        answers,
      };
    });
    setEditForm({
      title: quiz.title,
      questions: initialQuestions,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Validation
    if (editForm.title && !editForm.title.trim()) {
      setMessage({ text: "Quiz title cannot be empty", type: "error" });
      setIsSaving(false);
      return;
    }

    // Validate all questions (existing and new)
    const allQuestionIds = new Set([
      ...quiz.questions.map((q) => q.id.toString()),
      ...Object.keys(editForm.questions).filter((id) => id.startsWith("new-")),
    ]);

    for (const questionId of allQuestionIds) {
      const editedQuestion = editForm.questions[questionId];
      const existingQuestion = quiz.questions.find((q) => q.id.toString() === questionId);

      // Get question text
      const questionText = editedQuestion?.text ?? existingQuestion?.text;
      if (!questionText?.trim()) {
        setMessage({ text: "Question text cannot be empty", type: "error" });
        setIsSaving(false);
        return;
      }

      // Get all answers for the question
      const editedAnswers = editedQuestion?.answers ?? {};
      const existingAnswers = existingQuestion?.answers.reduce((acc, a) => {
        if (!editedAnswers[a.id]) {
          acc[a.id] = { text: a.text, is_correct: a.is_correct };
        }
        return acc;
      }, {}) ?? {};

      const allAnswers = { ...existingAnswers, ...editedAnswers };

      if (Object.keys(allAnswers).length < 2) {
        setMessage({
          text: "Each question must have at least 2 answers",
          type: "error",
        });
        setIsSaving(false);
        return;
      }

      let hasCorrectAnswer = false;
      for (const answerId in allAnswers) {
        const answer = allAnswers[answerId];
        if (!answer.text?.trim()) {
          setMessage({ text: "Answer text cannot be empty", type: "error" });
          setIsSaving(false);
          return;
        }
        if (answer.is_correct) hasCorrectAnswer = true;
      }

      if (!hasCorrectAnswer) {
        setMessage({
          text: "Each question must have one correct answer",
          type: "error",
        });
        setIsSaving(false);
        return;
      }
    }

    try {
      // 1. Update test title if changed
      let updatedQuiz = { ...quiz };
      if (editForm.title && editForm.title !== quiz.title) {
        const formData = new FormData();
        formData.append("title", editForm.title);
        const testResponse = await api.put(`/mcq/test/${testId}/`, formData);
        updatedQuiz.title = testResponse.data.title;
      }

      // 2. Process questions and answers
      const updatedQuestions = [...quiz.questions];
      const newQuestions = [];

      for (const questionId in editForm.questions) {
        const questionData = editForm.questions[questionId];

        if (questionId.startsWith("new-")) {
          // Create new question
          const questionPayload = {
            test: testId,
            text: questionData.text,
          };
          const questionResponse = await api.post("/mcq/question/create/", questionPayload);
          const newQuestionId = questionResponse.data.id;

          // Create answers for new question
          const newAnswers = [];
          for (const answerId in questionData.answers) {
            const answerData = questionData.answers[answerId];
            const answerPayload = {
              question: newQuestionId,
              text: answerData.text,
              is_correct: answerData.is_correct,
            };
            const answerResponse = await api.post("/mcq/answer/create/", answerPayload);
            newAnswers.push({
              id: answerResponse.data.id,
              text: answerResponse.data.text,
              is_correct: answerResponse.data.is_correct,
            });
          }

          newQuestions.push({
            id: newQuestionId,
            text: questionResponse.data.text,
            answers: newAnswers,
          });
        } else {
          // Update existing question
          const questionIndex = updatedQuestions.findIndex((q) => q.id === parseInt(questionId));
          if (questionIndex !== -1 && questionData.text !== updatedQuestions[questionIndex].text) {
            const questionPayload = { text: questionData.text };
            const questionResponse = await api.put(`/mcq/question/${questionId}/`, questionPayload);
            updatedQuestions[questionIndex].text = questionResponse.data.text;
          }

          // Process answers for existing question
          const updatedAnswers = [...(updatedQuestions[questionIndex]?.answers || [])];
          const editedAnswers = questionData.answers;

          // Update or create answers
          for (const answerId in editedAnswers) {
            const answerData = editedAnswers[answerId];
            if (answerId.startsWith("new-")) {
              // Create new answer
              const answerPayload = {
                question: questionId,
                text: answerData.text,
                is_correct: answerData.is_correct,
              };
              const answerResponse = await api.post("/mcq/answer/create/", answerPayload);
              updatedAnswers.push({
                id: answerResponse.data.id,
                text: answerResponse.data.text,
                is_correct: answerResponse.data.is_correct,
              });
            } else {
              // Update existing answer
              const answerIndex = updatedAnswers.findIndex((a) => a.id === parseInt(answerId));
              if (
                answerIndex !== -1 &&
                (answerData.text !== updatedAnswers[answerIndex].text ||
                  answerData.is_correct !== updatedAnswers[answerIndex].is_correct)
              ) {
                const answerPayload = {
                  text: answerData.text,
                  is_correct: answerData.is_correct,
                };
                const answerResponse = await api.put(`/mcq/answers/${answerId}/`, answerPayload);
                updatedAnswers[answerIndex] = {
                  ...updatedAnswers[answerIndex],
                  text: answerResponse.data.text,
                  is_correct: answerResponse.data.is_correct,
                };
              }
            }
          }

          // Remove deleted answers
          const answerIdsInEditForm = Object.keys(editedAnswers);
          const answersToKeep = updatedAnswers.filter((a) =>
            answerIdsInEditForm.includes(a.id.toString())
          );
          updatedQuestions[questionIndex].answers = answersToKeep;
        }
      }

      // Update quiz state with new and updated questions
      updatedQuiz.questions = [...updatedQuestions, ...newQuestions];
      setQuiz(updatedQuiz);

      // Reset editing state
      setIsEditing(false);
      setEditForm({ title: null, questions: {} });
      setMessage({ text: "Quiz updated successfully", type: "success" });
    } catch (error) {
      console.error("Error updating quiz:", error);
      let errorMessage = "Failed to update quiz";
      if (error.response) {
        if (error.response.status === 405) {
          errorMessage = "Server does not allow updating answers (Method Not Allowed)";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || "Invalid data provided";
        } else if (error.response.status === 404) {
          errorMessage = "Answer or question not found";
        }
      }
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ title: null, questions: {} });
    setMessage({ text: "", type: "" });
  };

  const handleAddQuestion = () => {
    const newQuestionId = `new-${Math.random() * 10000}`;
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [newQuestionId]: {
          text: "",
          answers: {
            [`new-${Math.random() * 10000}`]: { text: "", is_correct: true },
            [`new-${Math.random() * 10000}`]: { text: "", is_correct: false },
          },
        },
      },
    });
  };

  const handleAddAnswer = (questionId) => {
    const newAnswerId = `new-${Math.random() * 10000}`;
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [questionId]: {
          ...editForm.questions[questionId],
          answers: {
            ...editForm.questions[questionId].answers,
            [newAnswerId]: { text: "", is_correct: false },
          },
        },
      },
    });
  };

  const handleQuestionChange = (questionId, value) => {
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [questionId]: {
          ...editForm.questions[questionId],
          text: value,
        },
      },
    });
  };

  const handleAnswerChange = (questionId, answerId, value) => {
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [questionId]: {
          ...editForm.questions[questionId],
          answers: {
            ...editForm.questions[questionId].answers,
            [answerId]: {
              ...editForm.questions[questionId].answers[answerId],
              text: value,
            },
          },
        },
      },
    });
  };

  const handleCorrectAnswerChange = (questionId, answerId) => {
    const updatedAnswers = {};
    for (const aId in editForm.questions[questionId].answers) {
      updatedAnswers[aId] = {
        ...editForm.questions[questionId].answers[aId],
        is_correct: aId === answerId,
      };
    }
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [questionId]: {
          ...editForm.questions[questionId],
          answers: updatedAnswers,
        },
      },
    });
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    const question = editForm.questions[questionId];
    if (Object.keys(question.answers).length <= 2) {
      setMessage({
        text: "Each question must have at least 2 answers",
        type: "error",
      });
      return;
    }
    setEditForm({
      ...editForm,
      questions: {
        ...editForm.questions,
        [questionId]: {
          ...question,
          answers: Object.fromEntries(
            Object.entries(question.answers).filter(([id]) => id !== answerId)
          ),
        },
      },
    });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {isEditing ? (
          <input
            type="text"
            value={editForm.title ?? quiz.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
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
                style={{
                  ...styles.button,
                  ...styles.saveButton,
                  ...(isSaving ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                }}
                onClick={handleSave}
                disabled={isSaving}
                onMouseOver={(e) => !isSaving && (e.currentTarget.style.opacity = "0.9")}
                onMouseOut={(e) => !isSaving && (e.currentTarget.style.opacity = "1")}
              >
                <span style={styles.icon}>{isSaving ? "⏳" : "💾"}</span> {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={handleCancel}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
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
            ...(message.type === "success" ? styles.successMessage : styles.errorMessage),
          }}
        >
          <span style={styles.icon}>{message.type === "success" ? "✅" : "⚠️"}</span>
          {message.text}
        </div>
      )}

      {/* Questions */}
      {isEditing ? (
        <div>
          {quiz.questions.map((question) => (
            <div
              key={question.id}
              style={styles.questionCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.questionCardHover.transform;
                e.currentTarget.style.boxShadow = styles.questionCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <input
                type="text"
                value={editForm.questions[question.id]?.text ?? question.text}
                onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                style={styles.editInput}
                placeholder={`Question`}
                onFocus={(e) => Object.assign(e.currentTarget.style, styles.editInputFocus)}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d9d9d9";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {Object.keys(editForm.questions[question.id]?.answers || {}).map((answerId) => (
                <div
                  key={answerId}
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
                    name={`correct-answer-${question.id}`}
                    checked={editForm.questions[question.id].answers[answerId].is_correct}
                    onChange={() => handleCorrectAnswerChange(question.id, answerId)}
                    style={{ marginRight: "10px", accentColor: "#1890ff" }}
                  />
                  <input
                    type="text"
                    value={editForm.questions[question.id].answers[answerId].text}
                    onChange={(e) => handleAnswerChange(question.id, answerId, e.target.value)}
                    style={{ ...styles.editInput, flex: 1 }}
                    placeholder={`Answer`}
                    onFocus={(e) => Object.assign(e.currentTarget.style, styles.editInputFocus)}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d9d9d9";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    style={{ ...styles.iconButton, backgroundColor: "#ff4d4f" }}
                    onClick={() => handleDeleteAnswer(question.id, answerId)}
                    title="Delete Answer"
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff7875")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4f")}
                  >
                    <span style={styles.icon}>🗑️</span>
                  </button>
                </div>
              ))}
              <button
                style={{ ...styles.iconButton, backgroundColor: "#52c41a" }}
                onClick={() => handleAddAnswer(question.id)}
                title="Add Answer"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#73d13d")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#52c41a")}
              >
                <span style={styles.icon}>➕</span>
              </button>
            </div>
          ))}
          {Object.keys(editForm.questions)
            .filter((qId) => qId.startsWith("new-"))
            .map((questionId) => (
              <div
                key={questionId}
                style={styles.questionCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = styles.questionCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.questionCardHover.boxShadow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <input
                  type="text"
                  value={editForm.questions[questionId].text}
                  onChange={(e) => handleQuestionChange(questionId, e.target.value)}
                  style={styles.editInput}
                  placeholder={`Question`}
                  onFocus={(e) => Object.assign(e.currentTarget.style, styles.editInputFocus)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d9d9d9";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {Object.keys(editForm.questions[questionId].answers).map((answerId) => (
                  <div
                    key={answerId}
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
                      name={`correct-answer-${questionId}`}
                      checked={editForm.questions[questionId].answers[answerId].is_correct}
                      onChange={() => handleCorrectAnswerChange(questionId, answerId)}
                      style={{ marginRight: "10px", accentColor: "#1890ff" }}
                    />
                    <input
                      type="text"
                      value={editForm.questions[questionId].answers[answerId].text}
                      onChange={(e) => handleAnswerChange(questionId, answerId, e.target.value)}
                      style={{ ...styles.editInput, flex: 1 }}
                      placeholder={`Answer`}
                      onFocus={(e) => Object.assign(e.currentTarget.style, styles.editInputFocus)}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#d9d9d9";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      style={{ ...styles.iconButton, backgroundColor: "#ff4d4f" }}
                      onClick={() => handleDeleteAnswer(questionId, answerId)}
                      title="Delete Answer"
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff7875")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4f")}
                    >
                      <span style={styles.icon}>🗑️</span>
                    </button>
                  </div>
                ))}
                <button
                  style={{ ...styles.iconButton, backgroundColor: "#52c41a" }}
                  onClick={() => handleAddAnswer(questionId)}
                  title="Add Answer"
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#73d13d")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#52c41a")}
                >
                  <span style={styles.icon}>➕</span>
                </button>
              </div>
            ))}
          <button
            style={{ ...styles.iconButton, backgroundColor: "#52c41a" }}
            onClick={handleAddQuestion}
            title="Add Question"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#73d13d")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#52c41a")}
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
                e.currentTarget.style.transform = styles.questionCardHover.transform;
                e.currentTarget.style.boxShadow = styles.questionCardHover.boxShadow;
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
                    <span style={{ fontSize: "15px", color: "#1a1a1a" }}>{answer.text}</span>
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