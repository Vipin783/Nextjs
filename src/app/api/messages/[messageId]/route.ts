import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('messages').deleteOne({
      _id: new ObjectId(messageId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 