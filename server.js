const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS enable karo taaki browser se directly access ho sake
app.use(cors());
app.use(express.json());

// =============================================
// CERTIFICATE DATABASE
// Yahan aap apne saare certificates add karo
// =============================================
const certificates = {
  "3c129dbd-941c-4716-a332-f371b001e670": {
    valid: true,
    message: "This certificate is genuine and was issued by Hexadecimal Software Pvt Ltd.",
    name: "keshav kundan",
    issued_on: "22 April 2026",
    company: "Hexadecimal Software Pvt Ltd",
    course: "Software Development"
  },
  "ATTS/TR25/154": {
    valid: true,
    message: "This certificate is genuine and was issued by Apana Time Tech Solutions.",
    name: "Ankit Akash",
    issued_on: "20 April 2026",
    company: "Apana Time Tech Solutions",
    course: "Data Analyst Training Program"
  }
};

// =============================================
// CERTIFICATE VERIFY ENDPOINT
// =============================================
app.get('/api/v1/team/letter/verify/*', (req, res) => {
  const id = req.params[0];

  console.log(`Certificate verify request for ID: ${id}`);

  const certificate = certificates[id];

  if (certificate) {
    // Certificate mili - valid response
    res.status(200).json(certificate);
  } else {
    // Certificate nahi mili - invalid response
    res.status(404).json({
      valid: false,
      message: "This certificate is not valid or does not exist in our records.",
      name: null,
      issued_on: null
    });
  }
});

// =============================================
// HTML VERIFICATION PAGE
// =============================================
app.get('/verify/*', (req, res) => {
  const id = req.params[0];
  console.log(`HTML Certificate verify request for ID: ${id}`);

  const certificate = certificates[id];

  if (certificate) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate Verification</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .container { background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 600px; width: 90%; text-align: center; border-top: 5px solid #10b981; }
          .icon { font-size: 64px; margin-bottom: 20px; line-height: 1; }
          .title { color: #111827; font-size: 28px; margin-bottom: 12px; font-weight: 700; }
          .message { color: #4b5563; font-size: 16px; margin-bottom: 30px; line-height: 1.6; }
          .details { background-color: #f9fafb; padding: 25px; border-radius: 8px; text-align: left; margin-bottom: 30px; border: 1px solid #e5e7eb; }
          .details p { margin: 12px 0; font-size: 15px; color: #374151; display: flex; flex-direction: column; }
          .details strong { color: #111827; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .details .value { font-size: 16px; font-weight: 600; color: #1f2937; }
          .footer { color: #9ca3af; font-size: 13px; border-top: 1px solid #f3f4f6; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1 class="title">Certificate Verified</h1>
          <p class="message">${certificate.message}</p>
          <div class="details">
            <p><strong>Candidate Name</strong><span class="value">${certificate.name}</span></p>
            <p><strong>Course/Program</strong><span class="value">${certificate.course || 'N/A'}</span></p>
            <p><strong>Date of Issue</strong><span class="value">${certificate.issued_on}</span></p>
            <p><strong>Certificate ID</strong><span class="value">${id}</span></p>
            <p><strong>Issued By</strong><span class="value">${certificate.company}</span></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} ${certificate.company}. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate Not Found</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          .container { background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 500px; width: 90%; text-align: center; border-top: 5px solid #ef4444; }
          .icon { font-size: 64px; margin-bottom: 20px; line-height: 1; }
          .title { color: #111827; font-size: 28px; margin-bottom: 12px; font-weight: 700; }
          .message { color: #4b5563; font-size: 16px; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1 class="title">Invalid Certificate</h1>
          <p class="message">The certificate ID you entered is not valid or does not exist in our records.</p>
        </div>
      </body>
      </html>
    `);
  }
});


// Root endpoint - health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Certificate Verification API is Live!',
    endpoints: {
      json_api: '/api/v1/team/letter/verify/*',
      html_verify: '/verify/*'
    }
  });
});

// Server start karo (Local ke liye)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✅ Certificate Verification API chal raha hai!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
  });
}

// Vercel serverless environment ke liye export
module.exports = app;

