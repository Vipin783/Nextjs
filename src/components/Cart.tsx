'use client'

import React, { useState } from 'react'
import { FaShoppingCart, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import Payment from './Payment'

interface CartItem {
  serviceTitle: string
  packageName: string
  price: string
}

interface CartProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemoveItem: (index: number) => void
  onPaymentSuccess: () => void
}

export default function Cart({ items, isOpen, onClose, onRemoveItem, onPaymentSuccess }: CartProps) {
  const [showPayment, setShowPayment] = useState(false)

  if (!isOpen) return null

  const total = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace('₹', '').replace(',', ''))
    return sum + price
  }, 0)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    onClose()
    onPaymentSuccess()
  }

  return (
    <>
      <div className="cart-overlay" onClick={handleOverlayClick}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button 
              className="cart-close" 
              onClick={onClose}
              aria-label="Close Cart"
            >
              <FaTimes />
            </button>
          </div>
          
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-info">
                      <h3>{item.serviceTitle}</h3>
                      <p>{item.packageName}</p>
                      <p className="cart-item-price">{item.price}</p>
                    </div>
                    <button 
                      className="cart-item-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveItem(index)
                      }}
                      aria-label="Remove Item"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <button 
                  className="btn btn-primary cart-checkout"
                  onClick={() => setShowPayment(true)}
                >
                  Proceed to Payment
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showPayment && (
        <Payment
          amount={total}
          items={items}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </>
  )
} 