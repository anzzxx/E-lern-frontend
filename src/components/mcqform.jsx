import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuestions } from "../Redux/Slices/QustionSlice";
import { fetchTests } from "../Redux/Slices/TestSlice";

const MCQTest = ({ testID, courseId }) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Selectors for Redux state
  const tests = useSelector((state) => state.tests.data) || [];
  const questions = useSelector((state) => state.questions.data) || [];
  const selectedTest = tests.find((test) => test.id === parseInt(testID, 10));

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      // await dispatch(fetchTests(parseInt(courseId, 10)));
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

  // Handle answer selection
  const handleAnswerChange = (questionId, answerText) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerText }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  
  const instructions = `
    Welcome to the quiz! Please read the following instructions carefully:
    1. Each question has multiple answer options, but only one is correct.
    2. Select the correct answer by clicking the radio button next to your choice.
    3. You can change your answer before submitting by selecting a different option.
    4. Once you are ready, click the "Submit" button to see your results.
    5. After submission, you will see whether each answer was correct or incorrect, along with the correct answer if you got it wrong.
    Good luck!
  `;

  return (
    <Container className="mt-5">
      <h2 className="text-center">{selectedTest?.title || "Loading..."}</h2>
      <Card className="mb-4 p-3">
        <h5>Instructions:</h5>
        <p style={{ whiteSpace: "pre-line" }}>{instructions}</p>
      </Card>

      <Form onSubmit={handleSubmit}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <Card className="mb-3" key={question.id}>
              <Card.Body>
                <Card.Title>{question.text}</Card.Title>
                {question.answers.map((answer) => (
                  <Form.Check
                    key={answer.id}
                    type="radio"
                    name={`question-${question.id}`}
                    label={answer.text}
                    value={answer.text}
                    checked={answers[question.id] === answer.text}
                    onChange={() => handleAnswerChange(question.id, answer.text)}
                    disabled={submitted}
                  />
                ))}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No questions available for this test.</p>
        )}

        {filteredQuestions.length > 0 && !submitted && (
          <div className="text-center">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        )}
      </Form>

      {submitted && filteredQuestions.length > 0 && (
        <Card className="mt-4 p-3">
          <h4>Results:</h4>
          {filteredQuestions.map((question) => {
            const correctAnswer = question.answers.find((ans) => ans.is_correct)?.text;
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === correctAnswer;

            return (
              <p key={question.id}>
                {question.text} <br />
                <strong>Your Answer:</strong> {userAnswer || "Not Answered"} <br />
                {isCorrect ? (
                  <span className="text-success">✅ Correct</span>
                ) : (
                  <span className="text-danger">
                    ❌ Incorrect (Correct Answer: {correctAnswer})
                  </span>
                )}
              </p>
            );
          })}
        </Card>
      )}
    </Container>
  );
};

export default MCQTest;