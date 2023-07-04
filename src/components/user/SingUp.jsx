import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function Singup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const usernameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");
  const mailCollectionRef = collection(db, "mail");

  const addUserToDatabase = (username, email) => {
    addDoc(usersCollectionRef, {
      username: username,
      email: email,
    });
  };

  const addMailToDatabase = (toMail, username) => {
    const emailSubject = "Inregistrare";
    const emailHtml = `<h2>Salut, ${username}</h2><a>Te-ai inregistrat cu succes! 
    Multumim pentru alegere </a> `;

    try {
      const mailData = {
        to: toMail,
        message: {
          subject: emailSubject,
          html: emailHtml,
        },
      };

      addDoc(mailCollectionRef, mailData);
      console.log("Email added to the database successfully.");
    } catch (error) {
      console.error("Error adding email to the database:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      // calling the methods in parallel
      if (await signup(emailRef.current.value, passwordRef.current.value)) {
        addUserToDatabase(usernameRef.current.value, emailRef.current.value);
        addMailToDatabase(emailRef.current.value, usernameRef.current.value);
      }

      navigate("/userdashboard");
    } catch (err) {
      console.log(err);
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* User username */}
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                required
                ref={usernameRef}
              ></Form.Control>
            </Form.Group>

            {/* User email */}
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required ref={emailRef}></Form.Control>
            </Form.Group>

            {/* User password */}
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordRef}
              ></Form.Control>
            </Form.Group>

            {/* User password confirmation */}
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordConfirmRef}
              ></Form.Control>
            </Form.Group>
            <Button className="w-100 mt-3" type="submit" disabled={loading}>
              Sing Up
            </Button>
            <a className="w-100 btn btn-primary mt-3" href="/login">
              Already have an account? Log in
            </a>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
