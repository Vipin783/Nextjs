import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId, Document } from 'mongodb'
import { Resend } from 'resend'

const resend = new Resend('re_NaqQmuvA_6CySGKfmwdVdv29spVFUmBg3');
const FROM_EMAIL = 'Capture Studio <onboarding@resend.dev>';
const ADMIN_EMAIL = 'attractivevipin@gmail.com';

export async function POST(request: Request) {
  try {
    const { to, name, replyText, originalMessage, messageId } = await request.json()

    if (!to || !name || !replyText || !messageId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Get the original message from database to maintain thread
    const { db } = await connectToDatabase()
    const originalMessageDoc = await db.collection('messages').findOne(
      { _id: new ObjectId(messageId) }
    )

    if (!originalMessageDoc) {
      return NextResponse.json(
        { error: 'Original message not found' },
        { status: 404 }
      )
    }

    // Generate a new message ID for this reply
    const replyMessageId = `<reply-${Date.now()}@${process.env.NEXT_PUBLIC_SITE_URL || 'yourwebsite.com'}>`

    console.log('Sending reply email to:', to);
    // Send reply email
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to], // Ensure email is in array format
      subject: `Re: Your message to Capture Studio`,
      replyTo: ADMIN_EMAIL,
      headers: {
        'Message-ID': replyMessageId,
        'In-Reply-To': originalMessageDoc.messageId,
        'References': originalMessageDoc.emailThread?.join(' ') || originalMessageDoc.messageId,
        'X-Original-Message-ID': originalMessageDoc.messageId
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${name},</h2>
          <p>${replyText}</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your original message:</strong></p>
            <p>${originalMessage}</p>
          </div>
          <p>If you have any more questions, feel free to reply to this email.</p>
          <p>Best regards,<br>Capture Studio</p>
        </div>
      `
    })
    console.log('Reply email result:', emailResult);

    // Update message status and thread in database
    await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { 
        $set: { 
          replied: true,
          lastReplyAt: new Date(),
          lastReplyId: replyMessageId
        },
        $push: {
          emailThread: replyMessageId,
          replies: {
            text: replyText,
            sentAt: new Date(),
            messageId: replyMessageId
          }
        } as Document
      }
    )

    return NextResponse.json({ 
      success: true,
      messageId: replyMessageId
    })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
} 