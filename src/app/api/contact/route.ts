import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend('re_NaqQmuvA_6CySGKfmwdVdv29spVFUmBg3');
const FROM_EMAIL = 'Capture Studio <onboarding@resend.dev>';
const ADMIN_EMAIL = ['attractivevipin@gmail.com']; // Ensure it's an array

// Immediate environment variable checking
if (!process.env.EMAIL_PASSWORD) {
  console.error('EMAIL_PASSWORD environment variable is not set!');
}

// Create reusable transporter object using SMTP transport
const EMAIL_USER = 'vipin.p@srmtechsol.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

console.log('Email Configuration Check:');
console.log('- EMAIL_USER is set:', !!EMAIL_USER);
console.log('- EMAIL_PASSWORD is set:', !!EMAIL_PASSWORD);
console.log('- EMAIL_PASSWORD length:', EMAIL_PASSWORD?.length || 0);
console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

export async function POST(request: Request) {
  let db;
  
  try {
    // Parse request body
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    const dbConnection = await connectToDatabase();
    db = dbConnection.db;

    // Generate a unique message ID for email threading
    const messageId = `<contact-${Date.now()}@${process.env.NEXT_PUBLIC_SITE_URL || 'yourwebsite.com'}>`;

    // Prepare message data
    const messageData = {
      name,
      email,
      message,
      createdAt: new Date(),
      replied: false,
      status: 'new',
      messageId: messageId,
      emailThread: [messageId]
    };

    // Insert message into database
    console.log('Attempting to save message:', { name, email });
    const result = await db.collection('messages').insertOne(messageData);

    if (!result.insertedId) {
      console.error('Failed to insert message - no insertedId returned');
      throw new Error('Failed to save message to database');
    }

    console.log('Message saved successfully with ID:', result.insertedId);

    // Send emails
    try {
      console.log('Preparing to send admin notification...');
      console.log('Admin email configuration:', {
        to: ADMIN_EMAIL,
        from: FROM_EMAIL,
        messageId: messageId
      });

      // Send admin notification
      const adminEmailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        replyTo: email,
        headers: {
          'Message-ID': messageId,
          'X-Contact-Form': 'true',
          'X-Contact-Name': name,
          'X-Contact-Email': email
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Message from Website Contact Form</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages" style="color: #2563eb;">
                View all messages
              </a>
            </p>
          </div>
        `
      });

      console.log('Admin email sent successfully:', adminEmailResult);

      // Send auto-reply to user
      console.log('Sending auto-reply to user:', email);
      const userEmailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Thank you for contacting us',
        replyTo: ADMIN_EMAIL[0],
        headers: {
          'In-Reply-To': messageId,
          'References': messageId,
          'X-Auto-Response': 'true'
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>If you need to add any information, please reply to this email and we'll receive your update.</p>
            <p>Best regards,<br>Capture Studio</p>
          </div>
        `
      });

      console.log('User auto-reply sent successfully:', userEmailResult);

      // Update message status in database
      await db.collection('messages').updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            emailsSent: true,
            adminEmailResult,
            userEmailResult
          }
        }
      );

      return NextResponse.json({ 
        success: true,
        messageId: result.insertedId,
        adminEmailSent: true,
        userEmailSent: true
      });

    } catch (emailError: any) {
      console.error('Email sending failed - Full error:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        code: emailError.code,
        response: emailError.response
      });
      
      // Update message status to reflect email failure
      await db.collection('messages').updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            emailError: emailError.message || 'Unknown error',
            emailErrorDetails: JSON.stringify(emailError)
          } 
        }
      );

      return NextResponse.json({
        success: false,
        error: 'Failed to send email notifications',
        details: emailError.message || 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Try to log the error to database if we have a connection
    if (db) {
      try {
        await db.collection('errors').insertOne({
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : null,
          timestamp: new Date()
        });
      } catch (dbError) {
        console.error('Failed to log error to database:', dbError);
      }
    }

    return NextResponse.json(
      { error: 'Failed to process your message' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 