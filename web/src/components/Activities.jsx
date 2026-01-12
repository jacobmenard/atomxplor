import React, { useState } from "react";

const Activities = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Activity List</h2>
        <button className="btn btn-primary">New Activity</button>
      </div>

      <div className="d-flex justify-content-between align-items-center border rounded-4 p-3 mt-3 bg-white shadow-sm flex-wrap text-center">
        <p className="fw-bold mb-0 flex-fill">Grade 1 Science Test</p>
        <p className="mb-0 flex-fill">15/20</p>
        <p className="mb-0 flex-fill">11/05/25 9:00 AM</p>
        <p className="mb-0 flex-fill">11/05/25 11:30 AM</p>
        <button
          className="bg-white border-0 fw-bold"
          style={{ color: "#08CB00" }}
          onClick={() => setShowModal(true)}
        >
          Started
        </button>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <div className="mb-3">
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                    borderRadius: "50%",
                    backgroundColor: "#2196F3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontSize: "30px" }}>i</span>
                </div>
              </div>
              <h5 className="fw-bold mb-2">Message alert!</h5>
              <p className="mb-4">Do you want to start the activity?</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-primary">Yes, start now</button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  No, not yet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
