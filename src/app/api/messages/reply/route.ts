import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Resend } from 'resend'

const resend = new Resend('re_YcF9G28c_P6NKAkCwSNeVBATHH9y7f8X8')
const FROM_EMAIL = 'onboarding@resend.dev'

export async function POST(request: Request) {
  try {
    const { to, name, replyText, originalMessage, messageId } = await request.json()

    if (!to || !name || !replyText || !messageId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send reply email
    const emailResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: 'Re: Your message to Capture Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${name},</h2>
          <p>${replyText}</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your original message:</strong></p>
            <p>${originalMessage}</p>
          </div>
          <p>Best regards,<br>Capture Studio</p>
        </div>
      `
    })

    // Update message status in database
    const { db } = await connectToDatabase()
    await db.collection('messages').updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { replied: true } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
} 