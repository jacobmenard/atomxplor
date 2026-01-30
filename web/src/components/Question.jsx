import React, { useEffect, useState, useCallback } from "react";
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

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjectId || "");

  const [choices, setChoices] = useState([
    { question_choice: "a", question_text: "" },
    { question_choice: "b", question_text: "" },
    { question_choice: "c", question_text: "" },
    { question_choice: "d", question_text: "" },
  ]);

  const fetchSubjects = useCallback(async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/subject", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to load subjects");

      const subjectList = data.data || [];
      setSubjects(subjectList);

      if (!selectedSubjectId && subjectList.length) {
        setSelectedSubjectId(String(subjectList[0].id));
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }
    fetchSubjects();
  }, [navigate, fetchSubjects]);

  const fetchQuestions = useCallback(async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/question", {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch questions");

      setQuestions(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      fetchQuestions();
    }
  }, [selectedSubjectId, fetchQuestions]);

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
    setMessage("");
    setMessageType("info");
  };

  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index].question_text = value;
    setChoices(updated);
  };

  const handleSaveQuestion = async () => {
    if (isSaving) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }

    if (!question || !selectedSubjectId) {
      setMessage("Question and subject are required.");
      setMessageType("error");
      return;
    }

    if (questionType === "multiple_choice") {
      if (!answer) {
        setMessage("Answer is required for multiple choice.");
        setMessageType("error");
        return;
      }

      if (!["a", "b", "c", "d"].includes(answer.trim().toLowerCase())) {
        setMessage("Answer must be a, b, c, or d.");
        setMessageType("error");
        return;
      }

      if (choices.some((c) => !c.question_text.trim())) {
        setMessage("All choices must be filled.");
        setMessageType("error");
        return;
      }
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
          subject_id: Number(selectedSubjectId),
          question,
          answer: questionType === "multiple_choice" ? answer : null,
          question_type: questionType,
          question_items:
            questionType === "multiple_choice"
              ? choices.map((c) => ({
                  question_choice: c.question_choice,
                  question_text: c.question_text,
                  question_image: null,
                }))
              : [],
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create question");

      setMessage(data.message || "Question successfully created");
      setMessageType("success");

      setShowModal(false);
      resetModal();
      fetchQuestions();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/question/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete question");

      setMessage(data.message || "Question deleted successfully");
      setMessageType("success");
      fetchQuestions();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const getAlertClass = () => {
    if (messageType === "success") return "alert-success";
    if (messageType === "error") return "alert-danger";
    return "alert-info";
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2 className="fw-bold">Question List</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
        >
          Create new question
        </button>
      </div>

      {message && (
        <div className={`alert ${getAlertClass()} mt-3`}>{message}</div>
      )}

      <div className="table-responsive mt-4">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <table className="table text-center align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th className="bg-primary text-white">ID</th>
                <th className="bg-primary text-white">Question</th>
                <th className="bg-primary text-white">Type</th>
                <th className="bg-primary text-white">Subject</th>
                <th className="bg-primary text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="5">No questions found</td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.subject?.id}</td>
                    <td>{q.question}</td>
                    <td>{q.subject?.question_type}</td>
                    <td>{q.subject?.subject}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
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
            <div className="modal-content p-4 rounded-4 border-0">
              <h4 className="text-center fw-bold mb-4">New question</h4>

              <div className="mb-3">
                <label className="form-label fw-semibold">Question:</label>
                <input
                  className="form-control"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Subject:</label>
                <select
                  className="form-select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Choose question type:
                </label>
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

              {questionType === "multiple_choice" && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Correct Answer
                    </label>
                    <input
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="d"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Choices</label>
                    {choices.map((choice, index) => (
                      <div
                        key={choice.question_choice}
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <input
                          className="form-control text-center"
                          style={{ width: "50px" }}
                          value={choice.question_choice}
                          disabled
                        />
                        <input
                          className="form-control"
                          value={choice.question_text}
                          onChange={(e) =>
                            handleChoiceChange(index, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="d-flex justify-content-center gap-3 mt-4">
                <button
                  className="btn btn-primary px-5 py-2 fw-bold"
                  onClick={handleSaveQuestion}
                  disabled={isSaving}
                >
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>

                <button
                  className="btn btn-danger px-5 py-2 fw-bold"
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
