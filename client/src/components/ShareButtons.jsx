import React, { useState } from 'react';
import { Linkedin, Twitter, Link as LinkIcon, Mail, Check } from 'lucide-react';

export default function ShareButtons({ title = '', url = '' }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const emailShare = `mailto:?subject=${encodedTitle}&body=I thought you might find this Softrate research article interesting:%0D%0A%0D%0A${encodedUrl}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginRight: 4 }}>
        Share:
      </span>

      {/* LinkedIn */}
      <a
        href={linkedInShare}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#0077b5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </a>

      {/* Twitter / X */}
      <a
        href={twitterShare}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Share on X"
      >
        <Twitter size={16} />
      </a>

      {/* Email */}
      <a
        href={emailShare}
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        title="Share via Email"
      >
        <Mail size={16} />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        style={{
          height: 34,
          padding: '0 12px',
          borderRadius: 17,
          backgroundColor: copied ? '#22c55e' : '#f1f5f9',
          color: copied ? '#ffffff' : '#475569',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.82rem',
          fontWeight: 600,
          transition: 'all 0.2s',
        }}
        title="Copy article URL"
      >
        {copied ? (
          <>
            <Check size={14} /> Copied!
          </>
        ) : (
          <>
            <LinkIcon size={14} /> Copy Link
          </>
        )}
      </button>
    </div>
  );
}

