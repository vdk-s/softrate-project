import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import SoftrateLogo from '../components/SoftrateLogo';
import { api } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.login(email, password);
      localStorage.setItem('softrate_token', data.token);
      localStorage.setItem('softrate_user', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@softrate.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#f8f9fb',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
          padding: '40px 36px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <SoftrateLogo height={32} />
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginTop: 16 }}>
            Editorial CMS Portal
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: 4 }}>
            Sign in with authorized corporate credentials to manage Softrate publications.
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: 6,
              fontSize: '0.85rem',
              marginBottom: 20,
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: 6,
              }}
            >
              Corporate Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '10px 14px',
                backgroundColor: '#ffffff',
              }}
            >
              <Mail size={16} color="#94a3b8" style={{ marginRight: 10 }} />
              <input
                type="email"
                placeholder="admin@softrate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                }}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '10px 14px',
                backgroundColor: '#ffffff',
              }}
            >
              <Lock size={16} color="#94a3b8" style={{ marginRight: 10 }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: '#0f2238',
              color: '#ffffff',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background-color 0.2s',
              marginTop: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid #f1f5f9',
            textAlign: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              fontSize: '0.82rem',
              color: '#e42525',
              fontWeight: 600,
              background: '#fff1f1',
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #fed7d7',
            }}
          >
            ⚡ Autofill Demo Admin Credentials
          </button>
          <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#94a3b8' }}>
            admin@softrate.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

