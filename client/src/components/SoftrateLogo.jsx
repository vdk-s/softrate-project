import React from 'react';

/**
 * Softrate Corporate Brand Logo
 * Displays the authentic brand mark with pink/purple/blue gradient wings,
 * center orbital ring, star constellation, and dark navy "Softrate™".
 */
export default function SoftrateLogo({ height = 40, className = '' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
      }}
      className={className}
    >
      <img
        src="/assets/softrate-logo.png"
        alt="Softrate™"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
        onError={(e) => {
          // Graceful fallback if path issues
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}
