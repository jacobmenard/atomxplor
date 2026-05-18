import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Subjects = () => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjectModal, setSubjectModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");

  const [subject, setSubject] = useState({
    id: null,
    subject: "",
  });
  

  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const createSubject = async (e) => {
    e.preventDefault(); 
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subject: subject.subject }),
      }); 
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subject");
      }

      // Reset the form and close the modal
      setSubjectName("");
      setSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const updateSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subject/${subject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ subject: subject.subject }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update subject");
      }
      setSubject({
        id: null,
        subject: "",
      });
      fetchSubjects();
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subject/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subject");
      }

      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/subject`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subjects");
      }

      setSubjectsList(data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSubject = (subject) => {
    if (subject) {
      setSubject({
        id: subject.id,
        subject: subject.subject,
      });
    } else {
      setSubject({
        id: null,
        subject: "",
      });
    }
    setSubjectModal(true);
  }

  const openSubjectModal = (subject) => {
    if (subject) {
      setSubject({
        id: subject.id,
        subject: subject.subject,
      });
    } else {
      setSubject({
        id: null,
        subject: "",
      });
    }

    setSubjectModal(true);
  };

  useEffect(() => {
    
    if (!authToken) {
      navigate("/");
      return;
    }

    fetchSubjects();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Subjects</h3>
        <button className="btn btn-primary" onClick={() => selectSubject(null)}>
          Create new Subject
        </button>
      </div>

      {subjectModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 rounded-4">
              <h5 className="fw-bold text-center mb-4">New Subject</h5>

              <form onSubmit={subject.id ? updateSubject : createSubject}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter subject name"
                    value={subject.subject}
                    onChange={(e) => setSubject({ ...subject, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary px-4">
                    {subject.id ? "UPDATE" : "SAVE"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4"
                    onClick={() => setSubjectModal(false)}
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
              <th className="bg-primary text-white">Subject</th>
              <th className="bg-primary text-end text-white px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {subjectsList.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.subject}</td>
                <td className="text-end px-2">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => {
                      selectSubject(subject);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSubject(subject.id)}
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

export default Subjects;
