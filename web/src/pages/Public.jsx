import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Public = () => {
  const [showModal, setShowModal] = useState(false);
  const [activity, setActivity] = useState([]);
  const [message, setMessage] = useState("");
  const [checkAnswerModal, setCheckAnswerModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentLoginModal, setStudentLoginModal] = useState(false);

  const [password, setPassword] = useState("");
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
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const data = await response.json();
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
      const response = await fetch("http://127.0.0.1:8000/api/login-using-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          student_id_number: studentId,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem("studentToken", data.token);
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
    if (!authToken) return navigate("/");

    setIsLoading(true);
    setCheckAnswerModal(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activity/${item.id}/check-already-answered`,
        {
          headers: {
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
          state: { activityId: item.id }, // ✅ PASS ID HERE
        });
      }, 4000);
    } catch {
      setMessage("Failed to enter activity");
    }
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
          <div className="text-center py-5">
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

      {studentLoginModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow"
            style={{ width: "420px" }}
          >
            <h5 className="text-center fw-bold mb-3">Student ID</h5>

            <input
              type="text"
              className="form-control text-center mb-4"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <h6 className="text-center fw-bold mb-2">Password</h6>

            <input
              type="password"
              className="form-control text-center mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h5 className="fw-bold mb-2 text-primary">Message alert!</h5>
              {isLoading ? (
                <div className="spinner-border text-primary" />
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
