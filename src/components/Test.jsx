import React, { useState } from "react";
import api from "../Redux/api";
import Message from "../components/Message";

import styles from "../styles/TestModal.module.css";

const TestModal = ({ courseId, onClose, onSuccess }) => {
    const [quizName, setQuizName] = useState("");
    const [message, setMessage] = useState({});
    const [ismessage, setIsMessage] = useState(false);
    const [questions, setQuestions] = useState([
        { id: Date.now(), question: "", answers: ["", ""], correctAnswerIndex: null },
    ]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), question: "", answers: ["", ""], correctAnswerIndex: null },
        ]);
    };

    const handleRemoveQuestion = (qIndex) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, index) => index !== qIndex));
        }
    };

    const handleQuestionChange = (qIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].question = value;
        setQuestions(updatedQuestions);
    };

    const handleAddAnswerField = (qIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].answers.length < 4) {
            updatedQuestions[qIndex].answers.push("");
            setQuestions(updatedQuestions);
        }
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers[aIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleRemoveAnswerField = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].answers.length > 2) {
            if (updatedQuestions[qIndex].correctAnswerIndex === aIndex) {
                updatedQuestions[qIndex].correctAnswerIndex = null;
            } else if (updatedQuestions[qIndex].correctAnswerIndex > aIndex) {
                updatedQuestions[qIndex].correctAnswerIndex -= 1;
            }
            updatedQuestions[qIndex].answers.splice(aIndex, 1);
            setQuestions(updatedQuestions);
        }
    };

    const handleCorrectAnswerChange = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].correctAnswerIndex = aIndex;
        setQuestions(updatedQuestions);
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
    
        if (!quizName.trim()) {
            newErrors.quizName = "Quiz name is required";
            isValid = false;
        }
    
        questions.forEach((q, qIndex) => {
            if (!q.question.trim()) {
                newErrors[`question_${qIndex}`] = "Question is required";
                isValid = false;
            } else if (q.question.trim().length < 10) {
                newErrors[`question_${qIndex}`] = "Question must be at least 10 characters long";
                isValid = false;
            }
    
            q.answers.forEach((answer, aIndex) => {
                if (!answer.trim()) {
                    newErrors[`answer_${qIndex}_${aIndex}`] = "Answer cannot be empty";
                    isValid = false;
                } else if (answer.trim().length < 3) {
                    newErrors[`answer_${qIndex}_${aIndex}`] = "Answer must be at least 3 characters long";
                    isValid = false;
                }
            });
    
            if (q.answers.length < 2) {
                newErrors[`question_${qIndex}`] = "Each question must have at least 2 answers";
                isValid = false;
            }
    
            if (q.correctAnswerIndex === null) {
                newErrors[`correct_${qIndex}`] = "Please select a correct answer";
                isValid = false;
            }
        });
    
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        setSubmitError("");
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const testResponse = await api.post(`mcq/test/create/`, {
                course: courseId,
                title: quizName,
            });
            
            const questionPromises = questions.map(async (q) => {
                const questionResponse = await api.post("mcq/question/create/", {
                    test: testResponse.data.id,
                    text: q.question,
                });
            
                const answerPromises = q.answers.map((answer, aIndex) => 
                    api.post("mcq/answer/create/", {
                        question: questionResponse.data.id,
                        text: answer,
                        is_correct: aIndex === q.correctAnswerIndex, 
                    })
                );

                await Promise.all(answerPromises);
            });

            await Promise.all(questionPromises);
            setIsMessage(true);
            setMessage({type:"success",message:"Quiz created successfully"});
            setTimeout(() => {
                setIsMessage(false);
                setMessage({});
                onSuccess();
                onClose();
            }, 3000);
            
        } catch (error) {
            setSubmitError("Failed to create quiz. Please try again.");
            setIsMessage(true);
            setMessage({type:"error",message:"Failed to create quiz. Please try again."});
            setTimeout(() => {
                setIsMessage(false);
                setMessage({});
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create New Quiz</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className={styles.formGroup}>
                    <label>Quiz Name</label>
                    <input
                        type="text"
                        className={styles.inputField}
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        placeholder="Enter your quiz name"
                        required
                        disabled={isSubmitting}
                    />
                    {errors.quizName && <p className={styles.errorText}>{errors.quizName}</p>}
                </div>

                {questions.map((q, qIndex) => (
                    <div key={q.id} className={styles.quizCard}>
                        <div className={styles.formGroup}>
                            <label>Question {qIndex + 1}</label>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                placeholder="Enter your question"
                                required
                                disabled={isSubmitting}
                            />
                            {errors[`question_${qIndex}`] && (
                                <p className={styles.errorText}>{errors[`question_${qIndex}`]}</p>
                            )}
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    className={`${styles.button} ${styles.dangerButton}`}
                                    onClick={() => handleRemoveQuestion(qIndex)}
                                    disabled={isSubmitting}
                                >
                                    Remove Question
                                </button>
                            )}
                        </div>

                        {q.answers.map((answer, aIndex) => (
                            <div className={styles.answerGroup} key={aIndex}>
                                <label>
                                    <input
                                        type="radio"
                                        className={styles.radioInput}
                                        name={`correctAnswer-${qIndex}`}
                                        checked={q.correctAnswerIndex === aIndex}
                                        onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                                        disabled={isSubmitting || !answer.trim()}
                                    />
                                    Answer {aIndex + 1}
                                </label>
                                <input
                                    type="text"
                                    className={`${styles.inputField} ${styles.answerInput}`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                    placeholder="Enter answer"
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors[`answer_${qIndex}_${aIndex}`] && (
                                    <p className={styles.errorText}>{errors[`answer_${qIndex}_${aIndex}`]}</p>
                                )}
                                {q.answers.length > 2 && (
                                    <button
                                        type="button"
                                        className={`${styles.button} ${styles.dangerButton}`}
                                        onClick={() => handleRemoveAnswerField(qIndex, aIndex)}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className={styles.actionsContainer}>
                            <button
                                type="button"
                                className={`${styles.button} ${styles.secondaryButton} ${styles.addAnswerButton}`}
                                onClick={() => handleAddAnswerField(qIndex)}
                                disabled={q.answers.length >= 4 || isSubmitting}
                            >
                                {q.answers.length >= 4 ? "Max Answers Reached" : "+ Add Answer"}
                            </button>
                        </div>

                        {errors[`correct_${qIndex}`] && (
                            <p className={styles.errorText}>{errors[`correct_${qIndex}`]}</p>
                        )}
                    </div>
                ))}

                <div className={styles.actionsContainer}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.primaryButton}`}
                        onClick={handleAddQuestion}
                        disabled={isSubmitting}
                    >
                        + Add New Question
                    </button>
                </div>

                <button
                    type="button"
                    className={`${styles.button} ${styles.submitButton}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>

                {submitError && <p className={styles.errorText}>{submitError}</p>}
                {ismessage && <Message type={message.type} message={message.message} />}
            </div>
        </div>
    );
};

export default TestModal;