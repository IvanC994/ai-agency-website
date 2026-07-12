import { useId } from 'react';

interface CortexFlowIconProps {
  size?: number;
}

/**
 * CortexFlow brand icon — rounded-square dark badge with a sky-blue diagonal
 * flow glyph (three growing nodes + connecting line + orbit ring).
 */
export const CortexFlowIcon = ({ size = 36 }: CortexFlowIconProps) => {
  const uid = useId().replace(/:/g, '');
  const bgId  = `cf-bg-${uid}`;
  const glowId = `cf-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CortexFlow logo"
    >
      <defs>
        {/* Dark gradient background */}
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        {/* Sky-blue → cyan gradient for nodes and line */}
        <linearGradient id={glowId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Rounded-square background */}
      <rect width="36" height="36" rx="8" fill={`url(#${bgId})`} />

      {/* Connecting line — drawn behind nodes */}
      <line
        x1="8" y1="28"
        x2="25" y2="11"
        stroke={`url(#${glowId})`}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Dashed orbit ring around the largest node */}
      <circle
        cx="25" cy="11" r="10"
        stroke="#38bdf8"
        strokeWidth="0.75"
        strokeDasharray="2 2.5"
        fill="none"
        opacity="0.35"
      />

      {/* Small node — bottom-left */}
      <circle cx="8"  cy="28" r="4.5" fill={`url(#${glowId})`} />

      {/* Medium node — centre */}
      <circle cx="17" cy="19" r="5.5" fill={`url(#${glowId})`} />

      {/* Large node — top-right */}
      <circle cx="25" cy="11" r="7"   fill={`url(#${glowId})`} />
    </svg>
  );
};
