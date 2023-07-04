import React, { useState } from "react";
import axios from "axios";

function EmailSender() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    try {
      await axios.post("/send-email", { to, subject, text });
      setStatus("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("An error occurred while sending the email.");
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <input
        type="text"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={sendEmail}>Send</button>
      <p>{status}</p>
    </div>
  );
}

export default EmailSender;
