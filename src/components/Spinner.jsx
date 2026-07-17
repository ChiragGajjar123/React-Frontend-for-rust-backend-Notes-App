import React from 'react';

/**
 * Spinner – inline animated SVG ring.
 * Props:
 *   size   – px diameter (default 20)
 *   color  – stroke color (default "currentColor")
 *   thickness – stroke width (default 2.5)
 */
export const Spinner = ({ size = 20, color = 'currentColor', thickness = 2.5 }) => {
  const r = (size - thickness * 2) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="spinner-svg"
      aria-label="Loading"
      role="status"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={thickness}
        opacity={0.15}
      />
      {/* Animated arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeLinecap="round"
        style={{ transformOrigin: 'center', animation: 'spin 0.75s linear infinite' }}
      />
    </svg>
  );
};

/**
 * PageLoader – full-screen branded splash while auth/app is initialising.
 */
export const PageLoader = () => (
  <div className="page-loader">
    <div className="page-loader-inner">
      <div className="page-loader-logo">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 1 7.92 7.499c0 4.142-3.358 7.5-7.5 7.5H6.75A2.25 2.25 0 0 1 4.5 15.75v-1.5A6 6 0 0 1 12 8.25"/>
          <path d="M12 3c-.132 0-.263 0-.393 0A7.5 7.5 0 0 0 3.687 10.5"/>
        </svg>
        <Spinner size={64} color="var(--accent)" thickness={3} />
      </div>
      <h2 className="page-loader-title">NovaNotes</h2>
      <p className="page-loader-sub">Loading your workspace…</p>
    </div>
  </div>
);

/**
 * OverlayLoader – semi-transparent overlay with a centered spinner.
 * Used for blocking a section (like the note cards area) during a fetch.
 */
export const OverlayLoader = ({ label = 'Loading…' }) => (
  <div className="overlay-loader" role="status" aria-live="polite">
    <Spinner size={40} color="var(--accent)" thickness={3} />
    {label && <span className="overlay-loader-label">{label}</span>}
  </div>
);
