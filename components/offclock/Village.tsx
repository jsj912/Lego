// Sky props for the /off-the-clock village. Decorative.

/** A cloud of white round plates. */
export function BrickCloud({ w = 120 }: { w?: number }) {
  const puffs = [
    [20, 34, 16], [40, 24, 20], [64, 20, 22], [88, 28, 18], [104, 36, 14], [60, 38, 18], [34, 40, 14],
  ];
  return (
    <svg viewBox="0 0 124 56" width={w} height={(w * 56) / 124} aria-hidden>
      {puffs.map(([cx, cy, r], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy + 4} rx={r} ry={r * 0.72} fill="#d9e4ee" />
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.72} fill="#ffffff" />
          <ellipse cx={cx - r * 0.3} cy={cy - r * 0.25} rx={r * 0.35} ry={r * 0.2} fill="#ffffff" opacity={0.9} />
        </g>
      ))}
      {[[40, 16], [64, 11], [88, 19]].map(([x, y], i) => (
        <g key={`s${i}`}>
          <ellipse cx={x} cy={y + 2} rx={5} ry={3} fill="#d9e4ee" />
          <ellipse cx={x} cy={y} rx={5} ry={3} fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
}
