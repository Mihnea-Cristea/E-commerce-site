const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3001;

// Configure Nodemailer with your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "hobbygsm2023@gmail.com",
    pass: "Baneasa2023@",
  },
});

app.use(express.json());

// Define a POST endpoint to handle the email sending
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    // Send the email using Nodemailer
    await transporter.sendMail({
      from: "hobbygsm2023@gmail.com",
      to: "fantomalbastra@gmail.com",
      subject: "salutare!",
      text: "sallllllll",
    });

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the email." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
