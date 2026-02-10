import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [studentModal, setStudentModal] = useState(false);
  const [grades, setGrades] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState();
  const [gradeId, setGradeId] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");

  const navigate = useNavigate();

  const createStudents = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/students/new-student",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            grade_level_id: Number(gradeId),
            student_id_number: Number(studentIdNumber),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create question");
      }

      await fetchStudents();

      setStudentModal(false);
      setFirstName("");
      setLastName("");
      setGender("");
      setGradeId("");
      setStudentIdNumber("");
      setMessage("");
      console.log(data.message || "Successfully Created");
    } catch (err) {
      setMessage(err.message || "Failed To Save data");
    }
  };

  const fetchStudents = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/students/list",
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
        setMessage("Failed to fetch students");
        setStudents([]);
        return;
      }

      setStudents(data.data || []);
    } catch (error) {
      setMessage("Failed to load students");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentGrade = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/grade-level", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to fetch grade levels");
      }

      setGrades(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setGrades([]);
      setMessage(err.message || "Failed to load grade levels");
    }
  };
  useEffect(() => {
    fetchStudentGrade();

    fetchStudents();
  }, []);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <h3 className="fw-semibold">Student List</h3>
        <button
          className="btn btn-primary"
          onClick={() => setStudentModal(true)}
        >
          Create Students
        </button>
      </div>

      {message && <div className="alert alert-danger mt-3">{message}</div>}

      <div className="table-responsive mt-4">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <table className="table text-center align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th className="bg-primary text-white">ID</th>
                <th className="bg-primary text-white">Student Name</th>
                <th className="bg-primary text-white">Grade Level</th>
                <th className="bg-primary text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4">No student found</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.user_profile?.grade_level?.grade_level}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
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
        )}
      </div>

      {studentModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4 border-0">
              <h4 className="text-center fw-bold mb-4">New Student</h4>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Student ID Number:
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Gender:</label>
                <div className="row">
                  <div className="col-5">
                    <select
                      className="form-select form-select-sm"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option className="form-option" value="Male">
                        Male
                      </option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Grade Level:</label>
                <div className="row">
                  <div className="col-5">
                    <select
                      className="form-select form-select-sm"
                      value={gradeId}
                      onChange={(e) => setGradeId(e.target.value)}
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {grade.grade_level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-primary px-5 py-2 fw-bold"
                  onClick={createStudents}
                >
                  Save
                </button>
                <button
                  className="btn btn-danger px-5 py-2 fw-bold"
                  onClick={() => setStudentModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
