'use client';

import React, { useState, useEffect } from 'react';
import { FaReply, FaTrash, FaClock } from 'react-icons/fa';
import styles from './messages.module.css';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  replied?: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (message: Message) => {
    try {
      const response = await fetch('/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.email,
          name: message.name,
          replyText,
          originalMessage: message.message,
          messageId: message._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      // Update message status and refresh list
      await fetchMessages();
      setSelectedMessage(null);
      setReplyText('');
      alert('Reply sent successfully!');
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send reply. Please try again.');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      // Refresh messages list
      await fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message. Please try again.');
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading messages...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact Messages</h1>
      
      <div className={styles.messageGrid}>
        {messages.map((message) => (
          <div key={message._id} className={styles.messageCard}>
            <div className={styles.messageHeader}>
              <h2>{message.name}</h2>
              <div className={styles.messageActions}>
                <button
                  className={styles.replyButton}
                  onClick={() => setSelectedMessage(message)}
                >
                  <FaReply /> Reply
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(message._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <a href={`mailto:${message.email}`} className={styles.email}>
              {message.email}
            </a>
            
            <p className={styles.message}>{message.message}</p>
            
            <div className={styles.messageFooter}>
              <span className={styles.date}>
                <FaClock />
                {new Date(message.createdAt).toLocaleDateString()}
              </span>
              {message.replied && (
                <span className={styles.repliedBadge}>Replied</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Reply to {selectedMessage.name}</h2>
            <p className={styles.originalMessage}>
              Original message: {selectedMessage.message}
            </p>
            
            <textarea
              className={styles.replyInput}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows={6}
            />
            
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyText('');
                }}
              >
                Cancel
              </button>
              <button
                className={styles.sendButton}
                onClick={() => handleReply(selectedMessage)}
                disabled={!replyText.trim()}
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 