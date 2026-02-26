import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GradeLevel = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradeModal, setGradeModal] = useState(false);
  const [gradeLevel, setGradeLevel] = useState("");

  const [updatedGradeLevel, setUpdatedGradeLevel] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");

  const fetchGrade = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/grade-level", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch grades");
      }

      setGrades(data.data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }

    fetchGrade();
  }, []);

  const createGrade = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/grade-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ grade_level: gradeLevel }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create grade");
      }

      setGradeLevel("");
      setGradeModal(false);
      fetchGrade();
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateGradeLevel = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/grade-level/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            grade_level: updatedGradeLevel,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update grade level");
      }

      setUpdateModal(false);
      setSelectedId(null);
      fetchGrade();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteGradeLevel = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/grade-level/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      let data = {};
      if (response.status !== 204) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to Delete");
      }

      setGrades((prev) => prev.filter((grade) => grade.id !== id));
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Grade Level</h3>
        <button className="btn btn-primary" onClick={() => setGradeModal(true)}>
          Create new Grade Level
        </button>
      </div>

      {gradeModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold text-center mb-4">New Grade Level</h5>

              <form onSubmit={createGrade}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Grade Level</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Grade 1"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary px-4">
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={() => setGradeModal(false)}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {updateModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold text-center mb-4">Update Grade Level</h5>

              <form onSubmit={updateGradeLevel}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Grade Level</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Grade 1"
                    value={updatedGradeLevel}
                    onChange={(e) => setUpdatedGradeLevel(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary px-4">
                    SAVE
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={() => setUpdateModal(false)}
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
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <table className="table align-middle">
          <thead className="bg-primary text-white">
            <tr>
              <th className="bg-primary text-white">ID</th>
              <th className="bg-primary text-white">Grade Level</th>
              <th className="bg-primary text-end text-white px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.id}</td>
                <td>{grade.grade_level}</td>
                <td className="text-end px-2">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => {
                      setSelectedId(grade.id);
                      setUpdatedGradeLevel(grade.grade_level);
                      setUpdateModal(true);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteGradeLevel(grade.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GradeLevel;
