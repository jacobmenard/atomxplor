import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [activityObjects, setActivityObjects] = useState([]);

  const location = useLocation();
  const activityId = location.state?.activityId;
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    navigate("/");
  }

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

  const activityObject = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/activity/get-object/${activityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setActivityObjects(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };


  const action = activityObjects?.activity_action;

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
            activity_id: activityObjects.id,
            activity_action: actionButton,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      console.log("Successful update action");
      await activityObject();
      await studentParticipants();
    } catch (error) {
      console.log("Activity action error:", error.message);
    }
  };

  useEffect(() => {
    if (activityId) {
      studentParticipants();
      activityObject();
    }
  }, [activityId]);

  return (
    <div className="container mt-4">
      
      <h2 className="mb-3">Student Participants List</h2>

      <div className="d-flex justify-content-between align-items-center gap-2 my-3">
        <h4>Activity Information</h4>

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            disabled={action !== "paused" && action !== "done"}
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
      <div className="d-flex flex-column gap-2 mb-3 p-3 border rounded shadow-sm">
        <div>
          Activity ID: <strong>{activityObjects?.id || "N/A"}</strong>
        </div>
        <div>
          Activity title: <strong>{activityObjects?.title || "N/A"}</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          Activity action: 
          <Badge pill bg={activityObjects?.activity_action === 'started' ? 'primary' : activityObjects?.activity_action === 'paused' ? 'warning' : activityObjects?.activity_action === 'not_started' ? 'secondary' : 'success'}>
            {activityObjects?.activity_action === 'started' ? 'Started' : activityObjects?.activity_action === 'paused' ? 'Paused' : activityObjects?.activity_action === 'not_started' ? 'Not Started' : 'Done'}
          </Badge>
        </div>  
      </div>

      <h4 className="my-3">Activity Participants</h4>
      <div className="table-responsive mt-4">
        <table className="table text-center align-middle">
          <thead>
            <tr>
              <th className="bg-primary text-white">Name</th>
              <th className="bg-primary text-white">Correct Answer</th>
              <th className="bg-primary text-white">Incorrect</th>
              <th className="bg-primary text-white">Total Items</th>
            </tr>
          </thead>

          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan="5">No Participants Found</td>
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
