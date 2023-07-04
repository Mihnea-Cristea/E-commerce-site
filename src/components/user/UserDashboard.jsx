import React, { useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { bem } from "../../lib/bem";

export default function UserDashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to log out");
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2>Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>
          {currentUser.email}

          {/* Edit products */}
          {currentUser && currentUser.email === "admin@admin.com" ? (
            <a
              href="/edit-products"
              className={`${bem("update-products")} btn`}
            >
              Edit products
            </a>
          ) : null}
          <Link to="/user-update" className="btn btn-primary w-100 mt-3">
            Update profile
          </Link>
          <a
            variant="link"
            onClick={handleLogout}
            className="w-100 mt-3 btn btn-primary"
          >
            Log Out
          </a>
        </Card.Body>
      </Card>
    </>
  );
}
