import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ActivityQuestion = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const activity = state?.activity;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!activity) {
      navigate("/public");
    }
  }, [activity, navigate]);

  if (!activity) return null;

  const currentQuestion = activity.questionaires?.[currentIndex]?.question;

  const handleNext = () => {
    if (currentIndex < activity.questionaires.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

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
        <button
          className="btn btn-primary px-4"
          onClick={handleNext}
          disabled={!answers[currentQuestion?.id]}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityQuestion;
