// An original brick-built bouquet: petal pieces around studded centres, rose
// heads from stacked round plates, lavender spikes, baby's breath from tiny
// round plates, bar stems with leaf elements, and a kraft-paper wrap of tan
// plates tied with a white band. Pure SVG, decorative.

const C = {
  stem: "#237841",
  stemHi: "#3a9559",
  leaf: "#2f8f4e",
  leafDk: "#1a5c32",
  kraft: "#c9a46b",
  kraftDk: "#a9844d",
  kraftHi: "#dcbc86",
  band: "#f5f3ea",
  rose: "#b3122b",
  roseDk: "#7e0b1d",
  roseHi: "#d9364d",
  pink: "#f06b8a",
  pinkDk: "#c9476a",
  pinkHi: "#ff9db4",
  gold: "#ffd500",
  goldDk: "#ddb400",
  white: "#fbfaf4",
  whiteDk: "#d9d7ce",
  lav: "#7b5cc4",
  lavDk: "#56409a",
};

/** A round stud seen from the front-top: body + lighter top + tiny sheen. */
function Stud({ x, y, r, fill, dark }: { x: number; y: number; r: number; fill: string; dark: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y + r * 0.35} rx={r} ry={r * 0.7} fill={dark} />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill={fill} />
      <ellipse cx={x - r * 0.35} cy={y - r * 0.2} rx={r * 0.35} ry={r * 0.2} fill="rgba(255,255,255,0.55)" />
    </g>
  );
}

/** Petal-piece flower (gerbera / daisy): n rounded petals around a studded centre. */
function PetalFlower({ x, y, r, n, petal, petalDk, petalHi, centre, centreDk, tilt = 0 }: {
  x: number; y: number; r: number; n: number; petal: string; petalDk: string; petalHi: string; centre: string; centreDk: string; tilt?: number;
}) {
  const pw = r * 0.46;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(1 0.82)`}>
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`rotate(${(360 / n) * i})`}>
          <rect x={-pw / 2} y={-r} width={pw} height={r * 0.95} rx={pw / 2} fill={petalDk} />
          <rect x={-pw / 2} y={-r - 1} width={pw} height={r * 0.9} rx={pw / 2} fill={petal} />
          <rect x={-pw / 4} y={-r + 1} width={pw / 2.4} height={r * 0.4} rx={pw / 4} fill={petalHi} opacity={0.7} />
        </g>
      ))}
      <circle r={r * 0.36} fill={centreDk} />
      <g transform="scale(1 1.2)">
        <Stud x={0} y={-1} r={r * 0.26} fill={centre} dark={centreDk} />
      </g>
    </g>
  );
}

/** Rose head from stacked round plates, largest at the bottom, stud on top. */
function Rose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const rings = [13, 10, 7.2, 4.8];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {rings.map((rr, i) => (
        <g key={rr} transform={`translate(0 ${-i * 3.2})`}>
          <ellipse cx={0} cy={2.6} rx={rr} ry={rr * 0.62} fill={C.roseDk} />
          <ellipse cx={0} cy={0} rx={rr} ry={rr * 0.62} fill={i % 2 ? C.roseHi : C.rose} />
          <path d={`M${-rr * 0.7} ${-rr * 0.15} Q0 ${-rr * 0.75} ${rr * 0.7} ${-rr * 0.15}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
        </g>
      ))}
      <Stud x={0} y={-13} r={2.6} fill={C.roseHi} dark={C.roseDk} />
    </g>
  );
}

/** Leaf element: pointed ellipse with a midrib. */
function Leaf({ x, y, len, angle }: { x: number; y: number; len: number; angle: number }) {
  const w = len * 0.36;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0 Q${w} ${-len * 0.5} 0 ${-len} Q${-w} ${-len * 0.5} 0 0 Z`} fill={C.leafDk} transform="translate(1 1)" />
      <path d={`M0 0 Q${w} ${-len * 0.5} 0 ${-len} Q${-w} ${-len * 0.5} 0 0 Z`} fill={C.leaf} />
      <path d={`M0 -2 L0 ${-len + 3}`} stroke={C.leafDk} strokeWidth={0.9} />
      <circle cx={0} cy={-len * 0.18} r={1.3} fill={C.leafDk} />
    </g>
  );
}

/** Lavender / statice spike: small stacked purple studs up a bar. */
function Spike({ x, y, h, angle }: { x: number; y: number; h: number; angle: number }) {
  const n = Math.round(h / 5.5);
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-0.9} y={-h} width={1.8} height={h} fill={C.stem} />
      {Array.from({ length: n }, (_, i) => (
        <Stud key={i} x={i % 2 ? 1.6 : -1.6} y={-h + i * 5.2} r={2.6} fill={C.lav} dark={C.lavDk} />
      ))}
    </g>
  );
}

/** Baby's breath: a spray of tiny white 1×1 round plates on thin stems. */
function Breath({ x, y, spread, angle }: { x: number; y: number; spread: number; angle: number }) {
  const tips = [[-spread, -spread * 0.9], [-spread * 0.3, -spread * 1.25], [spread * 0.45, -spread * 1.1], [spread, -spread * 0.7], [spread * 0.1, -spread * 0.6]];
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {tips.map(([tx, ty], i) => (
        <g key={i}>
          <path d={`M0 0 L${tx} ${ty}`} stroke={C.stemHi} strokeWidth={0.8} />
          <Stud x={tx} y={ty} r={2.1} fill={C.white} dark={C.whiteDk} />
          <Stud x={tx + 3} y={ty + 2.5} r={1.6} fill={C.white} dark={C.whiteDk} />
        </g>
      ))}
    </g>
  );
}

function Stem({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.stem} strokeWidth={3} strokeLinecap="round" />
      <line x1={x1 - 0.8} y1={y1} x2={x2 - 0.8} y2={y2} stroke={C.stemHi} strokeWidth={0.9} strokeLinecap="round" />
    </g>
  );
}

export function BrickBouquet({ className }: { className?: string }) {
  const base = { x: 100, y: 158 };
  const heads = [
    { x: 100, y: 30 }, // gerbera
    { x: 78, y: 54 }, // rose
    { x: 122, y: 52 }, // rose
    { x: 58, y: 76 }, // daisy
    { x: 142, y: 78 }, // daisy
  ];
  return (
    <svg viewBox="26 6 148 174" className={className} aria-hidden focusable="false">
      {/* back flap of the wrap */}
      <path d="M50 92 L100 176 L150 92 L128 112 L100 104 L72 112 Z" fill={C.kraftDk} />
      <path d="M50 92 L72 112 L100 104" fill="none" stroke={C.kraftHi} strokeWidth={1} opacity={0.6} />

      {/* stems */}
      {heads.map((h, i) => (
        <Stem key={i} x1={base.x + (i - 2) * 2} y1={base.y} x2={h.x} y2={h.y + 6} />
      ))}

      {/* lavender + baby's breath behind */}
      <Spike x={95} y={124} h={98} angle={22} />
      <Spike x={105} y={124} h={90} angle={-26} />
      <Breath x={80} y={102} spread={16} angle={-30} />
      <Breath x={120} y={100} spread={16} angle={32} />
      <Breath x={100} y={90} spread={13} angle={4} />

      {/* leaves */}
      <Leaf x={90} y={120} len={36} angle={-62} />
      <Leaf x={110} y={120} len={36} angle={62} />
      <Leaf x={97} y={112} len={26} angle={-16} />

      {/* heads, back to front */}
      <PetalFlower x={58} y={76} r={12} n={10} petal={C.white} petalDk={C.whiteDk} petalHi="#ffffff" centre={C.gold} centreDk={C.goldDk} tilt={-12} />
      <PetalFlower x={142} y={78} r={12} n={10} petal={C.white} petalDk={C.whiteDk} petalHi="#ffffff" centre={C.gold} centreDk={C.goldDk} tilt={10} />
      <Rose x={78} y={58} s={1.1} />
      <Rose x={122} y={56} s={1.05} />
      <PetalFlower x={100} y={30} r={17} n={12} petal={C.pink} petalDk={C.pinkDk} petalHi={C.pinkHi} centre={C.gold} centreDk={C.goldDk} />
      <Breath x={148} y={60} spread={9} angle={40} />
      <Breath x={52} y={60} spread={9} angle={-40} />

      {/* front flaps: angled tan plates with fold lines */}
      <path d="M48 106 L100 176 L110 126 Z" fill={C.kraft} />
      <path d="M152 108 L100 176 L90 128 Z" fill={C.kraft} />
      <path d="M48 106 L110 126" stroke={C.kraftHi} strokeWidth={1.4} />
      <path d="M152 108 L90 128" stroke={C.kraftHi} strokeWidth={1.4} />
      <path d="M100 176 L105 132" stroke={C.kraftDk} strokeWidth={1} opacity={0.7} />
      {/* studs along the wrap's plate edges */}
      {[[58, 110], [72, 115], [142, 112], [128, 117]].map(([sx, sy]) => (
        <Stud key={`${sx}-${sy}`} x={sx} y={sy} r={2.4} fill={C.kraftHi} dark={C.kraftDk} />
      ))}

      {/* white band tile */}
      <path d="M85 150 L115 150 L112 162 L88 162 Z" fill={C.whiteDk} />
      <path d="M85 148 L115 148 L113 158 L87 158 Z" fill={C.band} />
      <path d="M87 151 L113 151" stroke="rgba(0,0,0,0.08)" strokeWidth={1} />
    </svg>
  );
}
