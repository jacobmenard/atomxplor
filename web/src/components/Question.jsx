import React, { useState } from "react";

const Question = () => {
  const [showModal, setShowModal] = useState(false);
  const [questionType, setQuestionType] = useState("");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2 className="fw-bold">Question List</h2>
        <button
          className="btn btn-primary px-3 py-2"
          onClick={() => setShowModal(true)}
        >
          Create new question
        </button>
      </div>

      <div className="table-responsive mt-4">
        <table className="table  text-center align-middle">
          <thead style={{ backgroundColor: "#0d6efd", color: "white" }}>
            <tr>
              <th className="bg-primary text-white">ID</th>
              <th className="bg-primary text-white">Question</th>
              <th className="bg-primary text-white">Question Type</th>
              <th className="bg-primary text-white">Status</th>
              <th className="bg-primary text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className="fw-semibold">Test question only # 1</td>
              <td>Multiple Choice</td>
              <td>Active</td>
              <td>
                <button className="btn btn-sm btn-primary me-2 px-3">
                  Update
                </button>
                <button className="btn btn-sm btn-danger px-3">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

     
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 rounded-4 p-4">
              <div className="modal-body">
                <h4 className="text-center fw-bold mb-4">
                  Create new activity
                </h4>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Question:</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Choose question type:
                  </label>
                  <div className="d-flex justify-content-between gap-2 mt-2">
                    <button
                      className={`btn flex-fill rounded-3 ${
                        questionType === "multiple"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setQuestionType("multiple")}
                    >
                      Multiple Choice
                    </button>
                    <button
                      className={`btn flex-fill rounded-3 ${
                        questionType === "drag"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setQuestionType("drag")}
                    >
                      Drag and drop
                    </button>
                    <button
                      className={`btn flex-fill rounded-3 ${
                        questionType === "matching"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setQuestionType("matching")}
                    >
                      Matching
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button className="btn btn-primary px-5 fw-bold">SAVE</button>
                  <button
                    className="btn btn-danger px-5 fw-bold"
                    onClick={() => setShowModal(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Question;
