import React from "react";

const Public = () => {
  return (
    <div className="">
      <div className="d-flex justify-content-end mt-3 me-3 sticky-top">
        <button className="btn btn-primary">Search Activity</button>
      </div>
      <div className="mb-2">
        <h2 className="ms-3">Welcome Students</h2>
      </div>
      <div className="d-flex flex-wrap gap-3" style={{marginLeft: "100px", marginRight:"50px"}}>
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="border p-3 rounded-4 bg-white shadow-sm"
            style={{width: "300px"}}
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
    </div>
  );
};

export default Public;
