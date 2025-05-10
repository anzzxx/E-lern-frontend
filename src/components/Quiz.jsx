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

  if (!selectedTest) return <div className="quiz-container">Loading test...</div>;
  if (filteredQuestions.length === 0) return <div className="quiz-container">No questions available.</div>;

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const score = calculateScore();
  const isSkipped = skippedQuestions.includes(currentQuestion.id);

  return (
    <main className="quiz-container">
      {/* Header Section */}
      <header className="quiz-header">
        <div className="coin-counter">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a0aa6f5b4631f1874fce45ec352d5b5fd9c0dfd8?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
            alt="Coin icon"
            className="coin-icon"
          />
          <span className="coin-amount">200</span>
        </div>

        <h1 className="quiz-title">{selectedTest.title}</h1>

        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/57dd45736e9a2f50f12f921c2e8fa01be13309c9?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
          alt="Quiz icon"
          className="quiz-icon"
        />
      </header>

      {/* Question Section - shows results if submitted */}
      {submitted ? (
        <section className="results-container">
          <h2 className="question-text">Quiz Results</h2>
          <div className="score-summary">
            <p>You scored {score} out of {filteredQuestions.length}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(score / filteredQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          {filteredQuestions.map((question) => {
            const correctAnswer = question.answers.find(ans => ans.is_correct);
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === correctAnswer?.id;
            const wasSkipped = skippedQuestions.includes(question.id);

            return (
              <article 
                key={question.id} 
                className={`result-item ${isCorrect ? 'correct' : 'incorrect'} ${wasSkipped ? 'skipped' : ''}`}
              >
                <h3>{question.text}</h3>
                {wasSkipped ? (
                  <p className="result-status">⏭️ Skipped</p>
                ) : (
                  <>
                    <p className="user-answer">
                      Your answer: <span className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                        {question.answers.find(a => a.id === userAnswer)?.text || "Not answered"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer">
                        Correct answer: <span className="correct-text">{correctAnswer?.text}</span>
                      </p>
                    )}
                  </>
                )}
                <div className="explanation">
                  {question.explanation && <p>{question.explanation}</p>}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <>
          {/* Current Question */}
          <section className="question-container">
            <h2 className="question-text">{currentQuestion.text}</h2>
            {isSkipped && <p className="skip-notice">You skipped this question</p>}
          </section>

          {/* Options Section */}
          <div className="options-list">
            {currentQuestion.answers.map((answer) => (
              <article
                key={answer.id}
                className={`option-container ${selectedAnswer === answer.id ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(answer.id)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + currentQuestion.answers.indexOf(answer))}
                </span>
                <h3 className="index-name">{answer.text}</h3>
                {selectedAnswer === answer.id && (
                  <span className="selection-indicator">✓</span>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      {/* Footer Section */}
      <footer className="quiz-footer">
        <div className="footer-content">
          <span className="step-counter">
            {submitted ? 
              `${filteredQuestions.length}/${filteredQuestions.length}` : 
              `${currentQuestionIndex + 1}/${filteredQuestions.length}`
            }
          </span>
          
          <div className="navigation-buttons">
            {!submitted && !isFirstQuestion && (
              <button 
                className="nav-button prev-button" 
                onClick={handlePrev}
              >
                Previous
              </button>
            )}
            
            {!submitted && (
              <button 
                className="nav-button skip-button" 
                onClick={handleSkip}
              >
                Skip
              </button>
            )}
            
            {!submitted && !isLastQuestion && (
              <button 
                className="nav-button next-button" 
                onClick={handleNext}
                disabled={!selectedAnswer && !isSkipped}
              >
                Next
              </button>
            )}
            
            {!submitted && isLastQuestion && (
              <button 
                className="continue-button" 
                onClick={handleSubmit}
                disabled={!selectedAnswer && !isSkipped}
              >
                Submit Quiz
              </button>
            )}
            
            {submitted && (
              <button className="continue-button">
                Finish
              </button>
            )}
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Quiz;