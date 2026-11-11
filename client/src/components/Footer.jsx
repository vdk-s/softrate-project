import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Linkedin, Twitter, Github, Globe } from 'lucide-react';
import SoftrateLogo from './SoftrateLogo';
import { api } from '../services/api';

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Corporate Description */}
          <div className="footer-col">
            <div style={{ filter: 'brightness(0) invert(1)', marginBottom: 16 }}>
              <SoftrateLogo height={32} />
            </div>
            <p style={{ lineHeight: 1.7, color: '#94a3b8', fontSize: '0.88rem', maxWidth: 360 }}>
              Softrate is a pioneering software intelligence and technology consulting firm. We engineer mission-critical systems across cloud-native architectures, enterprise cybersecurity, data platforms, and distributed systems.
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Corporate HQ: 100 Technology Center Way, Suite 400
              </span>
            </div>
          </div>

          {/* Quick Categories Navigation */}
          <div className="footer-col">
            <h4>Technology Focus</h4>
            <ul className="footer-links">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
              <li>
                <Link to="/blogs" style={{ color: '#e42525', fontWeight: 600 }}>
                  View All Topics →
                </Link>
              </li>
            </ul>
          </div>

          {/* Enterprise & Corporate Links */}
          <div className="footer-col">
            <h4>Company & Governance</h4>
            <ul className="footer-links">
              <li><a href="#about">About Softrate</a></li>
              <li><a href="#careers">Careers & Research Fellowships</a></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noreferrer">XML Sitemap</a></li>
              <li><a href="/robots.txt" target="_blank" rel="noreferrer">Robots.txt</a></li>
              <li><Link to="/admin/login">Admin Staff Portal</Link></li>
            </ul>
          </div>

          {/* Legal, Security & Social Links */}
          <div className="footer-col">
            <h4>Editorial Standards</h4>
            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
              All Softrate research publications adhere to strict peer-reviewed academic rigor and corporate transparency standards.
            </p>
            <div className="footer-social-links">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://softrate.io"
                target="_blank"
                rel="noreferrer"
                className="social-icon-btn"
                title="Global Network"
              >
                <Globe size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Softrate Technologies Inc. All Rights Reserved. Softrate™ is a registered corporate trademark.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#security">Security Posture</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

