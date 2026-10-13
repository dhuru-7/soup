import React from 'react';

/**
 * Google Material Symbols Icon Component with Custom Sharp 4-Point Star for Muse
 */
export default function Icon({ name, size = 18, className = '', fill = false, style = {} }) {
  // Custom 2D Bulky & Sharp 4-Point Star Vector for Muse
  if (name === 'star' || name === 'muse_star') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill={fill ? "currentColor" : "none"}
        className={`shrink-0 inline-block align-middle select-none ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path 
          d="M 12 2 L 15.5 8.5 L 22 12 L 15.5 15.5 L 12 22 L 8.5 15.5 L 2 12 L 8.5 8.5 Z" 
          stroke="currentColor" 
          strokeWidth={fill ? "0.4" : "1.8"} 
          strokeLinejoin="round" 
          strokeMiterlimit="4"
        />
      </svg>
    );
  }

  // Apple SF Symbols Crisp Vector for Send Up Arrow
  if (name === 'arrow_upward' || name === 'arrow_up') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`shrink-0 inline-block align-middle select-none ${className}`}
        style={style}
        aria-hidden="true"
      >
        <path d="M12 3.25a.75.75 0 0 1 .53.22l6 6a.75.75 0 0 1-1.06 1.06L12.75 5.81V20a.75.75 0 0 1-1.5 0V5.81L6.53 10.53a.75.75 0 0 1-1.06-1.06l6-6a.75.75 0 0 1 .53-.22Z" />
      </svg>
    );
  }

  // Custom Crisp Vector for Close 'X'
  if (name === 'close') {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`shrink-0 inline-block align-middle select-none ${className}`}
        style={style}
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }

  return (
    <span 
      data-fill={fill ? "true" : "false"}
      className={`material-symbols-outlined select-none align-middle inline-flex items-center justify-center shrink-0 ${fill ? 'fill-icon' : ''} ${className}`}
      style={{ 
        fontSize: `${size}px`, 
        width: `${size}px`, 
        height: `${size}px`,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${fill ? 500 : 450}, 'GRAD' 0, 'opsz' 24`,
        ...style
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
