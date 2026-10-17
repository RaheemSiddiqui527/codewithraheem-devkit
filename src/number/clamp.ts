/**
 * Clamps a number within the inclusive bounds specified by `min` and `max`.
 *
 * @param value The number to clamp.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns The clamped number.
 * @throws {TypeError} If any argument is not a valid number or is `NaN`.
 * @throws {RangeError} If `min` is greater than `max`.
 *
 * @example
 * ```ts
 * clamp(10, 0, 5); // 5
 * clamp(-5, 0, 5); // 0
 * clamp(3, 0, 5); // 3
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    typeof min !== "number" ||
    Number.isNaN(min) ||
    typeof max !== "number" ||
    Number.isNaN(max)
  ) {
    throw new TypeError("All arguments to clamp must be valid numbers and not NaN");
  }

  if (min > max) {
    throw new RangeError(
      `Lower bound min (${min}) cannot be greater than upper bound max (${max})`
    );
  }

  return Math.min(Math.max(value, min), max);
}
