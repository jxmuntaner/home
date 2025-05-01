// api/submit-form.js
const nodemailer = require('nodemailer');

// Ensure environment variables are set in Vercel project settings
const { EMAIL_USER, EMAIL_PASS, RECIPIENT_EMAIL } = process.env;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Basic validation (add more as needed)
    if (!req.body.name || !req.body.email || !req.body.message) {
       return res.status(400).json({ message: 'Missing required fields' });
    }

    // Extract form data (Vercel automatically parses JSON body)
    const { name, email, message } = req.body;

    // Configure Nodemailer transporter
    // IMPORTANT: Use environment variables for credentials
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Example for Gmail - Change if using another provider
        port: 465, // Use 465 for SSL (preferred) or 587 for TLS
        secure: true, // true for 465, false for other ports (like 587 with STARTTLS)
        auth: {
            user: EMAIL_USER, // Your sending email address from Vercel env vars
            pass: EMAIL_PASS, // Your email password or App Password from Vercel env vars
        },
        // Optional: Add TLS options if needed, e.g., for self-signed certs
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // Mail options
    const mailOptions = {
        from: `"Your Website Contact Form" <${EMAIL_USER}>`, // Sender address (use your sending email)
        to: RECIPIENT_EMAIL, // Your personal email to receive submissions from Vercel env vars
        replyTo: email, // Set reply-to to the user's email
        subject: `New Contact Form Submission from ${name}`,
        text: `You received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        html: `<p>You received a new message:</p>
               <ul>
                 <li><strong>Name:</strong> ${name}</li>
                 <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
               </ul>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`, // Format message for HTML email
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        // Send success response back to the frontend
        return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        // Send error response back to the frontend
        return res.status(500).json({ message: 'Error sending message. Please try again later.' });
    }
}