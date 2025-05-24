"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuestions } from "../Redux/Slices/QustionSlice";
import { fetchTests } from "../Redux/Slices/TestSlice";
import "../styles/Quiz.css";

const Quiz = ({ testID, courseId }) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [skippedQuestions, setSkippedQuestions] = useState([]);

  // Selectors for Redux state
  const tests = useSelector((state) => state.tests.data) || [];
  const questions = useSelector((state) => state.questions.data) || [];
  const selectedTest = tests.find((test) => test.id === parseInt(testID, 10));

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (selectedTest?.id) {
        await dispatch(fetchQuestions(selectedTest.id));
      }
    };
    fetchData();
  }, [dispatch, courseId, selectedTest?.id]);

  // Filter questions for the current test
  const filteredQuestions = questions.filter(
    (question) => question.test === parseInt(testID, 10)
  );

  // Handle option selection
  const handleOptionSelect = (answerId) => {
    setSelectedAnswer(answerId);
    setAnswers(prev => ({
      ...prev,
      [filteredQuestions[currentQuestionIndex].id]: answerId
    }));
    // Remove from skipped if answered
    setSkippedQuestions(prev => prev.filter(id => id !== filteredQuestions[currentQuestionIndex].id));
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[filteredQuestions[currentQuestionIndex + 1].id] || null);
    }
  };

  // Handle previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[filteredQuestions[currentQuestionIndex - 1].id] || null);
    }
  };

  // Handle skip question
  const handleSkip = () => {
    setSkippedQuestions(prev => [...prev, filteredQuestions[currentQuestionIndex].id]);
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      handleNext();
    } else {
      handleSubmit();
    }
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    filteredQuestions.forEach(question => {
      const correctAnswer = question.answers.find(ans => ans.is_correct)?.id;
      if (answers[question.id] === correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (!selectedTest) return <div className="quiz-loading">Loading test...</div>;
  if (filteredQuestions.length === 0) return <div className="quiz-loading">No questions available.</div>;

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const score = calculateScore();
  const isSkipped = skippedQuestions.includes(currentQuestion.id);
  const percentage = Math.round((score / filteredQuestions.length) * 100);

  return (
    <div className="quiz-container">
      {/* Header Section */}
      <div className="quiz-header">
        <h1>{selectedTest.title}</h1>
        <div className="progress-container">
          <span className="progress-text">
            {submitted ? 
              `${filteredQuestions.length}/${filteredQuestions.length}` : 
              `${currentQuestionIndex + 1}/${filteredQuestions.length}`
            }
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
                backgroundColor: submitted ? '#3dcbb1' : '#3dcbb1'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="quiz-content">
        {submitted ? (
          <div className="results-section">
            <div className="results-summary">
              <h2>Quiz Results</h2>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-percent">{percentage}%</span>
                  <span className="score-text">{score} out of {filteredQuestions.length} correct</span>
                </div>
              </div>
            </div>

            <div className="results-details">
              {filteredQuestions.map((question, index) => {
                const correctAnswer = question.answers.find(ans => ans.is_correct);
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === correctAnswer?.id;
                const wasSkipped = skippedQuestions.includes(question.id);

                return (
                  <div 
                    key={question.id} 
                    className={`result-item ${isCorrect ? 'correct' : wasSkipped ? 'skipped' : 'incorrect'}`}
                  >
                    <div className="result-question">
                      <span className="question-number">Q{index + 1}:</span> {question.text}
                    </div>
                    {wasSkipped ? (
                      <div className="result-status skipped">Skipped</div>
                    ) : (
                      <>
                        <div className="user-answer">
                          Your answer: <span className={isCorrect ? 'correct' : 'incorrect'}>
                            {question.answers.find(a => a.id === userAnswer)?.text || "Not answered"}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="correct-answer">
                            Correct answer: <span className="correct">{correctAnswer?.text}</span>
                          </div>
                        )}
                      </>
                    )}
                    {question.explanation && (
                      <div className="explanation">
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Question Section */}
            <div className="question-section">
              <div className="question-text">
                <span className="question-number">Question {currentQuestionIndex + 1}</span>
                <h2>{currentQuestion.text}</h2>
                {isSkipped && <span className="skip-notice">(Skipped)</span>}
              </div>

              {/* Options Section */}
              <div className="options-list">
                {currentQuestion.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`option ${selectedAnswer === answer.id ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(answer.id)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + currentQuestion.answers.indexOf(answer))}
                    </span>
                    <span className="option-text">{answer.text}</span>
                    {selectedAnswer === answer.id && (
                      <span className="option-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="quiz-footer">
        <div className="navigation-buttons">
          {!submitted && !isFirstQuestion && (
            <button className="nav-button prev" onClick={handlePrev}>
              Previous
            </button>
          )}
          
          {!submitted && (
            <button className="nav-button skip" onClick={handleSkip}>
              Skip
            </button>
          )}
          
          {!submitted && !isLastQuestion && (
            <button 
              className="nav-button next" 
              onClick={handleNext}
              disabled={!selectedAnswer && !isSkipped}
            >
              Next
            </button>
          )}
          
          {!submitted && isLastQuestion && (
            <button 
              className="nav-button submit" 
              onClick={handleSubmit}
              disabled={!selectedAnswer && !isSkipped}
            >
              Submit Quiz
            </button>
          )}
          
          {submitted && (
            <button 
            className="nav-button finish"
            onClick={() => window.history.back()}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;