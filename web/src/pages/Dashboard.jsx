import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setError("No authentication token found.");
        navigate("/");
        return;
      }

      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/"), 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Logout failed.");
        setIsLoggingOut(false);
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to connect to the server for logout.");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-0">
      <div className="row g-0">
        <div
          className={`col-12 col-md-3 col-lg-2 d-flex flex-column justify-content-between p-3 bg-white rounded-start mb-3 mb-md-0 ${
            sidebarOpen ? "d-block" : "d-none"
          }`}
          style={{
            minHeight: "calc(100vh - 24px)",
            margin: "12px",
            borderTop: "2px solid #495057",
            borderBottom: "2px solid #495057",
            borderLeft: "2px solid #495057",
            borderRight: "none",
            paddingBottom: "20px",
          }}
        >
          <div>
            <ul className="nav flex-column w-100 text-center">
              {[
                {
                  icon: "bi-speedometer2",
                  label: "Dashboard",
                  path: "index",
                },
                { icon: "bi-people", label: "Activities", path: "activities" },
                {
                  icon: "bi-file-earmark-text",
                  label: "Reports",
                  path: "reports",
                },
                {
                  icon: "bi-globe",
                  label: "Public Page",
                  path: "public-page",
                },
                {
                  icon: "bi-question-circle",
                  label: "Questions",
                  path: "questions",
                },
              ].map((item, idx) => (
                <li key={idx} className="nav-item mb-2">
                  <Link
                    to={item.path}
                    className="nav-link text-dark fw-bold px-3 py-2 rounded"
                  >
                    <i className={`bi ${item.icon} me-2`}></i> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-100 mt-3">
            <button
              className="btn w-100 fw-bold nav-link text-dark text-center logout-btn"
              style={{
                backgroundColor: "white",
                padding: "0.5rem 1rem",
              }}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              {isLoggingOut ? "Logging out..." : "Logout User"}
            </button>

            {error && (
              <div className="alert alert-danger mt-3 py-2" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-3">
          <button
            className="btn btn-primary mb-3 d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          </button>

          <Outlet />
        </div>
      </div>

      <style>
        {`
          .nav-link:hover {
            background-color: #0d6efd !important;
            color: white !important;
            transition: background 0.3s, color 0.3s;
          }

          .logout-btn:hover {
            background-color: #dc3545 !important;
            color: white !important;
            transition: background 0.3s, color 0.3s;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
