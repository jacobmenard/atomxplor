import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ActivityQuestion = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const activity = state?.activity;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!activity) navigate("/public");
  }, [activity, navigate]);

  if (!activity) return null;

  const currentQuestion = activity.questionaires?.[currentIndex]?.question;
  const isLastQuestion = currentIndex === activity.questionaires.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

    setIsSubmitting(true);

    const payload = {
      answers: Object.entries(answers).map(([questionId, optionId]) => {
        const question = activity.questionaires.find(
          (q) => q.question.id === Number(questionId)
        );

        const selectedOption = question.question.question_items.find(
          (item) => item.id === optionId
        );

        return {
          question_id: Number(questionId),
          user_answer: selectedOption.question_choice.toLowerCase(),
        };
      }),
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activity/${activity.id}/submit-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error();

      setResult({
        score: data.score,
        total: data.total,
        percentage: data.percentage,
        answers: data.answers,
      });
    } catch {
      alert("Failed to submit answers");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="container-fluid px-5 py-4">
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <h4 className="fw-bold">Welcome Student</h4>
            <p className="mb-1 fw-semibold">
              Activity title:{" "}
              <span className="fw-normal">{activity.activity_title}</span>
            </p>
            <small className="text-muted">
              Hosted by: {activity.user?.name || "Teacher unknown"}
            </small>
          </div>

          <div className="text-end">
            <p className="mb-1 fw-semibold">Duration: 10–20 minutes</p>
            <p className="fw-semibold">
              Status: <span className="text-success">Started</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <h2 className="fw-bold mb-4">CONGRATULATIONS YOU GOT</h2>

          <h3 className="fw-bold mb-2">
            {result.score}/{result.total} Score
          </h3>

          <h3 className="fw-bold mb-4">{result.percentage}%</h3>

          <button className="btn btn-primary px-4">Review my answers</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-5 py-4">
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div>
          <h4 className="fw-bold">Welcome Student</h4>
          <p className="mb-1 fw-semibold">
            Activity title:{" "}
            <span className="fw-normal">
              {activity.activity_title || "Untitled Activity"}
            </span>
          </p>
          <small className="text-muted">
            Hosted by: {activity.user?.name || "Teacher unknown"}
          </small>
        </div>

        <div className="text-end">
          <p className="mb-1 fw-semibold">Duration: 10–20 minutes</p>
          <p className="fw-semibold">
            Status:{" "}
            <span className="text-success">{activity.activity_action}</span>
          </p>
        </div>
      </div>

      {currentQuestion && (
        <div className="mb-5">
          <h5 className="fw-bold mb-4">
            Question #{currentIndex + 1}: {currentQuestion.question}
          </h5>

          {currentQuestion.question_items.map((opt) => (
            <div key={opt.id} className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name={`question-${currentQuestion.id}`}
                checked={answers[currentQuestion.id] === opt.id}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: opt.id,
                  })
                }
              />
              <label className="form-check-label fw-semibold ms-2">
                {opt.question_choice}. {opt.question_text}
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-end">
        {!isLastQuestion ? (
          <button
            className="btn btn-primary px-4"
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id]}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-success px-4"
            onClick={handleSubmit}
            disabled={!answers[currentQuestion?.id] || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityQuestion;
