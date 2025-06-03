import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend('re_cJLSJ65c_Dh9AHfHzjfmQjUwcyPTavK6c');
const FROM_EMAIL = 'onboarding@resend.dev';
const VERIFIED_EMAIL = 'pvipin783@gmail.com';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    if (!db) {
      throw new Error('Failed to connect to database');
    }

    const messageData = {
      name,
      email,
      message,
      createdAt: new Date(),
      status: 'unread'
    };

    const result = await db.collection('messages').insertOne(messageData);

    if (!result.insertedId) {
      throw new Error('Failed to save message to database');
    }

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [VERIFIED_EMAIL],
        subject: `New Contact Form Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 3px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      // Continue with success response even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
      data: {
        id: result.insertedId,
        status: 'unread'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to process contact form'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 