import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SuperAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const API_END_POINT = "http://localhost:8000/api/";
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      setMessage("No authentication token found.");
      navigate("/");
    }
  }, [authToken, navigate]);

  const getAdminInformation = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API_END_POINT + "user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unsuccessful fetching data");
        return;
      }

      setName(data.name || "");
      setEmail(data.email || "");

      setMessage("Fetch User Successfully");
    } catch (error) {
      setMessage("Error fetching data",error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-3">Super Admin</h2>

        <button className="btn btn-primary w-100 mb-3" onClick={getAdminInformation}>
          Get Admin Information
        </button>

        {message && (
          <div className="alert alert-info text-center" role="alert">
            {message}
          </div>
        )}

        {name && (
          <div className="mb-2">
            <strong>Name:</strong> {name}
          </div>
        )}

        {email && (
          <div className="mb-2">
            <strong>Email:</strong> {email}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdmin;
