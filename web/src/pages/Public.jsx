import React, { useState } from "react";

const Public = () => {
  const [showModal, setShowModal] = useState(false);
  const [activityCode, setActivityCode] = useState("");

  const handleSearch = () => {
    console.log("Searching:", activityCode);
  };

  return (
    <div className="">
      <div className="d-flex justify-content-end mt-3 me-3 sticky-top">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Search Activity
        </button>
      </div>

      <div className="mb-2">
        <h2 className="ms-3">Welcome Students</h2>
      </div>

      <div
        className="d-flex flex-wrap gap-3"
        style={{ marginLeft: "100px", marginRight: "50px" }}
      >
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="border p-3 rounded-4 bg-white shadow-sm"
            style={{ width: "300px" }}
          >
            <p className="fw-bold mb-2">Grade 1 Science Test</p>
            <p className="mb-2">By: Teacher Menard</p>
            <div className="d-flex justify-content-between fw-semibold mb-3">
              <span>Total Students:</span>
              <span className="fw-bold" style={{ color: "#08CB00" }}>
                17/20
              </span>
            </div>
            <button
              className="text-white fw-bold border-0 rounded mb-3"
              style={{ backgroundColor: "#08CB00" }}
              disabled
            >
              Started
            </button>
            <div className="d-grid">
              <button className="btn btn-primary fw-bold btn-opacity-hover">
                Enter Activity
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        >
          <div className="bg-white rounded-4 p-4" style={{ width: "400px" }}>
            <h5 className="text-center fw-bold mb-3">Enter Activity code</h5>

            <input
              type="text"
              className="form-control text-center fs-5 py-2"
              placeholder="Enter code"
              value={activityCode}
              onChange={(e) => setActivityCode(e.target.value)}
            />

            <div className="d-flex justify-content-center mt-4 gap-2">
              <button
                className="btn text-white px-4"
                style={{ backgroundColor: "#007bff" }}
                onClick={handleSearch}
              >
                Search
              </button>

              <button
                className="btn text-white px-4"
                style={{ backgroundColor: "#ff3b3b" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Public;
