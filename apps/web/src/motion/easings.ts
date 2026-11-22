// Principle 5: Slow In, Slow Out
export const EASINGS = {
  enter: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
  move: [0.65, 0, 0.35, 1],
  linear: [0, 0, 1, 1],
} as const;

// Principle 13: Rubber Banding Resistance Formula
export function rubberBandClamp(dragDistance: number, dimensionSize: number): number {
  if (dimensionSize <= 0) return 0;
  const absDrag = Math.abs(dragDistance);
  const resistance = (1 - 1 / (absDrag * 0.55 / dimensionSize + 1)) * dimensionSize;
  return dragDistance < 0 ? -resistance : resistance;
}
