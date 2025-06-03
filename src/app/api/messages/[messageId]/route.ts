import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type RouteParams = { params: { messageId: string } };

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { db } = await connectToDatabase();
    
    if (!db) {
      throw new Error('Failed to connect to database');
    }

    const result = await db.collection('messages').deleteOne({
      _id: new ObjectId(params.messageId)
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete message'
      },
      { status: 500 }
    );
  }
} 