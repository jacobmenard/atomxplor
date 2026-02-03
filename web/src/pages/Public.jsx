import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";

const Public = () => {
  const [showModal, setShowModal] = useState(false);
  const [activityCode, setActivityCode] = useState("");
  const [activity, setActivity] = useState([]);
  const [message, setMessage] = useState("");
  const [checkAnswerModal, setCheckAnswerModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentLoginModal, setStudentLoginModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");

  const navigate = useNavigate();

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
        if (!response.ok) throw new Error();

        setActivity(data.data || []);
      } catch {
        setMessage("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [navigate]);

  const studentSignIn = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/student-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            full_name: fullName,
            student_id_number: studentId,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setStudentLoginModal(false);
      navigatorToQuestion(selectedActivity);
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const navigatorToQuestion = async (item) => {
    const authToken = localStorage.getItem("authToken");

    setSelectedActivity(item);
    setIsLoading(true);
    setCheckAnswerModal(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activity/${item.id}/check-already-answered`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      setTimeout(() => {
        setMessage(data.message);
        setIsLoading(false);
      }, 2000);

      setTimeout(() => {
        navigate("/activity/question", {
          state: { activity: item },
        });
      }, 4000);
    } catch {
      setTimeout(() => {
        setMessage("Something went wrong");
        setIsLoading(false);
      }, 3000);
    }
  };

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
        {isLoading ? (
          <div className="w-100 text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          activity.map((item, index) => (
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
                  className="btn btn-primary fw-bold"
                  onClick={() => {
                    setSelectedActivity(item);
                    setStudentLoginModal(true);
                  }}
                >
                  Enter Activity
                </button>
              </div>
            </div>
          ))
        )}
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

      {studentLoginModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow"
            style={{ width: "420px" }}
          >
            <h5 className="text-center fw-bold mb-3">Enter Full name</h5>

            <input
              type="text"
              className="form-control text-center mb-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <h6 className="text-center fw-bold mb-2">Student ID</h6>

            <input
              type="text"
              className="form-control text-center mb-4"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-primary px-4"
                onClick={studentSignIn}
                disabled={isLoading}
              >
                Enter
              </button>

              <button
                className="btn btn-danger px-4"
                onClick={() => setStudentLoginModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {checkAnswerModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h5 className="fw-bold mb-2 text-primary">Message alert!</h5>
              {isLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-4">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  />
                </div>
              ) : (
                <p className="mb-0">{message}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Public;
