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
