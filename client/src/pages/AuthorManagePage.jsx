import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, AlertCircle, User, Trash2, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function AuthorManagePage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Technical Researcher');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('softrate_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadAuthors();
  }, [token, navigate]);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthors();
      setAuthors(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.createAuthor({
        name: name.trim(),
        role: role.trim() || 'Technical Researcher',
        avatar: avatar.trim(),
        bio: bio.trim(),
      });
      setMessage({ type: 'success', text: `Author "${name}" added successfully.` });
      setName('');
      setRole('Technical Researcher');
      setAvatar('');
      setBio('');
      loadAuthors();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to add author.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, authorName) => {
    if (!window.confirm(`Delete author "${authorName}"?`)) return;
    try {
      await api.deleteAuthor(id);
      setAuthors((prev) => prev.filter((a) => a._id !== id));
      setMessage({ type: 'success', text: `Author "${authorName}" deleted.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete author.' });
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: 32 }}>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.86rem',
            color: '#64748b',
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={14} /> Back to CMS Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', color: '#0f172a' }}>Author Management</h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 4 }}>
              Manage research contributors, technical authors, and editorial staff.
            </p>
          </div>
          <Link
            to="/admin/editor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              backgroundColor: '#e42525',
              color: '#ffffff',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: '0.86rem',
            }}
          >
            <Plus size={16} /> New Article
          </Link>
        </div>
      </div>

      {message.text && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
          }}
        >
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 32 }}>
        {/* Create Author Form */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: 24,
          }}
        >
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 16 }}>
            Add New Author Profile
          </h2>

          <form onSubmit={handleCreateAuthor}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>
                Author Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Aris Thorne"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>
                Professional Role / Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Principal Cloud Security Architect"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: 6 }}>
                Short Bio / Expertise
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Focus areas, credentials, research domains..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderRadius: 4,
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Saving Profile...' : 'Save Author Profile'}
            </button>
          </form>
        </div>

        {/* Existing Authors List */}
        <div>
          <h2 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 16 }}>
            Active Authors ({authors.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {authors.map((auth) => (
              <div
                key={auth._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      color: '#0f172a',
                      overflow: 'hidden',
                    }}
                  >
                    {auth.avatar ? (
                      <img src={auth.avatar} alt={auth.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
                      {auth.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {auth.role || 'Contributor'} • {auth.postCount || 0} publications
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(auth._id, auth.name)}
                  title="Delete Author"
                  style={{
                    padding: 8,
                    color: '#94a3b8',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#e42525')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
