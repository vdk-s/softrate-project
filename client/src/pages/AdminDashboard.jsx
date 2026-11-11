import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  FolderPlus,
  ExternalLink,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('softrate_token');

  // Verify authentication
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [token, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, postsData, catsData] = await Promise.all([
        api.getDashboardStats(),
        api.getPosts({ status: 'all', limit: 100 }),
        api.getCategories(),
      ]);
      setStats(statsData);
      setPosts(postsData.posts || []);
      setCategories(catsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      if (err.message.includes('token') || err.message.includes('Unauthorized')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      // Refresh stats
      const statsData = await api.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      alert(err.message || 'Failed to delete article');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await api.updatePost(id, { status: newStatus });
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      alert(err.message || 'Failed to update article status');
    }
  };

  // Filter posts for the table
  const filteredPosts = posts.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: '#64748b' }}>
        Loading CMS Administration Dashboard...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#e42525',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Softrate Editorial Console
          </span>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '4px 0' }}>
            Content & Analytics Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link
            to="/admin/editor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#e42525',
              color: '#ffffff',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <Plus size={16} /> New Article
          </Link>
          <Link
            to="/admin/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#0f2238',
              color: '#ffffff',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <FolderPlus size={16} /> Categories
          </Link>
          <Link
            to="/admin/authors"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <Users size={16} /> Authors
          </Link>
          <Link
            to="/"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: '#ffffff',
            }}
          >
            <ExternalLink size={15} /> View Site
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Total Articles</span>
            <FileText size={18} color="#0f62fe" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
            {stats?.totalArticles || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Published</span>
            <CheckCircle size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', marginTop: 8 }}>
            {stats?.publishedCount || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Drafts</span>
            <Clock size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ea580c', marginTop: 8 }}>
            {stats?.draftCount || 0}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>Total Article Views</span>
            <Eye size={18} color="#8a3ffc" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
            {stats?.totalViews ? stats.totalViews.toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Publications Management Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a' }}>All Publications ({posts.length})</h2>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Keyword Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '4px 10px',
                backgroundColor: '#ffffff',
              }}
            >
              <Search size={14} color="#94a3b8" style={{ marginRight: 6 }} />
              <input
                type="text"
                placeholder="Filter title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.86rem',
                  width: 180,
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Author</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Views</th>
                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 20px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0f172a', maxWidth: 320 }}>
                    <Link
                      to={`/blog/${post.slug}`}
                      target="_blank"
                      style={{ color: '#0f172a', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e42525')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        backgroundColor: '#f1f5f9',
                        color: post.category?.accentColor || '#334155',
                      }}
                    >
                      {post.category?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>
                    {post.author}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleStatusToggle(post._id, post.status)}
                      title="Click to toggle Published / Draft"
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'opacity 0.2s',
                        backgroundColor:
                          post.status === 'published'
                            ? '#dcfce7'
                            : post.status === 'draft'
                            ? '#fef9c3'
                            : '#e0f2fe',
                        color:
                          post.status === 'published'
                            ? '#15803d'
                            : post.status === 'draft'
                            ? '#a16207'
                            : '#0369a1',
                      }}
                    >
                      {post.status.toUpperCase()} ⟳
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>
                    {post.views || 0}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <Link
                        to={`/admin/editor/${post._id}`}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 4,
                          backgroundColor: '#f1f5f9',
                          color: '#0f172a',
                        }}
                        title="Edit Article"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: 4,
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                        }}
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

