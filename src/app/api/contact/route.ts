import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend('re_YcF9G28c_P6NKAkCwSNeVBATHH9y7f8X8');
const FROM_EMAIL = 'onboarding@resend.dev';
const ADMIN_EMAIL = 'attractivevipin@gmail.com';

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

    // Prepare message data
    const messageData = {
      name,
      email,
      message,
      createdAt: new Date(),
      replied: false,
      status: 'new'
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
      // Send admin notification
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: 'New Contact Form Submission',
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

      // Send auto-reply to user
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p>Best regards,<br>Capture Studio</p>
          </div>
        `
      });

      // Update message status in database
      await db.collection('messages').updateOne(
        { _id: result.insertedId },
        { $set: { emailsSent: true } }
      );

    } catch (emailError: unknown) {
      console.error('Email sending failed:', emailError);
      
      // Update message status to reflect email failure
      await db.collection('messages').updateOne(
        { _id: result.insertedId },
        { $set: { emailError: emailError instanceof Error ? emailError.message : 'Unknown error' } }
      );

      return NextResponse.json({
        success: true,
        warning: 'Message saved but email notification failed'
      });
    }

    return NextResponse.json({ 
      success: true,
      messageId: result.insertedId
    });

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