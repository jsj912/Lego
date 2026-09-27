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
function Rose({ x, y, s = 1, white = false }: { x: number; y: number; s?: number; white?: boolean }) {
  const rings = [13, 10, 7.2, 4.8];
  const base = white ? C.white : C.rose;
  const hi = white ? "#ffffff" : C.roseHi;
  const dk = white ? C.whiteDk : C.roseDk;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {rings.map((rr, i) => (
        <g key={rr} transform={`translate(0 ${-i * 3.2})`}>
          <ellipse cx={0} cy={2.6} rx={rr} ry={rr * 0.62} fill={dk} />
          <ellipse cx={0} cy={0} rx={rr} ry={rr * 0.62} fill={i % 2 ? hi : base} />
          <path d={`M${-rr * 0.7} ${-rr * 0.15} Q0 ${-rr * 0.75} ${rr * 0.7} ${-rr * 0.15}`} fill="none" stroke={white ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.35)"} strokeWidth={0.8} />
        </g>
      ))}
      <Stud x={0} y={-13} r={2.6} fill={hi} dark={dk} />
    </g>
  );
}

/** Gladiolus spike: pink petal pairs stacked up a stem, smaller towards the tip. */
function Gladiolus({ x, y, h, angle }: { x: number; y: number; h: number; angle: number }) {
  const n = 8;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-1} y={-h} width={2} height={h} fill={C.stem} />
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const r = 8.5 - t * 4.5;
        const yy = -h * 0.3 - t * h * 0.66;
        const side = i % 2 ? 1 : -1;
        return (
          <g key={i} transform={`translate(${side * 2} ${yy})`}>
            <ellipse cx={side * r * 0.5} cy={1.2} rx={r} ry={r * 0.72} fill={C.pinkDk} />
            <ellipse cx={side * r * 0.5} cy={0} rx={r} ry={r * 0.72} fill={C.pink} />
            <ellipse cx={side * r * 0.3} cy={-r * 0.2} rx={r * 0.4} ry={r * 0.25} fill={C.pinkHi} opacity={0.8} />
          </g>
        );
      })}
      <path d={`M0 ${-h} l-1.5 -5 M0 ${-h} l1.5 -5`} stroke={C.stemHi} strokeWidth={1.4} />
    </g>
  );
}

/** Purple aster cluster: small petal flowers with yellow centres. */
function Asters({ x, y }: { x: number; y: number }) {
  const pts = [[0, 0], [-7, 4], [7, 3], [-2, -6], [5, -5]];
  return (
    <g>
      {pts.map(([dx, dy], i) => (
        <PetalFlower key={i} x={x + dx} y={y + dy} r={4.4} n={12} petal={C.lav} petalDk={C.lavDk} petalHi="#a78bfa" centre={C.gold} centreDk={C.goldDk} />
      ))}
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

/**
 * Joan's bouquet style from her photos: pink gladiolus, red and white roses,
 * purple asters and baby's breath in a kraft-paper wrap with a white band.
 */
export function BrickBouquet({ className }: { className?: string }) {
  return (
    <svg viewBox="26 0 148 180" className={className} aria-hidden focusable="false">
      {/* back flap of the wrap */}
      <path d="M50 92 L100 176 L150 92 L128 112 L100 104 L72 112 Z" fill={C.kraftDk} />
      <path d="M50 92 L72 112 L100 104" fill="none" stroke={C.kraftHi} strokeWidth={1} opacity={0.6} />

      {/* gladiolus spikes rise out of the back */}
      <Gladiolus x={94} y={128} h={112} angle={-14} />
      <Gladiolus x={106} y={128} h={118} angle={12} />
      <Gladiolus x={100} y={128} h={96} angle={-1} />

      {/* baby's breath clouds */}
      <Breath x={78} y={100} spread={17} angle={-34} />
      <Breath x={122} y={98} spread={17} angle={34} />
      <Breath x={100} y={86} spread={14} angle={2} />
      <Breath x={62} y={90} spread={10} angle={-50} />
      <Breath x={138} y={90} spread={10} angle={50} />

      {/* leaves */}
      <Leaf x={88} y={122} len={34} angle={-62} />
      <Leaf x={112} y={122} len={34} angle={62} />

      {/* heads */}
      <Asters x={66} y={84} />
      <Asters x={134} y={84} />
      <Rose x={80} y={80} white />
      <Rose x={120} y={80} white s={0.95} />
      <Rose x={100} y={74} s={1.1} />
      <Rose x={86} y={96} s={0.85} />
      <Rose x={114} y={96} s={0.85} />

      {/* front flaps: angled kraft plates with fold lines */}
      <path d="M48 106 L100 176 L110 126 Z" fill={C.kraft} />
      <path d="M152 108 L100 176 L90 128 Z" fill={C.kraft} />
      <path d="M48 106 L110 126" stroke={C.kraftHi} strokeWidth={1.4} />
      <path d="M152 108 L90 128" stroke={C.kraftHi} strokeWidth={1.4} />
      <path d="M100 176 L105 132" stroke={C.kraftDk} strokeWidth={1} opacity={0.7} />
      {[[58, 110], [72, 115], [142, 112], [128, 117]].map(([sx, sy]) => (
        <Stud key={`${sx}-${sy}`} x={sx} y={sy} r={2.4} fill={C.kraftHi} dark={C.kraftDk} />
      ))}

      {/* white band tile */}
      <path d="M85 150 L115 150 L112 162 L88 162 Z" fill={C.whiteDk} />
      <path d="M85 148 L115 148 L113 158 L87 158 Z" fill={C.band} />
    </svg>
  );
}
