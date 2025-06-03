// File: api/contact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { contactName, contactEmail, contactMessage } = req.body;

    // Basic validation: Ensure all fields are present
    if (!contactName || !contactEmail || !contactMessage) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Create a Nodemailer transporter object using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Gmail uses port 465 for SSL
      secure: true, // 'true' for port 465, 'false' for other ports (like 587 for TLS)
      auth: {
        user: process.env.GMAIL_USER,         // Your full Gmail address from Vercel env vars
        pass: process.env.GMAIL_APP_PASSWORD, // The 16-character App Password from Vercel env vars
      },
    });

    // Define the email options
    const mailOptions = {
      from: `"${contactName} via Website" <${process.env.GMAIL_USER}>`, // Sender address: Use your Gmail address here.
                                                                      // The name part is dynamic from the form.
      to: process.env.RECIPIENT_EMAIL, // Your email address where you want to receive these messages (from Vercel env vars)
      replyTo: contactEmail, // Set the Reply-To header to the email of the person who filled the form
      subject: `New Contact Form Submission from ${contactName}`,
      text: `You have received a new message from your website contact form:\n\nName: ${contactName}\nEmail: ${contactEmail}\nMessage:\n${contactMessage}`, // Plain text body
      html: `
        <h1>New Contact Message</h1>
        <p><strong>Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p>${contactMessage.replace(/\n/g, '<br>')}</p> 
      `, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response back to the client
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    // Log the detailed error on the server (Vercel logs)
    console.error('Nodemailer Error (Gmail):', err);

    // Prepare a more user-friendly error message
    let userErrorMessage = 'Failed to send message due to a server error.';
    // Specific check for authentication issues
    if (err.code === 'EAUTH' || (err.response && err.response.includes("Username and Password not accepted"))) { // Common Gmail auth error text
        userErrorMessage = 'Authentication error with Gmail. Please double-check your App Password and Gmail settings (2-Step Verification). Ensure environment variables are correctly set in Vercel and the project is redeployed.';
    } else if (err.code === 'ECONNECTION') {
        userErrorMessage = 'Could not connect to Gmail. Please try again later.';
    } else if (err.message && err.message.includes("Missing credentials")) { // Catching the specific "Missing credentials"
        userErrorMessage = 'Server configuration error: Email sending credentials are missing. Please check Vercel environment variables and redeploy.'
    }
    
    // Send an error response back to the client
    return res.status(500).json({ success: false, error: userErrorMessage, details: err.message });
  }
}