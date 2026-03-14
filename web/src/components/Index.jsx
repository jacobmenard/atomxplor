import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';

const Index = () => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({
    total_activities: 0,
    total_ongoing_activities: 0,
    total_done_activities: 0,
    ongoing_activities: [],
  });
  const [activity, setActivity] = useState([]);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModalStart, setShowModalStart] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("Authentication token or user ID not found.");
      navigate("/");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard data.");

        const result = await response.json();
        setDashboard(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user.");

        const result = await response.json();
        setUser(result?.data || null);
        setMessage("");
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchActivity = async () => {
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

    fetchUser();
    fetchDashboard();
    fetchActivity();
  }, [navigate]);

  return (
    <div>
      <div className="bg-white p-4 rounded border-0">
        {message && <h5 className="text-success mb-3">{message}</h5>}

        {isLoading ? (
          <h5>Loading user data...</h5>
        ) : (
          <h2>Welcome back, {user.name || "User"}!</h2>
        )}

        <div className="d-flex flex-row gap-2 mt-3 flex-wrap">
          <div className="bg-danger text-white rounded-3 p-3 w-25 text-start shadow-sm">
            <p className="mb-1 fw-semibold">Created Activities</p>
            <h4 className="fw-bold mb-0">{dashboard.total_activities}</h4>
          </div>

          <div className="bg-warning text-white rounded-3 p-3 w-25 text-start shadow-sm">
            <p className="mb-1 fw-semibold">Ongoing Activities</p>
            <h4 className="fw-bold mb-0">
              {dashboard.total_ongoing_activities}
            </h4>
          </div>

          <div className="bg-success text-white rounded-3 p-3 w-25 text-start shadow-sm">
            <p className="mb-1 fw-semibold">Done Activities</p>
            <h4 className="fw-bold mb-0">{dashboard.total_done_activities}</h4>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="mb-3">List of Ongoing Activities</h3>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <div className="table-responsive  mt-4">
              <table className="table text-center align-middle">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="bg-primary text-white text-start">ID</th>
                    <th className="bg-primary text-white">Title</th>
                    <th className="bg-primary text-white">Items</th>
                    <th className="bg-primary text-white">Time Started</th>
                    <th className="bg-primary text-white">Time Ended</th>
                    <th className="bg-primary text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.length === 0 ? (
                    <tr>
                      <td colSpan="5">No Activities Found</td>
                    </tr>
                  ) : (
                    activity.map((act, index) => (
                      <tr key={act.id}>
                        <td className="text-start">{index + 1}</td>
                        <td>{act.title}</td>
                        <td>
                          {act.items || 0}
                        </td>
                        <td>{act.time_started}</td>
                        <td>{act.time_ended}</td>
                        <td>
                          <Badge pill bg={
                            act.activity_action === "started"
                              ? "primary"
                              : act.activity_action === "paused"
                              ? "warning"
                              : "success"
                          }>
                            {act.activity_action === "started"
                              ? "Started"
                              : act.activity_action === "paused"
                              ? "Paused"
                              : "Done"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

        {error && (
          <div className="alert alert-danger mt-3 py-2" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
