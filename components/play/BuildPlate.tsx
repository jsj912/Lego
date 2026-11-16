"use client";

import { Eraser, RotateCw, Sparkles, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { BRICK_H, IsoStack, PLATE, type IsoItem, type IsoProject } from "@/components/ui/IsoStack";
import { BRICK_SHADES, type BrickColor } from "@/lib/bricks";
import { cn } from "@/lib/cn";
import { PLATE_MODELS, STARTER, type Piece } from "./plateModels";

const N = 10; // baseplate is N × N studs
const MAX_LEVELS = 6;
const COLORS: BrickColor[] = ["red", "yellow", "blue", "green", "white", "dark"];
const SHAPES = [
  { w: 1, h: 1, label: "1×1" },
  { w: 2, h: 1, label: "1×2" },
  { w: 2, h: 2, label: "2×2" },
  { w: 4, h: 2, label: "2×4" },
];

const BASE: IsoItem = { kind: "plate", color: "green", w: N, h: N, x: 0, y: 0, z: 0, id: "base" };
// keeps the drawing the same size however tall the build gets
const BOUNDS: IsoItem[] = [BASE, { color: "red", w: N, h: N, x: 0, y: 0, z: 1 + 3 * (MAX_LEVELS - 1) }];

type Placed = Piece & { id: number };

const withIds = (pieces: Piece[], from = 0): Placed[] => pieces.map((p, i) => ({ ...p, id: from + i }));

/** how many bricks high each stud column is */
function columnHeights(pieces: Placed[]) {
  const hgt = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  for (const p of pieces)
    for (let i = Math.floor(p.x); i < Math.ceil(p.x + p.w) && i < N; i++)
      for (let j = Math.floor(p.y); j < Math.ceil(p.y + p.h) && j < N; j++) hgt[i][j] = Math.max(hgt[i][j], p.l + 1);
  return hgt;
}

/**
 * A baseplate anyone can build on: pick a colour and a brick, click a stud
 * (or use the arrow keys and Enter) and the brick drops onto whatever is below.
 */
export function BuildPlate() {
  const [pieces, setPieces] = useState<Placed[]>(() => withIds(STARTER));
  const [color, setColor] = useState<BrickColor>("red");
  const [shape, setShape] = useState(2);
  const [turned, setTurned] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [fresh, setFresh] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const nextId = useRef(STARTER.length);
  const nextModel = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAuto = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  useEffect(() => stopAuto, [stopAuto]);

  const w = turned ? SHAPES[shape].h : SHAPES[shape].w;
  const h = turned ? SHAPES[shape].w : SHAPES[shape].h;
  const heights = useMemo(() => columnHeights(pieces), [pieces]);

  /** where the current brick would land if dropped with its corner on (cx, cy) */
  const landing = useCallback(
    (cx: number, cy: number) => {
      const x = Math.min(Math.max(cx, 0), N - w);
      const y = Math.min(Math.max(cy, 0), N - h);
      let l = 0;
      for (let i = x; i < x + w; i++) for (let j = y; j < y + h; j++) l = Math.max(l, heights[i][j]);
      return { x, y, l };
    },
    [heights, w, h],
  );

  const place = (cx: number, cy: number) => {
    stopAuto();
    const at = landing(cx, cy);
    if (at.l >= MAX_LEVELS) {
      setStatus("That stack is as tall as it goes.");
      return;
    }
    const id = nextId.current++;
    setPieces((ps) => [...ps, { ...at, w, h, color, id }]);
    setFresh(id);
    setStatus(`Placed a ${color} ${SHAPES[shape].label} brick on level ${at.l + 1}.`);
  };

  const undo = () => {
    stopAuto();
    setPieces((ps) => ps.slice(0, -1));
    setFresh(null);
    setStatus("Removed the last brick.");
  };

  const clear = () => {
    stopAuto();
    setPieces([]);
    setFresh(null);
    setStatus("Baseplate cleared.");
  };

  const buildForMe = () => {
    stopAuto();
    const model = PLATE_MODELS[nextModel.current++ % PLATE_MODELS.length];
    const queue = withIds(model.pieces, nextId.current);
    nextId.current += queue.length;
    setStatus(`Building a ${model.name}.`);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPieces(queue);
      setFresh(null);
      return;
    }
    setPieces([]);
    let i = 0;
    timer.current = setInterval(() => {
      const piece = queue[i++];
      if (!piece) return stopAuto();
      setPieces((ps) => [...ps, piece]);
      setFresh(piece.id);
    }, 110);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const c = cursor ?? { x: 4, y: 4 };
    const moves: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      setCursor({ x: Math.min(Math.max(c.x + move[0], 0), N - 1), y: Math.min(Math.max(c.y + move[1], 0), N - 1) });
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCursor(c);
      place(c.x, c.y);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      undo();
    } else if (e.key.toLowerCase() === "r") {
      setTurned((t) => !t);
    }
  };

  const ghost = cursor ? landing(cursor.x, cursor.y) : null;
  const items: IsoItem[] = [
    BASE,
    ...pieces.map(
      (p): IsoItem =>
        p.round
          ? { kind: "round", color: p.color, x: p.x, y: p.y, z: 1 + 3 * p.l, id: p.id, cls: p.id === fresh ? "brick-drop" : undefined }
          : { color: p.color, w: p.w, h: p.h, x: p.x, y: p.y, z: 1 + 3 * p.l, decals: p.decals, id: p.id, cls: p.id === fresh ? "brick-drop" : undefined },
    ),
    ...(ghost && ghost.l < MAX_LEVELS ? [{ color, w, h, x: ghost.x, y: ghost.y, z: 1 + 3 * ghost.l, outline: true, id: "ghost", cls: "pointer-events-none" } satisfies IsoItem] : []),
  ];

  // one invisible click target per stud column (top face plus its two visible sides), back to front
  const targets = (P: IsoProject) => {
    const poly = (...p: (readonly [number, number])[]) => p.map((q) => q.join(",")).join(" ");
    const cells: { x: number; y: number }[] = [];
    for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) cells.push({ x, y });
    cells.sort((a, b) => a.x + a.y - (b.x + b.y));
    return (
      <g fill="transparent" style={{ pointerEvents: "all", cursor: "pointer" }} data-plate-targets>
        {cells.map(({ x, y }) => {
          const zt = PLATE + heights[x][y] * BRICK_H;
          return (
            <g key={`${x}-${y}`} data-cell={`${x}-${y}`} onPointerEnter={(e) => e.pointerType === "mouse" && setCursor({ x, y })} onClick={() => place(x, y)}>
              <polygon points={poly(P(x, y, zt), P(x + 1, y, zt), P(x + 1, y + 1, zt), P(x, y + 1, zt))} />
              {heights[x][y] > 0 && (
                <>
                  <polygon points={poly(P(x, y + 1, zt), P(x + 1, y + 1, zt), P(x + 1, y + 1, PLATE), P(x, y + 1, PLATE))} />
                  <polygon points={poly(P(x + 1, y, zt), P(x + 1, y + 1, zt), P(x + 1, y + 1, PLATE), P(x + 1, y, PLATE))} />
                </>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const pill = "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold ring-1 transition-transform active:translate-y-px";
  const toolBtn = cn(pill, "bg-surface text-ink ring-ink/15 hover:bg-brick-yellow disabled:opacity-40 disabled:hover:bg-surface");

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]" data-build-plate>
      <div>
        <fieldset>
          <legend className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-2">Colour</legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`${c} bricks`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={cn(
                  "relative h-10 w-10 rounded-[9px] ring-1 ring-ink/20 transition-transform hover:-translate-y-0.5",
                  color === c && "-translate-y-1 outline outline-[3px] outline-offset-2 outline-ink",
                )}
                style={{ background: BRICK_SHADES[c].base, boxShadow: `inset 0 -4px 0 ${BRICK_SHADES[c].dark}, inset 0 2px 0 ${BRICK_SHADES[c].light}` }}
              >
                <span aria-hidden className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: BRICK_SHADES[c].light, boxShadow: `0 2px 0 ${BRICK_SHADES[c].dark}` }} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="font-mono text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink-2">Brick</legend>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {SHAPES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                aria-pressed={shape === i}
                onClick={() => setShape(i)}
                className={cn(
                  "h-10 rounded-full px-4 font-mono text-sm font-semibold ring-1 transition-colors",
                  shape === i ? "bg-ink text-white ring-ink" : "bg-surface text-ink ring-ink/15 hover:bg-brick-yellow",
                )}
              >
                {s.label}
              </button>
            ))}
            <button type="button" onClick={() => setTurned((t) => !t)} aria-pressed={turned} className={toolBtn}>
              <RotateCw size={15} aria-hidden /> Turn
            </button>
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={buildForMe} className={cn(pill, "bg-brick-red text-white ring-brick-red hover:brightness-110")} data-plate-auto>
            <Sparkles size={15} aria-hidden /> Build for me
          </button>
          <button type="button" onClick={undo} disabled={!pieces.length} className={toolBtn}>
            <Undo2 size={15} aria-hidden /> Undo
          </button>
          <button type="button" onClick={clear} disabled={!pieces.length} className={toolBtn}>
            <Eraser size={15} aria-hidden /> Clear
          </button>
        </div>

        <p className="mt-6 font-mono text-[0.8rem] text-ink-2">
          <span className="rounded-md bg-surface px-2 py-1 font-semibold text-ink ring-1 ring-ink/10" data-plate-count>
            {pieces.length} {pieces.length === 1 ? "brick" : "bricks"}
          </span>{" "}
          on the plate
        </p>
        <p aria-live="polite" className="sr-only">{status}</p>
      </div>

      <div
        role="group"
        tabIndex={0}
        aria-label="Baseplate. Arrow keys move the brick, Enter places it, Backspace removes the last one, R turns it."
        onKeyDown={onKeyDown}
        onPointerLeave={() => setCursor(null)}
        onBlur={() => setCursor(null)}
        className="sky relative flex touch-manipulation select-none items-end justify-center rounded-[var(--radius-panel)] px-2 pb-6 pt-2 shadow-[var(--shadow-soft)] ring-1 ring-ink/5 sm:px-6"
        data-plate-board
      >
        <IsoStack items={items} boundsItems={BOUNDS} size={26} shadow={false} overlay={targets} className="h-auto w-full max-w-[470px]" />
      </div>
    </div>
  );
}
