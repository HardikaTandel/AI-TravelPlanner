   // api/send-itinerary-email.js
   import nodemailer from 'nodemailer';

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     const { email, pdfBase64, filename } = req.body;
     if (!email || !pdfBase64 || !filename) {
       return res.status(400).json({ error: 'Missing required fields' });
     }

     // Use environment variables for credentials!
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASS,
       },
     });

     try {
       await transporter.sendMail({
         from: `"AI Travel Planner" <${process.env.GMAIL_USER}>`,
         to: email,
         subject: 'Your AI Travel Planner Itinerary',
         text: 'Attached is your personalized trip itinerary PDF.',
         attachments: [
           {
             filename,
             content: Buffer.from(pdfBase64, 'base64'),
             contentType: 'application/pdf',
           },
         ],
       });
       res.status(200).json({ success: true });
     } catch (err) {
       console.error('Email send error:', err);
       res.status(500).json({ error: 'Failed to send email' });
     }
   }