import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ActivityQuestion = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const activityId = state?.activityId;
  const studentToken = localStorage.getItem("studentToken");
  const studentId = localStorage.getItem("student_id");

  const [activity, setActivity] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!activityId || !studentToken) {
      navigate("/public");
      return;
    }

    const fetchActivity = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/activity/get-object/${activityId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${studentToken}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setActivity(data.data);
      } catch {
        navigate("/public");
      }
    };

    fetchActivity();
  }, [activityId, studentToken, navigate]);

  const currentQuestion = activity?.questionaires?.[currentIndex]?.question;
  const isLastQuestion = currentIndex === activity?.questionaires?.length - 1;

  const handleSubmit = async () => {
    if (!activity?.questionaires || !studentId) return;

    setIsSubmitting(true);

    const payload = {
      answers: activity.questionaires.map((q) => {
        const questionId = q.question.id;

        return {
          question_id: questionId,
          correct_answer: String(q.question.answer || "")
            .trim()
            .toLowerCase(),
          user_answer: String(answers[questionId] || "")
            .trim()
            .toLowerCase(),
        };
      }),
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/public/activity/${activityId}/submit-answer?student_id=${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setResult(data.data);
      setIsFinished(true);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-5 py-4 activity-wrapper">
      <div className="d-flex justify-content-between align-items-start mb-5">
        <div>
          <h4 className="fw-bold mb-1">Welcome Student</h4>
          <p className="mb-0 fw-semibold">Activity title: {activity?.title}</p>
          <small className="text-muted">
            Hosted by: {activity?.user?.name || "Teacher unknown"}
          </small>
        </div>

        <div className="text-end">
          <p className="mb-1 fw-semibold">
            Duration: {activity?.activity_duration || "10–20 minutes"}
          </p>
          <p className="mb-0 fw-semibold">
            Status:{" "}
            <span className="text-success">{activity?.activity_action}</span>
          </p>
        </div>
      </div>

      {isFinished && result && (
        <div className="text-center mt-5">
          <h1 className="fw-bold mb-4">CONGRATULATIONS YOU GOT</h1>

          <h2 className="fw-bold">
            {result.correct}/{result.total} Score
          </h2>

          <h3 className="fw-semibold text-muted mb-4">
            {Math.round((result.correct / result.total) * 100)}%
          </h3>

          <button
            className="btn btn-primary px-5"
            onClick={() => navigate("/public")}
          >
            Go to activity list
          </button>
        </div>
      )}

      {!isFinished && currentQuestion && (
        <div className="question-card mb-5">
          <h5 className="fw-bold mb-4">
            Question #{currentIndex + 1}: {currentQuestion.question}
          </h5>

          {currentQuestion.question_items.map((opt) => (
            <div key={opt.id} className="form-check option-item mb-3">
              <input
                className="form-check-input"
                type="radio"
                name={`question-${currentQuestion.id}`}
                checked={
                  answers[currentQuestion.id]?.toLowerCase() ===
                  opt.question_choice?.toLowerCase()
                }
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [currentQuestion.id]: opt.question_choice.toLowerCase(),
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

      {!isFinished && (
        <div className="d-flex justify-content-between mt-5">
          <button
            className="btn btn-primary px-4"
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              className="btn btn-primary px-4"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!answers[currentQuestion?.id]}
            >
              Next
            </button>
          ) : (
            <button
              className="btn btn-primary px-4"
              onClick={handleSubmit}
              disabled={!answers[currentQuestion?.id] || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityQuestion;
