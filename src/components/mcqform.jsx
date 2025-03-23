import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnswers } from "../Redux/Slices/AnswerSlice";
import { fetchQuestions } from "../Redux/Slices/QustionSlice";
import { fetchTests } from "../Redux/Slices/TestSlice";

const MCQTest = ({testID}) => {
  const dispatch = useDispatch();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const option = useSelector((state) => state.answers.data) || [];
  const questions = useSelector((state) => state.questions.data) || [];
  const tests = useSelector((state) => state.tests.data) || [];
 
  
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchQuestions());
    dispatch(fetchAnswers());
  }, [dispatch]);

  // Filter tests based on selected courseID

  
  console.log(tests);
  
  const selectedTest = tests.find(test => test.id ===parseInt(testID, 10));
  
  // Filter questions that belong to the filtered tests
  const filteredQuestions = questions.filter((question) => question.test === parseInt(testID, 10));
  const filterdQustionIds=filteredQuestions.map((qus)=>qus.id)

  const filterdOptions=option.filter((option)=>
  filterdQustionIds.includes(option.question))

  const options = filterdOptions

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

return (
  <Container className="mt-5">
     <h2 className="text-center">{selectedTest.title}</h2>
      <Card className="mb-4 p-3">
        <h5>Instructions:</h5>
        <p>{selectedTest.description}</p>
      </Card>
    <Form onSubmit={handleSubmit}>
      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <Card className="mb-3" key={question.id}>
            <Card.Body>
              <Card.Title>{question.text}</Card.Title>
              {options
                .filter((opt) => opt.question === question.id)
                .map((option, index) => (
                  <Form.Check
                    key={index}
                    type="radio"
                    name={`question-${question.id}`}
                    label={option.text}
                    value={option.text}
                    checked={answers[question.id] === option.text}
                    onChange={() => handleAnswerChange(question.id, option.text)}
                  />
                ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No questions available for this test.</p>
      )}

      {filteredQuestions.length > 0 && (
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
        {filteredQuestions.map((question) => (
          <p key={question.id}>
            {question.text} <br />
            <strong>Your Answer:</strong> {answers[question.id] || "Not Answered"} <br />
            {options.find(
              (opt) => opt.question === question.id && opt.text === answers[question.id]
            )?.is_correct ? (
              <span className="text-success">✅ Correct</span>
            ) : (
              <span className="text-danger">
                ❌ Incorrect (Correct Answer: {
                  options.find((opt) => opt.question === question.id && opt.is_correct)?.text
                })
              </span>
            )}
          </p>
        ))}
      </Card>
    )}
  </Container>
);
};

export default MCQTest;
