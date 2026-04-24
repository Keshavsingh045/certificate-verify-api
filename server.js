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
    name: "Keshav Kundan",
    issued_on: "20 April 2026"
  }
};

// =============================================
// CERTIFICATE VERIFY ENDPOINT
// =============================================
app.get('/api/v1/team/letter/verify/:id', (req, res) => {
  const { id } = req.params;

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

// Root endpoint - health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Hexadecimal Software Certificate Verification API',
    endpoint: '/api/v1/team/letter/verify/:certificate-id'
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

