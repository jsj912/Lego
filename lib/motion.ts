import type { TargetAndTransition, Transition } from "motion/react";

type Preset = { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition };

/** The one spring used for every tactile interaction on the site. */
export const snap: Transition = { type: "spring", stiffness: 520, damping: 30, mass: 0.7 };

/** The one "place a brick" motion: drop, overshoot ~3%, settle. */
export const place: Preset = {
  initial: { y: -28, opacity: 0 },
  animate: { y: [-28, 0.9, -0.3, 0], opacity: [0, 1, 1, 1] },
  transition: { duration: 0.52, times: [0, 0.6, 0.8, 1], ease: [0.22, 1, 0.36, 1] },
};

/** Reduced-motion replacement: opacity only. */
export const fade: Preset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};
