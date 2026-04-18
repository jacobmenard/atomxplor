import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [activityModal, setActivityModal] = useState(false);
  const [activity, setActivity] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [items, setItems] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }

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

    fetchSubjects();
  }, [navigate]);

  const fetchActivity = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/activity", {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setActivity(data.data || []);
    } catch {
      setError("Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const searchActivity = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activity?search=${search}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error();
      setActivity(data.data || []);
    } catch {
      setError("Failed to search activities");
    }
  };

  useEffect(() => {
    if (search === "") {
      fetchActivity();
    }
  }, [search]);

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
          subject_id: Number(subject),
          title: title,
          items: Number(items),
          time_started: startTime,
          time_ended: endTime,
          activity_action: "not_start",
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create activity");

      setActivityModal(false);
      setTitle("");
      setItems("");
      setStartTime("");
      setEndTime("");
      setError("");
      fetchActivity();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger">
          <p className="mb-0">{error}</p>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center p-2 pe-0">
        <h2 className="m-0">Activity List</h2>
        <button
          className="btn btn-primary"
          onClick={() => setActivityModal(true)}
        >
          New Activity
        </button>
      </div>

      <div className="d-flex justify-content-end align-items-center mb-3">
        <input
          type="text"
          placeholder="Search activity..."
          className="form-control me-1"
          style={{ width: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={searchActivity}>
          Search
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
                    type="button"
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
        <div className="table-responsive mt-3">
          <table className="table table-bordered align-middle text-center shadow-sm">
            <thead>
              <tr>
                <th className="bg-primary text-white">Title</th>
                <th className="bg-primary text-white">Score</th>
                <th className="bg-primary text-white">Time Started</th>
                <th className="bg-primary text-white">Time Ended</th>
                <th className="bg-primary text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {activity.length === 0 ? (
                <tr>
                  <td colSpan="4">No Activities found</td>
                </tr>
              ) : (
                activity.map((act) => (
                  <tr
                    key={act.id}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{act.title}</td>
                    <td>
                      {act.items}
                    </td>
                    <td>{act.time_started}</td>
                    <td>{act.time_ended}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-info btn-sm" 
                        onClick={() => {
                          navigate("/dashboard/participants", {
                            state: { activityId: act.id },
                          });
                        }}>
                          View Participants
                        </button>
                        <button className="btn btn-primary btn-sm">
                          Update
                        </button>
                        <button className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Activities;
