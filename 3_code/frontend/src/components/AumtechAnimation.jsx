import React from 'react';

const W = 1100;
const H = 520;

const COL1 = 155;
const COL2 = 480;
const COL3 = 810;

const ROW1 = 150;
const ROW2 = 270;
const ROW3 = 390;

const BLUE   = '#60a5fa';
const GREEN  = '#34d399';
const PURPLE = '#c084fc';
const PINK   = '#f472b6';
const AMBER  = '#fbbf24';
const TEXT   = '#e2e8f0';
const DIMTEXT = '#94a3b8';

// Bezier curve path string
const curve = (x1, y1, x2, y2) =>
  `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;

const vline = (x, y1, y2) =>
  `M ${x} ${y1} L ${x} ${y2}`;

// All connections: {path, color, delay, dur, markerId}
const CONNECTIONS = [
  { d: curve(COL1 + 90, ROW1, COL2 - 100, ROW1),         color: BLUE,   delay: 0,    dur: 1.8, id:'c1' },
  { d: curve(COL1 + 90, ROW2, COL2 - 100, ROW1 + 20),    color: GREEN,  delay: 0.5,  dur: 2.0, id:'c2' },
  { d: curve(COL1 + 90, ROW3, COL2 - 100, ROW3),         color: AMBER,  delay: 0.9,  dur: 1.7, id:'c3' },
  { d: curve(COL2 + 100, ROW1, COL3 - 90, ROW1 - 20),    color: BLUE,   delay: 0.3,  dur: 2.1, id:'c4' },
  { d: curve(COL2 + 100, ROW3, COL3 - 90, ROW2 + 50),    color: GREEN,  delay: 1.1,  dur: 1.9, id:'c5' },
  { d: vline(COL3, ROW1 + 55, ROW2 - 5),                 color: PURPLE, delay: 0.7,  dur: 1.5, id:'c6', vertical: true },
  { d: curve(COL3 + 90, ROW2 + 30, COL3 + 200, ROW2 + 30), color: PINK, delay: 1.4,  dur: 1.4, id:'c7' },
];

function NodeBox({ x, y, label, sub, color, wide = false }) {
  const w = wide ? 195 : 165;
  const h = 62;
  return (
    <g>
      <rect x={x - w/2 - 5} y={y - h/2 - 5} width={w + 10} height={h + 10}
        rx="18" fill={color} opacity="0.07" />
      <rect x={x - w/2} y={y - h/2} width={w} height={h}
        rx="13" fill="#0d1f35" stroke={color} strokeWidth="1.8" />
      <rect x={x - w/2} y={y - h/2 + 10} width="4" height={h - 20}
        rx="2" fill={color} />
      <text x={x - w/2 + 18} y={y - 5}
        fontSize="13" fontWeight="700" fill={TEXT}
        fontFamily="'Inter','Outfit',system-ui,sans-serif">
        {label}
      </text>
      <text x={x - w/2 + 18} y={y + 13}
        fontSize="10" fill={DIMTEXT}
        fontFamily="'Inter','Outfit',system-ui,sans-serif">
        {sub}
      </text>
    </g>
  );
}

const AumtechAnimation = () => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '0 auto' }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Arrowhead markers for each color */}
        {[
          { id: 'arr-blue',   color: BLUE },
          { id: 'arr-green',  color: GREEN },
          { id: 'arr-purple', color: PURPLE },
          { id: 'arr-pink',   color: PINK },
          { id: 'arr-amber',  color: AMBER },
        ].map(({ id, color }) => (
          <marker key={id} id={id} markerWidth="8" markerHeight="8"
            refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={color} />
          </marker>
        ))}
        {/* Background gradient */}
        <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
          <stop offset="0%"   stopColor="#0f2236" />
          <stop offset="100%" stopColor="#060d16" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={W} height={H} rx="24" fill="url(#bgGrad)" />

      {/* EdNex platform dashed boundary */}
      <rect x={COL2 - 120} y={88} width={240} height={H - 120}
        rx="18" fill="rgba(96,165,250,0.03)"
        stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="8 5" />

      {/* ── Column headers ── */}
      {[
        { x: COL1, label: 'INSTITUTIONS' },
        { x: COL2, label: 'EDNEX PLATFORM' },
        { x: COL3, label: 'INTELLIGENCE LAYER' },
      ].map(({ x, label }) => (
        <g key={label}>
          <text x={x} y={52} textAnchor="middle"
            fontSize="11" fontWeight="800" letterSpacing="0.13em"
            fill={DIMTEXT} fontFamily="'Inter',system-ui,sans-serif">
            {label}
          </text>
          <line x1={x - 72} y1={62} x2={x + 72} y2={62}
            stroke="#1e3a5f" strokeWidth="1" />
        </g>
      ))}

      {/* ── Connection lines WITH arrowheads ── */}
      {CONNECTIONS.map(({ d, color, id, vertical }) => {
        const markerId =
          color === BLUE   ? 'arr-blue'   :
          color === GREEN  ? 'arr-green'  :
          color === PURPLE ? 'arr-purple' :
          color === PINK   ? 'arr-pink'   : 'arr-amber';

        return (
          <path key={id}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeDasharray={vertical ? '5 4' : '7 5'}
            opacity="0.55"
            markerEnd={`url(#${markerId})`}
          />
        );
      })}

      {/* ── Animated flowing dots ── */}
      {CONNECTIONS.map(({ d, color, delay, dur, id }) => (
        <circle key={`dot-${id}`} r="5.5" fill={color} filter="url(#glow)" opacity="0.95">
          <animateMotion
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${delay}s`}
            path={d}
            calcMode="linear"
          />
        </circle>
      ))}

      {/* ── Node boxes ── */}
      <NodeBox x={COL1} y={ROW1} label="SIS"           sub="Banner · Workday"   color={BLUE} />
      <NodeBox x={COL1} y={ROW2} label="Finance"        sub="PeopleSoft"         color={GREEN} />
      <NodeBox x={COL1} y={ROW3} label="Unstructured"   sub="Canvas · PDFs"      color={AMBER} />

      <NodeBox x={COL2} y={ROW1}      label="PostgreSQL"  sub="Structured Store" color={BLUE} />
      <NodeBox x={COL2} y={ROW2 + 15} label="ETL Pipeline" sub="S3 → Parser"    color={AMBER} wide />
      <NodeBox x={COL2} y={ROW3}      label="Vector DB"   sub="pgvector · RAG"   color={GREEN} />

      <NodeBox x={COL3} y={ROW1}      label="API Gateway"  sub="FastAPI · OAuth2"    color={PURPLE} />
      <NodeBox x={COL3} y={ROW2 + 20} label="LLM Engine"   sub="Gemini · Privacy GW" color={PINK} />

      {/* Output: Aura App */}
      <g>
        <rect x={COL3 + 100} y={ROW2 - 5} width={128} height={62}
          rx="13" fill="#0d1f35" stroke={PINK} strokeWidth="1.8" />
        <rect x={COL3 + 100} y={ROW2 + 5} width="4" height={42} rx="2" fill={PINK} />
        <text x={COL3 + 122} y={ROW2 + 22}
          fontSize="13" fontWeight="700" fill={TEXT}
          fontFamily="'Inter',system-ui,sans-serif">Aura App</text>
        <text x={COL3 + 122} y={ROW2 + 40}
          fontSize="10" fill={DIMTEXT}
          fontFamily="'Inter',system-ui,sans-serif">Student UI</text>
      </g>

      {/* Privacy Gateway badge */}
      <g>
        <rect x={COL3 - 65} y={ROW2 + 95} width={130} height={26}
          rx="8" fill="#160d2a" stroke={PURPLE} strokeWidth="1" />
        <text x={COL3} y={ROW2 + 113} textAnchor="middle"
          fontSize="9.5" fontWeight="700" fill={PURPLE} letterSpacing="0.04em"
          fontFamily="'Inter',system-ui,sans-serif">🔒 Privacy Gateway</text>
      </g>

      {/* ── Legend ── */}
      {[
        { color: BLUE,   label: 'SIS / Structured', x: 30 },
        { color: AMBER,  label: 'Unstructured / ETL', x: 200 },
        { color: GREEN,  label: 'Vector / RAG',       x: 400 },
        { color: PURPLE, label: 'AI Orchestration',   x: 574 },
        { color: PINK,   label: 'Response to Aura',   x: 748 },
      ].map(({ color, label, x }) => (
        <g key={label}>
          <circle cx={x + 6} cy={H - 22} r="5" fill={color} filter="url(#glow)" />
          <text x={x + 16} y={H - 18} fontSize="10" fill={DIMTEXT}
            fontFamily="'Inter',system-ui,sans-serif">{label}</text>
        </g>
      ))}
    </svg>
  </div>
);

export default AumtechAnimation;
