import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Question = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [questions, setQuestions] = useState([]);

  const [choices, setChoices] = useState([
    { question_choice: "a", question_text: "" },
    { question_choice: "b", question_text: "" },
    { question_choice: "c", question_text: "" },
    { question_choice: "d", question_text: "" },
  ]);

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId || "");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
    } else {
      fetchQuestions();
    }
  }, [navigate, subjectId]);

  const fetchQuestions = async () => {
    const authToken = localStorage.getItem("authToken");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/question?subject_id=${selectedSubjectId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.data || []);
      } else {
        setMessage(data.message || "Failed to fetch questions");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error fetching questions: " + error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setQuestion("");
    setAnswer("");
    setQuestionType("multiple_choice");
    setChoices([
      { question_choice: "a", question_text: "" },
      { question_choice: "b", question_text: "" },
      { question_choice: "c", question_text: "" },
      { question_choice: "d", question_text: "" },
    ]);
    setSelectedSubjectId(subjectId || "");
    setMessage("");
    setMessageType("info");
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index].question_text = value;
    setChoices(updatedChoices);
  };

  const handleSaveQuestion = async () => {
    if (isSaving) return;

    const authToken = localStorage.getItem("authToken");

    if (!question || !answer) {
      setMessage("Question and answer are required.");
      setMessageType("error");
      return;
    }

    if (!selectedSubjectId) {
      setMessage("Subject ID is missing.");
      setMessageType("error");
      return;
    }

    if (
      questionType === "multiple_choice" &&
      choices.some((c) => c.question_text.trim() === "")
    ) {
      setMessage("All choices must be filled.");
      setMessageType("error");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          subject_id: parseInt(selectedSubjectId),
          question,
          answer,
          question_type: questionType,
          question_items: choices.map((choice) => ({
            question_choice: choice.question_choice,
            question_text: choice.question_text,
            question_image: null,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Question successfully created");
        setMessageType("success");

        setShowModal(false);
        resetModal();
        fetchQuestions();
      } else {
        throw new Error(data.message || "Failed to create question");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/question/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Question deleted successfully");
        setMessageType("success");
        fetchQuestions();
      } else {
        throw new Error(data.message || "Failed to delete question");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const getAlertClass = () => {
    switch (messageType) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-danger";
      default:
        return "alert-info";
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2 className="fw-bold">Question List</h2>
        <button
          className="btn btn-primary px-3 py-2"
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
        >
          Create new question
        </button>
      </div>

      {message && (
        <div className={`alert ${getAlertClass()} mt-3`} role="alert">
          {message}
        </div>
      )}

      <div className="table-responsive mt-4">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table text-center align-middle">
            <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
              <tr>
                <th className="bg-primary text-white">ID</th>
                <th className="bg-primary text-white">Question</th>
                <th className="bg-primary text-white">Question Type</th>
                <th className="bg-primary text-white">Subject</th>
                <th className="bg-primary text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No questions found. Create your first question!
                  </td>
                </tr>
              ) : (
                questions.map((q, index) => (
                  <tr key={q.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold text-start">{q.question}</td>
                    <td className="text-capitalize">{q.question_type}</td>
                    <td className="text-capitalize">{q.subject}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2 px-3">
                        Update
                      </button>
                      <button
                        className="btn btn-sm btn-danger px-3"
                        onClick={() => handleDeleteQuestion(q.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 p-4">
              <h4 className="text-center fw-bold mb-4">New question</h4>

              {message && messageType === "error" && (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Question:</label>
                <input
                  className="form-control"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your question"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Subject:</label>
                <select
                  className="form-select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  <option value="1">Science</option>
                  <option value="2">Math</option>
                  <option value="3">History</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Choose question type:</label>
                <div className="d-flex gap-2">
                  {[
                    { value: "multiple_choice", label: "Multiple Choice" },
                    { value: "drag_and_drop", label: "Drag and drop" },
                    { value: "matching", label: "Matching" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      className={`btn flex-fill ${
                        questionType === type.value
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setQuestionType(type.value)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Correct Answer</label>
                <input
                  className="form-control"
                  style={{ maxWidth: "150px" }}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g., a, b, c, d"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Choices</label>
                {choices.map((choice, index) => (
                  <div
                    key={choice.question_choice}
                    className="d-flex gap-2 mb-2"
                  >
                    <input
                      className="form-control text-center"
                      style={{ maxWidth: "60px" }}
                      value={choice.question_choice}
                      disabled
                    />
                    <input
                      className="form-control"
                      value={choice.question_text}
                      onChange={(e) =>
                        handleChoiceChange(index, e.target.value)
                      }
                      placeholder={`Enter choice ${choice.question_choice}`}
                    />
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-primary px-5 py-2 text-uppercase fw-bold"
                  onClick={handleSaveQuestion}
                  disabled={isSaving}
                >
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
                <button
                  className="btn btn-danger px-5 py-2 text-uppercase fw-bold"
                  onClick={() => {
                    setShowModal(false);
                    resetModal();
                  }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
