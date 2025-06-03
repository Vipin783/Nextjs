import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Payment from '@/lib/models/Payment';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend('re_cJLSJ65c_Dh9AHfHzjfmQjUwcyPTavK6c');
const FROM_EMAIL = 'onboarding@resend.dev';
const VERIFIED_EMAIL = 'pvipin783@gmail.com'; // Your verified email for testing

// Email templates
const getCustomerEmailTemplate = (cardName: string, orderId: string, amount: number, items: any[]) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333;">Thank you for your purchase!</h2>
    <p>Dear ${cardName},</p>
    <p>Your payment has been successfully processed.</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #444;">Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
      
      <h4 style="color: #555;">Items Purchased:</h4>
      <ul style="list-style: none; padding: 0;">
        ${items.map((item: any) => `
          <li style="margin-bottom: 10px; padding: 10px; background: #fff; border-radius: 3px;">
            <strong>${item.serviceTitle}</strong> - ${item.packageName}
            <br>
            Price: ₹${item.price}
          </li>
        `).join('')}
      </ul>
    </div>
    
    <p>If you have any questions about your order, please don't hesitate to contact us.</p>
    <p>Best regards,<br>Capture Studio Team</p>
  </div>
`;

const getAdminEmailTemplate = (cardName: string, customerEmail: string, orderId: string, amount: number, items: any[]) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #333;">New Order Received!</h2>
    <div style="background: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #444;">Customer Details:</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Name:</strong> ${cardName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
      </ul>
    </div>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
      <h3 style="color: #444;">Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
      
      <h4 style="color: #555;">Items Purchased:</h4>
      <ul style="list-style: none; padding: 0;">
        ${items.map((item: any) => `
          <li style="margin-bottom: 10px; padding: 10px; background: #fff; border-radius: 3px;">
            <strong>${item.serviceTitle}</strong> - ${item.packageName}
            <br>
            Price: ₹${item.price}
          </li>
        `).join('')}
      </ul>
    </div>
  </div>
`;

export async function POST(req: Request) {
  try {
    console.log('Starting payment processing...');

    // Connect to database
    console.log('Attempting to connect to database...');
    await connectToDatabase();
    console.log('Database connection established');

    if (!mongoose.connection.db) {
      console.error('Database connection check failed');
      throw new Error('Database connection not established');
    }
    console.log('Database connection verified');

    // Get payment data from request
    console.log('Parsing request data...');
    const data = await req.json();
    console.log('Received payment data:', {
      hasAmount: !!data.amount,
      hasItems: !!data.items,
      hasCardName: !!data.cardName,
      hasCardNumber: !!data.cardNumber,
      hasEmail: !!data.email
    });

    const { amount, items, cardName, cardNumber, email } = data;

    // Validate required fields
    if (!amount || !items || !cardName || !cardNumber || !email) {
      console.error('Validation failed:', {
        amount: !!amount,
        items: !!items,
        cardName: !!cardName,
        cardNumber: !!cardNumber,
        email: !!email
      });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields' 
        },
        { status: 400 }
      );
    }
    console.log('Data validation passed');

    // Create a new payment record
    console.log('Creating payment record...');
    const orderId = uuidv4();
    const payment = new Payment({
      orderId,
      amount,
      items: items.map((item: any) => ({
        serviceTitle: item.serviceTitle,
        packageName: item.packageName,
        price: parseInt(item.price.replace('₹', '').replace(',', '')),
      })),
      customerName: cardName,
      cardLastFour: cardNumber.slice(-4),
      status: 'completed',
    });

    // Save to database
    console.log('Attempting to save payment:', {
      orderId: payment.orderId,
      amount: payment.amount,
      customerName: payment.customerName,
      itemsCount: payment.items.length
    });

    const savedPayment = await payment.save();
    
    console.log('Payment saved successfully:', {
      id: savedPayment._id,
      orderId: savedPayment.orderId,
      status: savedPayment.status
    });

    // Send confirmation emails
    try {
      // Send customer confirmation email
      console.log('Sending confirmation email to customer...');
      const customerEmailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: [VERIFIED_EMAIL],
        subject: 'Your Order Confirmation - Capture Studio',
        html: getCustomerEmailTemplate(cardName, orderId, amount, items)
      });
      console.log('Customer email sent:', customerEmailResult);

      // Send admin notification (also to verified email during testing)
      console.log('Sending admin notification...');
      const adminEmailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: [VERIFIED_EMAIL],
        subject: `ADMIN New Order Received - ${cardName}`,
        html: getAdminEmailTemplate(cardName, email, orderId, amount, items)
      });
      console.log('Admin notification sent:', adminEmailResult);

      return NextResponse.json({
        success: true,
        message: 'Payment processed and notifications sent successfully',
        orderId: payment.orderId,
        shouldClearCart: true,
        emailStatus: {
          success: true,
          message: 'Both customer and admin notifications sent to verified email during testing'
        }
      });

    } catch (emailError: any) {
      console.error('Email sending failed:', {
        error: emailError.message,
        code: emailError.statusCode,
        details: emailError.details
      });

      return NextResponse.json({
        success: true,
        message: 'Payment processed but email notifications failed',
        orderId: payment.orderId,
        shouldClearCart: true,
        emailStatus: {
          success: false,
          error: emailError.message
        }
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        isMongoError: error instanceof mongoose.Error,
        isValidationError: error instanceof mongoose.Error.ValidationError
      });
    }

    // Check for specific types of errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid payment data',
          errors: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to process payment'
      },
      { status: 500 }
    );
  }
} 