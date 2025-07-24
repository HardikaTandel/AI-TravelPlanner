const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit for large PDFs

// Replace with your Gmail credentials or use environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tandelhardika@gmail.com',
    pass: 'mxdw ggft fppu zzup' 
  }
});

app.post('/api/send-itinerary-email', async (req, res) => {
  const { email, pdfBase64, filename } = req.body;
  if (!email || !pdfBase64 || !filename) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await transporter.sendMail({
      from: '"AI Travel Planner" <YOUR_GMAIL_ADDRESS@gmail.com>',
      to: email,
      subject: 'Your AI Travel Planner Itinerary',
      text: 'Attached is your personalized trip itinerary PDF.',
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));