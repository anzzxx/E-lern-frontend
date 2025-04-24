import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Redux/api";
import "../styles/test.css";
import Message from "../components/Message";

const Test = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quizName, setQuizName] = useState("");
    const [message,setMessage] = useState({});
    const [ismessage,setIsMessage]=useState(false);
    const [questions, setQuestions] = useState([
        { id: Date.now(), question: "", answers: ["", ""], correctAnswerIndex: null },
    ]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const courseId = parseInt(id, 10);
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
            // If we're removing the correct answer, reset correctAnswerIndex
            if (updatedQuestions[qIndex].correctAnswerIndex === aIndex) {
                updatedQuestions[qIndex].correctAnswerIndex = null;
            }
            // If we're removing an answer before the correct answer, adjust the index
            else if (updatedQuestions[qIndex].correctAnswerIndex > aIndex) {
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
    
            // Check for empty answers and minimum length
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
            // 1. Create the test
            const testResponse = await api.post(`mcq/test/create/`, {
                course: courseId,
                title: quizName,
            });
           
            
            // 2. Create questions and answers
            const questionPromises = questions.map(async (q) => {
                const questionResponse = await api.post("mcq/question/create/", {
                    test: testResponse.data.id,
                    text: q.question,
                });
            console.log("Question Response:", questionResponse.data);
            
                // Create answers for this question
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
                navigate(`/instructor/course/${courseId}`);
            }, 3000);
            
            
        } catch (error) {

            setSubmitError("Failed to create quiz. Please try again.");
            setIsMessage(true);
            setMessage({type:"error",message:"Failed to create quiz. Please try again."});
            setTimeout(() => {
                setIsMessage(false);
                setMessage({});
                navigate(`/instructor/course/${courseId}`);
            }, 3000);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="appn">
            <header className="header">
                <h1>Create New Quiz</h1>
            </header>

            <div className="form-group">
                <label>Quiz Name</label>
                <input
                    type="text"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Enter your quiz name"
                    required
                    disabled={isSubmitting}
                />
                {errors.quizName && <p className="error">{errors.quizName}</p>}
            </div>

            {questions.map((q, qIndex) => (
                <div key={q.id} className="create-quiz">
                    <div className="form-group">
                        <label>Question {qIndex + 1}</label>
                        <input
                            type="text"
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                            placeholder="Enter your question"
                            required
                            disabled={isSubmitting}
                        />
                        {errors[`question_${qIndex}`] && (
                            <p className="error">{errors[`question_${qIndex}`]}</p>
                        )}
                        {questions.length > 1 && (
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => handleRemoveQuestion(qIndex)}
                                disabled={isSubmitting}
                            >
                                ❌ Remove Question
                            </button>
                        )}
                    </div>

                    {q.answers.map((answer, aIndex) => (
                        <div className="form-group answer-group" key={aIndex}>
                            <label>
                                <input
                                    type="radio"
                                    name={`correctAnswer-${qIndex}`}
                                    checked={q.correctAnswerIndex === aIndex}
                                    onChange={() => handleCorrectAnswerChange(qIndex, aIndex)}
                                    disabled={isSubmitting || !answer.trim()}
                                />
                                Answer {aIndex + 1}
                            </label>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                placeholder="Enter answer"
                                required
                                disabled={isSubmitting}
                            />
                            {errors[`answer_${qIndex}_${aIndex}`] && (
                                <p className="error">{errors[`answer_${qIndex}_${aIndex}`]}</p>
                            )}
                            {q.answers.length > 2 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => handleRemoveAnswerField(qIndex, aIndex)}
                                    disabled={isSubmitting}
                                >
                                    ❌
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => handleAddAnswerField(qIndex)}
                        disabled={q.answers.length >= 4 || isSubmitting}
                    >
                        {q.answers.length >= 4 ? "Max Answers Reached" : "Add Answer"}
                    </button>

                    {errors[`correct_${qIndex}`] && (
                        <p className="error">{errors[`correct_${qIndex}`]}</p>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddQuestion}
                disabled={isSubmitting}
            >
                Add New Question
            </button>

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>

            {submitError && <p className="error">{submitError}</p>}

            {ismessage && <Message type={message.type} message={message.message} />}
        </div>
    );
};

export default Test;