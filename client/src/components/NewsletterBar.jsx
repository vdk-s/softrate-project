import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function NewsletterBar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid business email.');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      setStatus('success');
      setMessage(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Subscribe to Softrate Perspectives</h3>
            <p>
              Get curated technical deep-dives on cloud architecture, cybersecurity, and enterprise engineering directly to your inbox every fortnight.
            </p>
          </div>

          <div>
            {status === 'success' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  color: '#4ade80',
                  padding: '12px 20px',
                  borderRadius: 6,
                }}
              >
                <CheckCircle2 size={20} />
                <span style={{ fontWeight: 600 }}>{message}</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your corporate email address..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="newsletter-btn"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Joining...' : 'Subscribe Free'}
                </button>
              </form>
            )}

            {status === 'error' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#f87171',
                  fontSize: '0.82rem',
                  marginTop: 8,
                }}
              >
                <AlertCircle size={14} />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

