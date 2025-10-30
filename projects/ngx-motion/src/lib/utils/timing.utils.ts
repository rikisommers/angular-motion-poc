/**
 * Normalize keyframe times array to 0-1 range
 * Handles both normalized (0-1) and absolute time values
 */
export function normalizeTimes(times: number[] | undefined, duration: number): number[] | undefined {
  if (!times || times.length === 0) return undefined;

  // Check if any values are above 1 (indicating absolute times)
  const hasValuesAboveOne = times.some(t => t > 1);
  if (!hasValuesAboveOne) return times;

  // Find the maximum time value
  const maxT = Math.max(...times);

  // Ensure duration is valid (avoid division by zero)
  const safeDuration = Math.max(duration, 0.000001);

  // Determine divisor: use maxT if significantly larger than duration, else use duration
  const divisor = maxT > safeDuration * 1.001 ? maxT : safeDuration;

  // Normalize to 0-1 range
  return times.map(t => {
    const v = t / divisor;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  });
}

/**
 * Calculate stagger delay for a child element
 * Takes into account the child's index and stagger direction
 */
export function calculateStaggerDelay(
  index: number,
  totalChildren: number,
  staggerValue: number,
  direction: number
): number {
  let staggerIndex: number;

  if (direction >= 0) {
    // Forward direction: 0, 1, 2, 3...
    staggerIndex = index;
  } else {
    // Reverse direction: 3, 2, 1, 0...
    staggerIndex = totalChildren - 1 - index;
  }

  return staggerIndex * staggerValue;
}

/**
 * Calculate total duration including stagger for all children
 */
export function calculateTotalStaggerDuration(
  childCount: number,
  staggerValue: number,
  baseDelay: number,
  delayChildren: number
): number {
  return baseDelay + delayChildren + (childCount * staggerValue);
}
