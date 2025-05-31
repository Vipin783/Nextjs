import nodemailer from 'nodemailer';

if (!process.env.GMAIL_APP_PASSWORD) {
  console.warn('Warning: GMAIL_APP_PASSWORD is not set in environment variables');
}

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'pvipin783@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD // Use environment variable
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface EmailError {
  code?: string;
  message: string;
}

export async function sendContactNotification(data: EmailData) {
  const senderEmail = 'pvipin783@gmail.com';
  const messageId = `<contact-${Date.now()}@${process.env.NEXT_PUBLIC_SITE_URL || 'yourwebsite.com'}>`;
  
  // Email to admin
  const adminMailOptions = {
    from: `"Contact Form" <${senderEmail}>`,
    to: senderEmail,
    subject: `New Contact Form Submission from ${data.name}`,
    replyTo: data.email,
    messageId: messageId,
    headers: {
      'X-Contact-Form': 'true',
      'X-Contact-Name': data.name,
      'X-Contact-Email': data.email
    },
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `
  };

  // Auto-reply to user
  const userMailOptions = {
    from: `"Vipin" <${senderEmail}>`,
    to: data.email,
    subject: 'Thank you for contacting us',
    references: messageId,
    inReplyTo: messageId,
    headers: {
      'X-Auto-Response': 'true',
      'X-Contact-Reference': messageId
    },
    html: `
      <h2>Thank you for reaching out!</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <blockquote style="border-left: 2px solid #ccc; margin: 10px 0; padding: 10px; background-color: #f9f9f9;">
        ${data.message.replace(/\n/g, '<br>')}
      </blockquote>
      <p>If you need to add any information, please reply to this email and we'll receive your update.</p>
      <p>Best regards,<br>Vipin</p>
    `
  };

  try {
    // Send email to admin
    const adminResult = await transporter.sendMail(adminMailOptions);
    console.log('Notification email sent to admin:', adminResult.messageId);

    // Send auto-reply to user
    const userResult = await transporter.sendMail(userMailOptions);
    console.log('Auto-reply email sent to user:', userResult.messageId);

    return {
      success: true,
      adminMessageId: adminResult.messageId,
      userMessageId: userResult.messageId
    };
  } catch (error) {
    const emailError = error as EmailError;
    console.error('Email sending failed:', emailError);
    if (emailError.code === 'EAUTH') {
      console.error('Authentication failed. Please check your Gmail credentials.');
    }
    throw error;
  }
} 