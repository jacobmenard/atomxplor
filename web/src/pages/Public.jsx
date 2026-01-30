import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Public = () => {
  const [showModal, setShowModal] = useState(false);
  const [activityCode, setActivityCode] = useState("");
  const [activity, setActivity] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const navigatorToQuestion = (item) => {
    navigate("/activity/question", {
      state: {activity: item}
    });
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    const fetchActivity = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/public/activity/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch Activity");
        }

        setActivity(data.data || []);
      } catch (err) {
        setMessage("Failed to load activities", err);
      }
    };

    fetchActivity();
  }, [navigate]);

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

      {message && <h5 className="text-success mb-3">{message}</h5>}

      <div className="mb-2">
        <h2 className="ms-3">Welcome Students</h2>
      </div>

      <div
        className="d-flex flex-wrap gap-3"
        style={{ marginLeft: "100px", marginRight: "50px" }}
      >
        {activity.map((item, index) => (
          <div
            key={index}
            className="border p-3 rounded-4 bg-white shadow-sm"
            style={{ width: "300px" }}
          >
            <p className="fw-bold mb-2">Example Activity</p>
            <p className="mb-2">By: {item.user?.name}</p>

            <div className="d-flex justify-content-between fw-semibold mb-3">
              <span>Total Students:</span>
              <span className="fw-bold" style={{ color: "#08CB00" }}>
                0/20
              </span>
            </div>

            <button
              className="text-white fw-bold border-0 rounded mb-3"
              style={{ backgroundColor: "#08CB00" }}
              disabled={item.activity_action}
            >
              {item.activity_action}
            </button>

            <div className="d-grid">
              <button
                className="btn btn-primary fw-bold btn-opacity-hover"
                onClick={() => navigatorToQuestion(item)}
              >
                Enter Activity
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
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
