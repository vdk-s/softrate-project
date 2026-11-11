import React, { useState } from 'react';

/**
 * Modern minimalist placeholder thumbnail for Softrate publications.
 * Displays clean Zoho-style geometric card with the official Softrate brand emblem.
 * Guarantees zero broken images.
 */
export default function PlaceholderThumbnail({
  title = 'Softrate Article',
  categoryName = 'Technology',
  accentColor = '#0f62fe',
  coverImage = '',
  height = '100%',
  className = '',
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (coverImage && !imageFailed) {
    return (
      <img
        src={coverImage}
        alt={title}
        onError={() => setImageFailed(true)}
        style={{
          width: '100%',
          height: height,
          objectFit: 'cover',
          display: 'block',
        }}
        className={className}
        loading="lazy"
      />
    );
  }

  // Generate deterministic variations for geometric shapes based on title
  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patternType = seed % 4;
  const hex = accentColor || '#0f62fe';

  return (
    <div
      style={{
        width: '100%',
        height: height,
        position: 'relative',
        backgroundColor: '#0c1322',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      {/* Background SVG Grid & Ambient Accents */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id={`bg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080e1a" />
            <stop offset="100%" stopColor="#151e32" />
          </linearGradient>

          <pattern id={`pat-${seed}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#bg-${seed})`} />
        <rect width="100%" height="100%" fill={`url(#pat-${seed})`} />

        {patternType === 0 && (
          <g opacity="0.6">
            <circle cx="340" cy="40" r="130" fill={hex} opacity="0.16" />
            <line x1="0" y1="210" x2="400" y2="40" stroke={hex} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
            <polygon points="40,200 120,70 190,200" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
          </g>
        )}

        {patternType === 1 && (
          <g opacity="0.6">
            <rect x="250" y="-30" width="180" height="180" transform="rotate(22 250 -30)" fill={hex} opacity="0.14" />
            <line x1="60" y1="0" x2="60" y2="240" stroke={hex} strokeWidth="1.5" opacity="0.25" />
            <line x1="120" y1="0" x2="120" y2="240" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          </g>
        )}

        {patternType === 2 && (
          <g opacity="0.6">
            <circle cx="60" cy="180" r="140" fill={hex} opacity="0.14" />
            <line x1="0" y1="70" x2="400" y2="170" stroke={hex} strokeWidth="2" opacity="0.25" />
            <circle cx="330" cy="70" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          </g>
        )}

        {patternType === 3 && (
          <g opacity="0.6">
            <polygon points="280,0 400,0 400,110" fill={hex} opacity="0.18" />
            <polygon points="0,150 0,240 130,240" fill={hex} opacity="0.12" />
            <circle cx="200" cy="120" r="75" fill="none" stroke={hex} strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
          </g>
        )}
      </svg>

      {/* Real Softrate Brand Wingmark Symbol Emblem */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/assets/softrate-symbol.png"
          alt="Softrate Emblem"
          style={{
            height: '68px',
            width: 'auto',
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.4))',
            opacity: 0.92,
          }}
        />
      </div>

      {/* Category Pill Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 16,
          zIndex: 3,
          backgroundColor: 'rgba(12, 19, 34, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 4,
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          borderLeft: `3px solid ${hex}`,
        }}
      >
        {categoryName}
      </div>
    </div>
  );
}
