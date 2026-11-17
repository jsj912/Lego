// The sky over the /off-the-clock village. Original and decorative (callers mark it aria-hidden).

// ───────── sky ─────────

/** A round-plate sun with slowly turning rays. */
export function BrickSun({ size = 110 }: { size?: number }) {
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} aria-hidden>
      <g className="sun-rays">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-4} y={-56} width={8} height={16} rx={2} fill="#ffd500" opacity={0.85} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r={34} fill="#ddb400" cy={3} />
      <circle r={34} fill="#ffd500" />
      <circle r={34} fill="none" stroke="#fff3a6" strokeWidth={3} opacity={0.7} />
      {[[-13, -10], [13, -10], [-13, 12], [13, 12]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 2} rx={8} ry={6} fill="#ddb400" />
          <ellipse cx={x} cy={y} rx={8} ry={6} fill="#ffe34d" />
        </g>
      ))}
    </svg>
  );
}

/** A striped hot-air balloon built from bricks. */
export function Balloon({ size = 70 }: { size?: number }) {
  const rows: [number, string][] = [[18, "#d01012"], [28, "#ffd500"], [32, "#d01012"], [32, "#ffffff"], [28, "#0055bf"], [20, "#ffd500"], [12, "#d01012"]];
  return (
    <svg viewBox="0 0 70 110" width={size} height={(size * 110) / 70} aria-hidden>
      {rows.map(([w, fill], i) => (
        <rect key={i} x={35 - w} y={6 + i * 10} width={w * 2} height={10} rx={2} fill={fill} stroke="rgba(0,0,0,0.12)" />
      ))}
      <path d="M24 76 L29 92 M46 76 L41 92" stroke="#5c4a36" strokeWidth={1.5} />
      <rect x={27} y={92} width={16} height={11} rx={2} fill="#8a5a3c" />
      <rect x={27} y={92} width={16} height={3} rx={1.5} fill="#a8744f" />
    </svg>
  );
}

/** Three birds crossing the sky. */
export function Birds() {
  return (
    <svg viewBox="0 0 90 40" width={90} height={40} aria-hidden>
      {[[10, 22, 1], [38, 10, 0.8], [62, 26, 0.9]].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y} q${6 * s} ${-8 * s} ${12 * s} 0 q${6 * s} ${-8 * s} ${12 * s} 0`} fill="none" stroke="#3f4a57" strokeWidth={2.2} strokeLinecap="round" />
      ))}
    </svg>
  );
}
