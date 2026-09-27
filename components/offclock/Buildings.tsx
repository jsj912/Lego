// Roofs and signs for the five distinct shop buildings on the /off-the-clock street.
// Original brick-style designs; each is drawn at the building's pixel width.

type RoofProps = { w: number };

const studRow = (x0: number, x1: number, y: number, fill: string, dark: string, key: string) => {
  const out = [];
  for (let x = x0 + 9; x <= x1 - 9; x += 16) {
    out.push(
      <g key={`${key}-${x}`}>
        <rect x={x - 5} y={y - 5} width={10} height={6} rx={1.5} fill={dark} />
        <rect x={x - 5} y={y - 6} width={10} height={4} rx={1.5} fill={fill} />
      </g>,
    );
  }
  return out;
};

/** Stepped brick gable (townhouse). */
export function StepGable({ w }: RoofProps) {
  const rows = 5;
  const rh = 16;
  const step = w / (rows * 2 + 1.2);
  const h = rows * rh + 8;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block">
      {Array.from({ length: rows }, (_, i) => {
        const x = i * step;
        const y = h - (i + 1) * rh;
        const width = w - 2 * x;
        return (
          <g key={i}>
            <rect x={x} y={y} width={width} height={rh} fill={i % 2 ? "#a32020" : "#b52626"} stroke="#7a1616" strokeWidth={1} />
            <path d={`M${x} ${y + 1.5} H${x + width}`} stroke="rgba(255,255,255,0.25)" />
            {i < rows - 1
              ? [...studRow(x, x + step, y, "#c53a3a", "#7a1616", `l${i}`), ...studRow(x + width - step, x + width, y, "#c53a3a", "#7a1616", `r${i}`)]
              : studRow(x, x + width, y, "#c53a3a", "#7a1616", `t${i}`)}
          </g>
        );
      })}
      {/* round attic window */}
      <circle cx={w / 2} cy={h - rh * 2.2} r={11} fill="#f3d58a" stroke="#5a1010" strokeWidth={3} />
      <path d={`M${w / 2 - 11} ${h - rh * 2.2} H${w / 2 + 11} M${w / 2} ${h - rh * 2.2 - 11} V${h - rh * 2.2 + 11}`} stroke="#5a1010" strokeWidth={2} />
    </svg>
  );
}

/** Flat clubhouse roof with parapet studs, flagpole and flag. */
export function FlatRoofFlag({ w }: RoofProps) {
  const h = 70;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block">
      {/* flag */}
      <rect x={w - 34} y={4} width={3} height={50} fill="#9ea3a8" />
      <path d={`M${w - 31} 6 L${w - 4} 12 L${w - 31} 20 Z`} fill="#0055BF" />
      <path d={`M${w - 31} 11 L${w - 16} 13.5 L${w - 31} 16 Z`} fill="#ffffff" />
      {/* parapet */}
      <rect x={0} y={h - 18} width={w} height={18} rx={3} fill="#003f8f" />
      <rect x={0} y={h - 18} width={w} height={3} rx={1.5} fill="#2a78da" />
      {studRow(0, w, h - 18, "#2a78da", "#003070", "p")}
    </svg>
  );
}

/** Pitched tiled cottage roof with a chimney. */
export function PitchedRoof({ w }: RoofProps) {
  const h = 92;
  const tiles = [];
  for (let y = 22; y < h; y += 11) {
    const inset = ((h - y) / (h - 10)) * (w / 2 - 14);
    tiles.push(<path key={y} d={`M${inset + 4} ${y} H${w - inset - 4}`} stroke="rgba(0,0,0,0.18)" strokeWidth={1.2} />);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block">
      {/* chimney */}
      <rect x={w * 0.68} y={8} width={22} height={40} fill="#a4552b" stroke="#7a3d1e" />
      <rect x={w * 0.68 - 3} y={4} width={28} height={8} rx={2} fill="#7a3d1e" />
      <path d={`M0 ${h} L${w / 2} 10 L${w} ${h} Z`} fill="#237841" stroke="#1a5c32" strokeWidth={2} strokeLinejoin="round" />
      {tiles}
      <path d={`M${w / 2 - 12} 18 L${w / 2} 10 L${w / 2 + 12} 18`} stroke="#3a9559" strokeWidth={4} fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Steep A-frame with a gable window (studio). */
export function AFrame({ w }: RoofProps) {
  const h = 120;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block">
      <path d={`M-6 ${h} L${w / 2} 4 L${w + 6} ${h} Z`} fill="#3a3a3a" />
      <path d={`M10 ${h} L${w / 2} 22 L${w - 10} ${h} Z`} fill="#f2c200" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${w / 2 - (i + 1) * 12} ${22 + (i + 1) * 13} H${w / 2 + (i + 1) * 12}`} stroke="rgba(0,0,0,0.12)" />
      ))}
      {/* gable window */}
      <path d={`M${w / 2 - 20} ${h - 18} V${h - 50} L${w / 2} ${h - 66} L${w / 2 + 20} ${h - 50} V${h - 18} Z`} fill="#bfe1fb" stroke="#3a3a3a" strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${w / 2} ${h - 64} V${h - 18} M${w / 2 - 20} ${h - 40} H${w / 2 + 20}`} stroke="#3a3a3a" strokeWidth={2} />
    </svg>
  );
}

/** Sawtooth workshop roof with skylights. */
export function SawtoothRoof({ w }: RoofProps) {
  const h = 58;
  const teeth = 4;
  const tw = w / teeth;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="block">
      {Array.from({ length: teeth }, (_, i) => {
        const x = i * tw;
        return (
          <g key={i}>
            <path d={`M${x} ${h} L${x} 10 L${x + tw} ${h} Z`} fill="#8d9297" stroke="#5c6166" strokeWidth={1.5} strokeLinejoin="round" />
            <path d={`M${x + 3} 16 L${x + 3} ${h - 4} L${x + tw * 0.55} ${h - 4} Z`} fill="#8ec5ff" opacity={0.85} />
          </g>
        );
      })}
      <rect x={0} y={h - 6} width={w} height={6} fill="#5c6166" />
    </svg>
  );
}
