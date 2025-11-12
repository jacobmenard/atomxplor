import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Activities = () => {
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
        <p className="fw-bold mb-0 flex-fill" style={{color: "#08CB00"}}>Started</p>
      </div>
    </div>
  );
};

export default Activities;
