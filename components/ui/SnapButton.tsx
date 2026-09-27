"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent, PointerEvent, ReactNode, Ref } from "react";
import { useMotionSafe } from "@/hooks/useMotionSafe";
import { usePointerFine } from "@/hooks/usePointerFine";
import { cn } from "@/lib/cn";

type Variant = "primary" | "red" | "blue" | "yellow" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-[var(--shadow-lift)] [--stud:#2b2b2b]",
  red: "bg-brick-red text-white shadow-[var(--shadow-lift)] [--stud:#e8403f]",
  blue: "bg-brick-blue text-white shadow-[var(--shadow-lift)] [--stud:#2a78da]",
  yellow: "bg-brick-yellow text-ink shadow-[var(--shadow-lift)] [--stud:#ffe34d]",
  ghost: "bg-surface text-ink ring-1 ring-ink/12 shadow-[var(--shadow-soft)] [--stud:#ffffff]",
  light: "bg-white/10 text-ink-inverse ring-1 ring-white/20 [--stud:rgba(255,255,255,0.12)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-14 px-7 text-base gap-2.5",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  studs?: boolean;
  className?: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  ref?: Ref<HTMLElement>;
  dataTestId?: string;
};

const MAGNET_MAX = 4; // px

/**
 * Tactile button: rises on hover, snaps down with a tiny bounce on press,
 * and leans a few px toward a fine pointer. Magnetism and transforms are
 * disabled for touch input and reduced motion.
 */
export function SnapButton({
  children,
  variant = "primary",
  size = "md",
  studs = true,
  className,
  href,
  external,
  download,
  type = "button",
  disabled,
  onClick,
  ref,
  dataTestId,
  ...aria
}: Props) {
  const { reduced, snap } = useMotionSafe();
  const fine = usePointerFine();
  const magnetic = fine && !reduced;
  const mx = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  // hover lift / press drop share the y channel with the magnet
  const lift = useSpring(useMotionValue(0), { stiffness: 520, damping: 30, mass: 0.7 });
  const y = useTransform(() => my.get() + lift.get());

  function onMove(e: PointerEvent<HTMLElement>) {
    if (!magnetic || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mx.set(Math.max(-1, Math.min(1, dx)) * MAGNET_MAX);
    my.set(Math.max(-1, Math.min(1, dy)) * MAGNET_MAX);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const classes = cn(
    "group relative inline-flex select-none items-center justify-center rounded-[var(--radius-brick)] font-semibold tracking-[-0.01em] whitespace-nowrap",
    "transition-[box-shadow,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const animated = !reduced && !disabled;
  const motionProps = {
    style: animated ? { x: mx, y } : undefined,
    whileTap: animated ? { scale: 0.97 } : undefined,
    transition: snap,
    onHoverStart: () => animated && lift.set(-2),
    onHoverEnd: () => lift.set(0),
    onTapStart: () => animated && lift.set(1),
    onTap: () => lift.set(fine ? -2 : 0),
    onTapCancel: () => lift.set(0),
    onPointerMove: onMove,
    onPointerLeave: onLeave,
  };

  const studRow = studs ? (
    <span aria-hidden className="pointer-events-none absolute -top-[5px] left-3 right-3 flex justify-between">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[5px] w-4 rounded-t-[3px] bg-[var(--stud)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" />
      ))}
    </span>
  ) : null;

  if (href) {
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={onClick}
        data-testid={dataTestId}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
        {...aria}
        {...motionProps}
      >
        {studRow}
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      data-testid={dataTestId}
      {...aria}
      {...motionProps}
    >
      {studRow}
      {children}
    </motion.button>
  );
}
