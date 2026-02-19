import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);

  const location = useLocation();
  const activityId = location.state?.activityId;
  const navigate = useNavigate();

  const studentParticipants = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activities/student-participants-list?activity=${activityId}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setParticipants(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const action = participants[0]?.activity?.activity_action;

  const activityAction = async (actionButton) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    if (!activityId || !actionButton) {
      console.log("Missing activityId or action");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/activities/student-participants-action",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            activity_id: activityId,
            activity_action: actionButton,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      console.log("Successful update action");
      await studentParticipants();
    } catch (error) {
      console.log("Activity action error:", error.message);
    }
  };

  useEffect(() => {
    if (activityId) {
      studentParticipants();
    }
  }, [activityId]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2>Student Participants List</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            disabled={action === "started" || action === "done"}
            onClick={() => activityAction("started")}
          >
            Start Activity
          </button>

          <button
            className="btn btn-primary"
            disabled={action !== "started"}
            onClick={() => activityAction("paused")}
          >
            Pause Activity
          </button>

          <button
            className="btn btn-secondary"
            disabled={action !== "started"}
            onClick={() => activityAction("done")}
          >
            Done Activity
          </button>
        </div>
      </div>

      <div className="table-responsive mt-4">
        <table className="table text-center align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Correct Answer</th>
              <th>Incorrect</th>
              <th>Total Items</th>
            </tr>
          </thead>

          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                  </div>
                </td>
              </tr>
            ) : (
              participants.map((participant) => (
                <tr key={participant.id}>
                  <td>{participant.user?.name}</td>
                  <td>{participant.correct_activity_answers}</td>
                  <td>{participant.incorrect_activity_answers}</td>
                  <td>{participant.activity_items}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantList;
