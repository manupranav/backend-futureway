const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS Middleware (if needed)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({ message: "hello" });
});

// POST endpoint for form submission
app.post("/submitForm", async (req, res) => {
  try {
    const formData = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER,
        pass: process.env.PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.SENDER,
      to: process.env.RECEIVER,
      subject: "New Student Submission",
      html: `
      <img src="https://iili.io/Ja9CYoN.md.png" alt="MyFutureway Logo" style="width: 150px; height: auto; margin: 0 auto;">
  
      <h3>Personal Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${formData.name}</li>
        <li><strong>Gender:</strong> ${formData.gender}</li>
        <li><strong>Phone Number:</strong> ${formData.phoneNumber}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        <li><strong>Date of Birth:</strong> ${formData.dateOfBirth}</li>
        <li><strong>Address:</strong> ${formData.address}</li>
        <li><strong>Looking For:</strong><b> ${formData.selectedOption}</b></li>
      </ul>
  
      <h3>Education Details:</h3>
      <ul>
        ${
          formData.selectedOption === "Diploma"
            ? `
          <li><strong>10th Result:</strong> ${formData.tenthResult}</li>
          <li><strong>12th Status:</strong> ${formData.twelfthStatus}</li>
        `
            : formData.selectedOption === "Bachelors Degree" ||
              formData.selectedOption === "Medical" ||
              formData.selectedOption === "Engineering"
            ? `
          <li><strong>12th Percentage:</strong> ${formData.twelfthPercentage}</li>
          <li><strong>12th Stream:</strong> ${formData.twelfthStream}</li>
        `
            : ""
        }
    
        ${
          formData.selectedOption === "Masters Degree"
            ? `
          <li><strong>UG College:</strong> ${
            formData.ugCollege || "Not provided"
          }</li>
          <li><strong>UG Percentage:</strong> ${
            formData.ugPercentage || "Not provided"
          }</li>
          <li><strong>UG Course:</strong> ${
            formData.ugBranch || "Not provided"
          }</li>
        `
            : ""
        }
      </ul>
    `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
