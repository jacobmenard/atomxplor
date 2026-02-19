import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [showModalStart, setShowModalStart] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [activity, setActivity] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [items, setItems] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    const fetchActivity = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/activity", {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error();

        setActivity(data.data);
      } catch {
        setError("Failed to load activities");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/subject", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error();

        setSubjects(data.data || []);
        if (data.data?.length) setSubject(data.data[0].id);
      } catch {
        setError("Failed to load subjects");
      }
    };

    fetchActivity();
    fetchSubjects();
  }, [navigate]);

  const createActivity = async (e) => {
    e.preventDefault();

    if (!title || !items || !startTime || !endTime) {
      setError("All fields are required.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("Ending time must be after starting time.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    const userID = localStorage.getItem("id");

    if (!authToken || !userID) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_id: Number(userID),
          activity_title: title,
          items: Number(items),
          time_started: startTime,
          time_ended: endTime,
          activity_action: "not_start",
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create activity");

      setMessage("Activity created successfully");
      setActivityModal(false);
      setTitle("");
      setItems("");
      setStartTime("");
      setEndTime("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Activity List</h2>
        <button
          className="btn btn-primary"
          onClick={() => setActivityModal(true)}
        >
          New Activity
        </button>
      </div>

      {activityModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold text-center mb-4">Create new activity</h5>

              <form onSubmit={createActivity}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Activity title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Science 2nd quarter exam."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject:</label>
                  <select
                    className="form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subj) => (
                      <option key={subj.id} value={subj.id}>
                        {subj.subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Number of items:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="20"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                  />
                </div>

                <div className="row mb-4">
                  <div className="col">
                    <label className="form-label fw-semibold">
                      Starting time:
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <label className="form-label fw-semibold">
                      Ending time:
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-primary px-4" type="submit">
                    SAVE
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={() => setActivityModal(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        activity.map((act) => (
          <div
            key={act.id}
            className="d-flex justify-content-between align-items-center border rounded-4 p-3 mt-3 bg-white shadow-sm flex-wrap text-center"
            onClick={() => {
              navigate("/dashboard/participants", {
                state: { activityId: act.id },
              });
            }}
            style={{ cursor: "pointer" }}
          >
            <p className="fw-bold mb-0 flex-fill">
              {act.activity_title || "Untitled"}
            </p>
            <p className="mb-0 flex-fill">
              {act.score || 0}/{act.total_score || 20}
            </p>
            <p className="mb-0 flex-fill">{act.time_started}</p>
            <p className="mb-0 flex-fill">{act.time_ended}</p>
            <button
              className="bg-white border-0 fw-bold"
              style={{ color: "#08CB00" }}
              onClick={() => setShowModalStart(true)}
            >
              {act.activity_action.toUpperCase()}
            </button>
          </div>
        ))
      )}

      {showModalStart && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <h5 className="fw-bold mb-2">Message alert!</h5>
              <p className="mb-4">Do you want to start the activity?</p>
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-primary">Yes, start now</button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowModalStart(false)}
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
