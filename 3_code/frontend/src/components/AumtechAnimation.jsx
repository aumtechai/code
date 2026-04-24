import React, { useEffect, useRef } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────
const W = 1100;
const H = 520;

// Column x-centers
const COL1 = 160;   // Institutions
const COL2 = 480;   // EdNex Platform
const COL3 = 820;   // Intelligence Layer

// Row y-centers
const ROW1 = 140;
const ROW2 = 260;
const ROW3 = 380;

// Colors
const BLUE   = '#60a5fa';
const GREEN  = '#34d399';
const PURPLE = '#c084fc';
const PINK   = '#f472b6';
const AMBER  = '#fbbf24';
const MUTED  = '#334155';
const BORDER = '#1e3a5f';
const BG     = '#0d1b2a';
const TEXT   = '#e2e8f0';
const DIMTEXT = '#94a3b8';

// Connection paths [from_x, from_y, to_x, to_y, color]
const CONNECTIONS = [
  // SIS → PostgreSQL
  { x1: COL1 + 90, y1: ROW1, x2: COL2 - 90, y2: ROW1, color: BLUE,   delay: 0,    dur: 1.8 },
  // Finance → PostgreSQL
  { x1: COL1 + 90, y1: ROW2, x2: COL2 - 90, y2: ROW1, color: GREEN,  delay: 0.6,  dur: 2.1 },
  // Unstructured → S3/Parser/VectorDB
  { x1: COL1 + 90, y1: ROW3, x2: COL2 - 90, y2: ROW3, color: AMBER,  delay: 1.0,  dur: 1.6 },
  // PostgreSQL → API Gateway
  { x1: COL2 + 90, y1: ROW1, x2: COL3 - 90, y2: ROW1 + 30, color: BLUE,   delay: 0.4,  dur: 2.0 },
  // VectorDB → API Gateway
  { x1: COL2 + 90, y1: ROW3, x2: COL3 - 90, y2: ROW2,      color: PURPLE, delay: 1.2,  dur: 1.9 },
  // API Gateway → LLM
  { x1: COL3,      y1: ROW1 + 75, x2: COL3, y2: ROW2 + 10, color: PINK,   delay: 0.8,  dur: 1.5, vertical: true },
  // LLM → Aura App (output right)
  { x1: COL3 + 90, y1: ROW2 + 40, x2: COL3 + 175, y2: ROW2 + 40, color: PINK, delay: 1.6, dur: 1.4 },
];

// Node definitions
const NODES = [
  // Column 1
  { x: COL1, y: ROW1, label: 'SIS',           sub: 'Banner, Workday',   color: BLUE,   col: 1 },
  { x: COL1, y: ROW2, label: 'Finance',        sub: 'PeopleSoft',        color: GREEN,  col: 1 },
  { x: COL1, y: ROW3, label: 'Unstructured',   sub: 'Canvas · PDFs',     color: AMBER,  col: 1 },
  // Column 2 – EdNex
  { x: COL2, y: ROW1, label: 'PostgreSQL',     sub: 'Structured Store',  color: BLUE,   col: 2 },
  { x: COL2, y: ROW2 + 10, label: 'S3 Storage → Parser', sub: 'ETL Pipeline', color: AMBER, col: 2, wide: true },
  { x: COL2, y: ROW3, label: 'Vector DB',      sub: 'pgvector · RAG',    color: GREEN,  col: 2 },
  // Column 3 – Intelligence
  { x: COL3, y: ROW1, label: 'API Gateway',    sub: 'FastAPI · OAuth2',  color: PURPLE, col: 3 },
  { x: COL3, y: ROW2 + 40, label: 'LLM Engine', sub: 'Gemini · Privacy GW', color: PINK, col: 3 },
];

// ─── Sub-component: animated dot along a path ────────────────────────────────
function FlowDot({ x1, y1, x2, y2, color, delay, dur, vertical }) {
  const pathD = vertical
    ? `M ${x1} ${y1} L ${x2} ${y2}`
    : `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

  return (
    <>
      {/* Guide line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="6 6"
        opacity="0.25"
      />
      {/* Animated dot */}
      <circle r="5" fill={color} opacity="0.9" filter="url(#glow)">
        <animateMotion
          dur={`${dur}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
          calcMode="spline"
          keySplines="0.4 0 0.6 1"
          keyTimes="0;1"
        >
          <mpath href={`#path-${x1}-${y1}-${x2}-${y2}`} />
        </animateMotion>
      </circle>
      {/* Reusable path def */}
      <defs>
        <path
          id={`path-${x1}-${y1}-${x2}-${y2}`}
          d={pathD}
        />
      </defs>
    </>
  );
}

// ─── Sub-component: a node box ───────────────────────────────────────────────
function NodeBox({ x, y, label, sub, color, wide }) {
  const w = wide ? 200 : 160;
  const h = 64;
  return (
    <g>
      {/* Glow halo */}
      <rect
        x={x - w / 2 - 4} y={y - h / 2 - 4}
        width={w + 8} height={h + 8}
        rx="16" ry="16"
        fill={color} opacity="0.07"
      />
      {/* Card body */}
      <rect
        x={x - w / 2} y={y - h / 2}
        width={w} height={h}
        rx="12" ry="12"
        fill="#0f2236"
        stroke={color}
        strokeWidth="1.5"
        opacity="1"
      />
      {/* Left accent bar */}
      <rect
        x={x - w / 2} y={y - h / 2 + 8}
        width="4" height={h - 16}
        rx="2"
        fill={color}
      />
      {/* Label */}
      <text
        x={x - w / 2 + 18} y={y - 6}
        fontSize="13" fontWeight="700" fill={TEXT}
        fontFamily="'Inter', system-ui, sans-serif"
      >
        {label}
      </text>
      {/* Subtitle */}
      <text
        x={x - w / 2 + 18} y={y + 12}
        fontSize="10" fill={DIMTEXT}
        fontFamily="'Inter', system-ui, sans-serif"
      >
        {sub}
      </text>
    </g>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const AumtechAnimation = () => {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, display: 'block', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Background gradient */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%"   stopColor="#0f2236" />
            <stop offset="100%" stopColor="#060d16" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width={W} height={H} rx="24" fill="url(#bgGrad)" />

        {/* ── Column headers ── */}
        {[
          { x: COL1, label: 'INSTITUTIONS' },
          { x: COL2, label: 'EDNEX PLATFORM' },
          { x: COL3, label: 'INTELLIGENCE LAYER' },
        ].map(({ x, label }) => (
          <g key={label}>
            <text
              x={x} y={50}
              textAnchor="middle"
              fontSize="11" fontWeight="800"
              letterSpacing="0.12em"
              fill={DIMTEXT}
              fontFamily="'Inter', system-ui, sans-serif"
            >
              {label}
            </text>
            <line
              x1={x - 70} y1={60}
              x2={x + 70} y2={60}
              stroke={BORDER} strokeWidth="1"
            />
          </g>
        ))}

        {/* ── Column 2 container border (EdNex box) ── */}
        <rect
          x={COL2 - 120} y={80}
          width={240} height={H - 110}
          rx="16" fill="none"
          stroke="#1e3a5f" strokeWidth="1.5"
          strokeDasharray="8 4"
        />

        {/* ── Flow connection lines + animated dots ── */}
        {CONNECTIONS.map((c, i) => (
          <FlowDot key={i} {...c} />
        ))}

        {/* ── Node boxes ── */}
        {NODES.map((n, i) => (
          <NodeBox key={i} {...n} />
        ))}

        {/* ── Aura App output node (far right) ── */}
        <g>
          <rect x={COL3 + 98} y={ROW2 + 10} width={130} height={60} rx="12"
            fill="#0f2236" stroke={PINK} strokeWidth="1.5" />
          <rect x={COL3 + 98} y={ROW2 + 18} width="4" height={44} rx="2" fill={PINK} />
          <text x={COL3 + 120} y={ROW2 + 37} fontSize="13" fontWeight="700" fill={TEXT}
            fontFamily="'Inter', system-ui, sans-serif">Aura App</text>
          <text x={COL3 + 120} y={ROW2 + 55} fontSize="10" fill={DIMTEXT}
            fontFamily="'Inter', system-ui, sans-serif">Student Interface</text>
        </g>

        {/* ── Vertical arrow between API Gateway → LLM ── */}
        <text x={COL3 + 8} y={ROW1 + 98} fontSize="16" fill={DIMTEXT} textAnchor="middle">↓</text>

        {/* ── Privacy Gateway badge ── */}
        <g>
          <rect x={COL3 - 58} y={ROW2 + 100} width={116} height={26} rx="8"
            fill="#1a1040" stroke={PURPLE} strokeWidth="1" />
          <text x={COL3} y={ROW2 + 118} textAnchor="middle" fontSize="9.5" fontWeight="700"
            fill={PURPLE} fontFamily="'Inter', system-ui, sans-serif" letterSpacing="0.05em">
            🔒 Privacy Gateway
          </text>
        </g>

        {/* ── Legend ── */}
        {[
          { color: BLUE,   label: 'SIS / Structured', x: 40,  y: H - 24 },
          { color: AMBER,  label: 'Unstructured / ETL', x: 220, y: H - 24 },
          { color: GREEN,  label: 'Vector / RAG',       x: 430, y: H - 24 },
          { color: PURPLE, label: 'AI Orchestration',   x: 610, y: H - 24 },
          { color: PINK,   label: 'Response',           x: 800, y: H - 24 },
        ].map(({ color, label, x, y }) => (
          <g key={label}>
            <circle cx={x} cy={y} r="5" fill={color} filter="url(#glow)" />
            <text x={x + 10} y={y + 4} fontSize="10" fill={DIMTEXT}
              fontFamily="'Inter', system-ui, sans-serif">{label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AumtechAnimation;
