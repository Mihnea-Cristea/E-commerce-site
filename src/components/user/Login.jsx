import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { bem } from "../../lib/bem";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/userdashboard");
    } catch (err) {
      console.log(err);
      setError("Failed to sign in");
    }
    setLoading(false);
  };

  return (
    <div className={`${bem("page", "login")}`}>
      <Card className={`${bem("login", "card")}`}>
        <Card.Body>
          <h2 className={`${bem("login", "card")}`}>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required ref={emailRef}></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordRef}
              ></Form.Control>
            </Form.Group>
            <Button className="w-100 my-4" type="submit" disabled={loading}>
              Log in
            </Button>

            <a
              className="w-100 btn btn-primary"
              type="submit"
              disabled={loading}
              href="/singup"
            >
              Need an account? Sign up
            </a>

            <span
              className="w-100 my-2 btn btn-primary"
              type="submit"
              href="/forgot-password"
              disabled={loading}
            >
              Forgot password?
            </span>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
