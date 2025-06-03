'use client'

import React, { useState } from 'react'
import { FaCreditCard } from 'react-icons/fa'

interface CartItem {
  serviceTitle: string
  packageName: string
  price: string
}

interface PaymentProps {
  amount: number
  items: CartItem[]
  onSuccess: () => void
  onCancel: () => void
}

export default function Payment({ amount, items, onSuccess, onCancel }: PaymentProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          items,
          cardNumber: paymentData.cardNumber,
          cardName: paymentData.cardName,
          email: paymentData.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Payment successful
      if (data.shouldClearCart) {
        // Clear the cart
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Payment Details</h2>
          <button 
            className="payment-close"
            onClick={onCancel}
            aria-label="Close Payment"
          >
            ×
          </button>
        </div>

        <div className="payment-amount">
          <h3>Total Amount:</h3>
          <p>₹{amount.toLocaleString()}</p>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="your@email.com"
              value={paymentData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <div className="card-input-wrapper">
              <FaCreditCard className="card-icon" />
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                className="form-input"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleChange}
                maxLength={19}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              className="form-input"
              placeholder="John Doe"
              value={paymentData.cardName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="payment-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                className="form-input"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handleChange}
                maxLength={5}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                className="form-input"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleChange}
                maxLength={3}
                required
              />
            </div>
          </div>

          {error && (
            <div className="payment-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary payment-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>

        <div className="payment-footer">
          <p>This is a dummy payment system for demonstration purposes.</p>
          <p>Do not enter real card details.</p>
        </div>
      </div>
    </div>
  )
} 