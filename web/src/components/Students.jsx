import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [studentModal, setStudentModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [grades, setGrades] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [gradeId, setGradeId] = useState("");
  const [studentIdNumber, setStudentIdNumber] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [updatedFirstName, setUpdatedFirstName] = useState("");
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedGender, setUpdatedGender] = useState("");
  const [updatedGradeId, setUpdatedGradeId] = useState("");
  const [updatedStudentIdNumber, setUpdatedStudentIdNumber] = useState("");

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchStudents = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

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
        setStudents([]);
        return;
      }

      setStudents(data.data || []);
    } catch {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchStudent = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/students/list?search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error();

      setStudents(data.data || []);
    } catch {
      setMessage("Failed to search students");
    }
  };

  const fetchStudentGrade = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/grade-level", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error();

      setGrades(data.data || []);
    } catch {
      setGrades([]);
    }
  };

  const createStudents = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/students/new-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      if (!response.ok) throw new Error(data.message);

      await fetchStudents();

      setStudentModal(false);
      setFirstName("");
      setLastName("");
      setGender("Male");
      setGradeId("");
      setStudentIdNumber("");
      setMessage("");
    } catch (err) {
      setMessage(err.message || "Failed to create student");
    }
  };

  const openUpdateModal = (student) => {
    setSelectedStudentId(student.id);
    setUpdatedStudentIdNumber(student.student_id_number || "");
    setUpdatedFirstName(student.user_profile?.first_name || "");
    setUpdatedLastName(student.user_profile?.last_name || "");
    setUpdatedGender(student.user_profile?.gender || "");
    setUpdatedGradeId(student.user_profile?.grade_level_id || "");
    setUpdateModal(true);
  };

  const handleUpdateStudent = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return navigate("/");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/students/update-student/${selectedStudentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            first_name: updatedFirstName,
            last_name: updatedLastName,
            gender: updatedGender,
            grade_level_id: Number(updatedGradeId),
            student_id_number: Number(updatedStudentIdNumber),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      await fetchStudents();
      setUpdateModal(false);
      setMessage("");
    } catch (err) {
      setMessage(err.message || "Update failed");
    }
  };

  useEffect(() => {
    fetchStudentGrade();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (search === "") {
      fetchStudents();
    }
  }, [search]);

  return (
    <div className="d-flex flex-column mt-4">
      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
        <h3 className="fw-semibold">Student List</h3>
        <button
          className="btn btn-primary"
          onClick={() => setStudentModal(true)}
        >
          Create Students
        </button>
      </div>

      <div className="d-flex justify-content-end align-items-center">
        <input
          type="text"
          placeholder="search student"
          className="form-control me-1"
          style={{ width: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-primary" onClick={searchStudent}>
          Search
        </button>
      </div>

      {message && <div className="alert alert-danger mt-3">{message}</div>}

      <div className="table-responsive mt-2">
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
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openUpdateModal(student)}
                        >
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
                <select
                  className="form-select form-select-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Grade Level:</label>
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

      {updateModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4 border-0">
              <h4 className="text-center fw-bold mb-4">Update Student</h4>

              <input
                type="number"
                className="form-control mb-3"
                value={updatedStudentIdNumber}
                onChange={(e) => setUpdatedStudentIdNumber(e.target.value)}
              />

              <input
                type="text"
                className="form-control mb-3"
                value={updatedFirstName}
                onChange={(e) => setUpdatedFirstName(e.target.value)}
              />

              <input
                type="text"
                className="form-control mb-3"
                value={updatedLastName}
                onChange={(e) => setUpdatedLastName(e.target.value)}
              />

              <select
                className="form-select mb-3"
                value={updatedGender}
                onChange={(e) => setUpdatedGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                className="form-select mb-3"
                value={updatedGradeId}
                onChange={(e) => setUpdatedGradeId(e.target.value)}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.grade_level}
                  </option>
                ))}
              </select>

              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-primary px-5 py-2 fw-bold"
                  onClick={handleUpdateStudent}
                >
                  Update
                </button>

                <button
                  className="btn btn-danger px-5 py-2 fw-bold"
                  onClick={() => setUpdateModal(false)}
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
