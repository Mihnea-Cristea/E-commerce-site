import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { bem } from "../../lib/bem";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const mailCollectionRef = collection(db, "mail");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    addMailToDatabase();
    console.log("Form submitted");
    // Reset the form fields
    setName("");
    setEmail("");
    setMessage("");
  };

  const addMailToDatabase = () => {
    const emailSubject = "Contact Hobby";
    const emailHtml = message;

    try {
      const mailData = {
        to: "mihnea.cristea2023@gmail.com",
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

  return (
    <div className={`${bem("page", "contact")}`}>
      <h1 className={`${bem("contact-form", "title")} display-4 heading`}>
        Contacteaza-ne
      </h1>
      <form onSubmit={handleSubmit}>
        <div className={`${bem("form-group", "wrapper")} form-group`}>
          <label
            htmlFor="name"
            className={`${bem("form-group", "label")} form-label`}
          >
            Nume
          </label>
          <input
            type="text"
            className={`${bem("form-control", "input")} form-control`}
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={`${bem("form-group", "wrapper")} form-group`}>
          <label
            htmlFor="email"
            className={`${bem("form-group", "label")} form-label`}
          >
            Email
          </label>
          <input
            type="email"
            className={`${bem("form-control", "input")} form-control`}
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={`${bem("form-group", "wrapper")} form-group`}>
          <label
            htmlFor="message"
            className={`${bem("form-group", "label")} form-label`}
          >
            Mesaj
          </label>
          <textarea
            className={`${bem("form-control", "input")} form-control`}
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`${bem("btn", "primary")} btn btn-primary my-2`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
